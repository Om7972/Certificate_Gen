const AuditLog = require('../models/AuditLog');

/**
 * Log an action to the audit database
 * @param {String} userId - ID of the user performing the action (optional)
 * @param {String} action - The action type (CREATED, VIEWED, etc)
 * @param {String} details - Description of the action
 * @param {String} ipAddress - IP of the request
 * @param {String} certificateId - ID of the certificate (optional)
 */
const logAction = async (userId, action, details, ipAddress = '', certificateId = null) => {
    try {
        await AuditLog.create({
            user: userId || null,
            certificate: certificateId,
            action,
            details,
            ipAddress
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = { logAction };
