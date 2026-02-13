const Certificate = require('../models/Certificate');
const FraudAlert = require('../models/FraudAlert');

/**
 * Perform rule-based fraud detection on a newly created certificate
 * @param {Object} certificate - The certificate object
 * @param {String} userId - The ID of the user who issued it
 */
const detectFraud = async (certificate, userId) => {
    try {
        const issues = [];

        // 1. Check for Duplicate Recipient + Course
        const duplicate = await Certificate.findOne({
            recipientEmail: certificate.recipientEmail,
            courseName: certificate.courseName,
            _id: { $ne: certificate._id },
            status: 'valid'
        });

        if (duplicate) {
            issues.push({
                type: 'DUPLICATE_RECIPIENT',
                severity: 'HIGH',
                details: `Duplicate certificate detected for ${certificate.recipientEmail} in course "${certificate.courseName}".`
            });
        }

        // 2. Check Generation Frequency (Abnormal Activity)
        // Rule: More than 5 certificates in the last 1 minute
        const oneMinuteAgo = new Date(Date.now() - 60000);
        const recentCertsCount = await Certificate.countDocuments({
            issuedBy: userId,
            createdAt: { $gte: oneMinuteAgo }
        });

        if (recentCertsCount > 5) {
            issues.push({
                type: 'HIGH_FREQUENCY',
                severity: 'MEDIUM',
                details: `User generated ${recentCertsCount} certificates in the last 60 seconds.`
            });
        }

        // 3. Suspicious Name patterns (Placeholder for "AI" logic)
        // Flags names that look like test data or generic placeholders
        const suspiciousPatterns = ['test', 'admin', 'unknown', 'placeholder', 'dummy'];
        const nameLower = certificate.recipientName.toLowerCase();
        if (suspiciousPatterns.some(p => nameLower.includes(p))) {
            issues.push({
                type: 'SUSPICIOUS_CONTENT',
                severity: 'LOW',
                details: `Recipient name "${certificate.recipientName}" contains suspicious patterns.`
            });
        }

        // Save alerts if any issues found
        for (const issue of issues) {
            await FraudAlert.create({
                user: userId,
                certificate: certificate._id,
                ...issue
            });
            console.log(`[FRAUD DETECTION] Flagged ${issue.type} for user ${userId}`);
        }

        return issues.length > 0;
    } catch (error) {
        console.error('[FRAUD DETECTION ERROR]:', error);
        return false;
    }
};

module.exports = { detectFraud };
