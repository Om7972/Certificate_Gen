const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Object,
        required: true
    },
    previousHash: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema);
