const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate'
    },
    type: {
        type: String,
        enum: ['DUPLICATE_RECIPIENT', 'HIGH_FREQUENCY', 'SUSPICIOUS_CONTENT'],
        required: true
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
        default: 'PENDING'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FraudAlert', fraudAlertSchema);
