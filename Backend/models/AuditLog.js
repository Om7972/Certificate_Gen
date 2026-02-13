const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: false
    },
    action: {
        type: String, // e.g., 'CREATED', 'VIEWED', 'DOWNLOADED', 'VERIFIED', 'REVOKED'
        required: true
    },
    details: {
        type: String, // Description or metadata
        default: ''
    },
    ipAddress: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
