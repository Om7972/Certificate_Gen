const FraudAlert = require('../models/FraudAlert');

// @desc    Get all fraud alerts
// @route   GET /api/admin/fraud-alerts
// @access  Private/Admin
const getFraudAlerts = async (req, res) => {
    try {
        const alerts = await FraudAlert.find()
            .populate('user', 'name email')
            .populate('certificate', 'recipientName certificateId courseName')
            .sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update alert status (Resolve/Dismiss)
// @route   PUT /api/admin/fraud-alerts/:id
// @access  Private/Admin
const updateAlertStatus = async (req, res) => {
    try {
        const alert = await FraudAlert.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFraudAlerts,
    updateAlertStatus
};
