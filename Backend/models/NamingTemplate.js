const mongoose = require('mongoose');

const namingTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pattern: {
        type: String,
        required: true, // Example: "Certificate of {achievement} in {course} {year}"
    },
    exampleValue: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NamingTemplate', namingTemplateSchema);
