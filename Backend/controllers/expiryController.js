const ExpiryRule = require('../models/ExpiryRule');
const Certificate = require('../models/Certificate');
const { logAction } = require('../utils/logger');

// @desc    Create new expiry rule
// @route   POST /api/admin/expiry-rules
// @access  Private/Admin
const createRule = async (req, res) => {
    try {
        const rule = await ExpiryRule.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all expiry rules
// @route   GET /api/admin/expiry-rules
// @access  Private/Admin
const getRules = async (req, res) => {
    try {
        const rules = await ExpiryRule.find().populate('createdBy', 'name');
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Evaluate and apply rules to certificates
const evaluateRules = async () => {
    try {
        console.log('[RULES ENGINE] Evaluating active expiry rules...');
        const activeRules = await ExpiryRule.find({ isActive: true });

        for (const rule of activeRules) {
            let filter = { status: 'valid' };
            if (rule.targetCourse !== 'ALL') {
                filter.courseName = rule.targetCourse;
            }

            const certs = await Certificate.find(filter);
            let updateCount = 0;

            for (const cert of certs) {
                let newExpiry = null;

                if (rule.strategy === 'TIME_BASED' && rule.durationDays) {
                    newExpiry = new Date(cert.createdAt);
                    newExpiry.setDate(newExpiry.getDate() + rule.durationDays);
                } else if (rule.strategy === 'EVENT_BASED' && rule.fixedExpiryDate) {
                    newExpiry = new Date(rule.fixedExpiryDate);
                }

                // Update only if expiry has changed
                if (newExpiry && (!cert.expiresAt || cert.expiresAt.getTime() !== newExpiry.getTime())) {
                    cert.expiresAt = newExpiry;
                    await cert.save();
                    updateCount++;
                }
            }
            if (updateCount > 0) {
                console.log(`[RULES ENGINE] Rule "${rule.name}" updated ${updateCount} certificates.`);
            }
        }
    } catch (error) {
        console.error('[RULES ENGINE ERROR]:', error);
    }
};

// @desc    Delete a rule
const deleteRule = async (req, res) => {
    try {
        await ExpiryRule.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Rule removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRule,
    getRules,
    evaluateRules,
    deleteRule
};
