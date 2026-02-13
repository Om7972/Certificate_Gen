const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true // Index for faster queries by issuer
    },
    certificateId: {
        type: String,
        required: [true, 'Please add a certificate ID'],
        unique: true,
        index: true // Unique index for fast lookup
    },
    recipientName: {
        type: String,
        required: [true, 'Please add recipient name'],
        index: true // Index for searching by name
    },
    recipientEmail: {
        type: String,
        required: [true, 'Please add recipient email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        index: true // Index for searching by email
    },
    courseName: {
        type: String,
        required: [true, 'Please add course/event name']
    },
    organization: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: 'For successfully completing the comprehensive professional development program.'
    },
    qrEnabled: {
        type: Boolean,
        default: true
    },
    watermarkEnabled: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: [true, 'Please add start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add end date']
    },
    templateUsed: {
        type: String,
        enum: ['classic', 'modern', 'minimal', 'dark', 'gold', 'professional', 'creative', 'academic', 'achievement'],
        default: 'classic'
    },
    grade: {
        type: String
    },
    recipientPhoto: {
        type: String,
        default: ''
    },
    expiresAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['valid', 'revoked', 'expired'],
        default: 'valid'
    },
    blockchainHash: {
        type: String,
        default: null
    },
    currentVersion: {
        type: Number,
        default: 1
    },
    isDownloaded: {
        type: Boolean,
        default: false
    },
    downloadReminderSent: {
        type: Boolean,
        default: false
    },
    expiryReminderSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for filtering by issuer and date
certificateSchema.index({ issuedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
