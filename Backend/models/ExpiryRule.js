const mongoose = require('mongoose');

const expiryRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a rule name'],
        unique: true
    },
    strategy: {
        type: String,
        enum: ['TIME_BASED', 'EVENT_BASED', 'MANUAL'],
        required: true
    },
    targetCourse: {
        type: String,
        default: 'ALL', // Apply to all courses or a specific one
        index: true
    },
    // For TIME_BASED: Duration in days from issuance
    durationDays: {
        type: Number,
        default: null
    },
    // For EVENT_BASED: All certificates expire on this specific date
    fixedExpiryDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExpiryRule', expiryRuleSchema);
