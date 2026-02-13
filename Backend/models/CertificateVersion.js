const mongoose = require('mongoose');

const certificateVersionSchema = new mongoose.Schema({
    parentCertificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: true,
        index: true
    },
    versionNumber: {
        type: Number,
        required: true
    },
    data: {
        recipientName: String,
        recipientEmail: String,
        courseName: String,
        startDate: Date,
        endDate: Date,
        templateUsed: String,
        status: String,
        recipientPhoto: String
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    changeSummary: {
        type: String,
        default: 'No summary provided'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for fast retrieval of history for a specific certificate
certificateVersionSchema.index({ parentCertificate: 1, versionNumber: -1 });

module.exports = mongoose.model('CertificateVersion', certificateVersionSchema);
