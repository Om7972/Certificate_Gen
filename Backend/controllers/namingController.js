const NamingTemplate = require('../models/NamingTemplate');

// @desc    Get all active naming templates
// @route   GET /api/naming/templates
// @access  Public
const getTemplates = async (req, res) => {
    try {
        const templates = await NamingTemplate.find({ isActive: true });
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new naming template
// @route   POST /api/naming/templates
// @access  Private (Admin)
const createTemplate = async (req, res) => {
    try {
        const { name, pattern } = req.body;
        const template = await NamingTemplate.create({
            name,
            pattern,
            createdBy: req.user.id
        });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate preview based on pattern and data
// @route   POST /api/naming/preview
// @access  Public
const generatePreview = async (req, res) => {
    try {
        const { pattern, data } = req.body;
        // Simple regex to replace {variable} with data[variable]
        let result = pattern;
        const regex = /\{(\w+)\}/g;
        let match;
        while ((match = regex.exec(pattern)) !== null) {
            const placeholder = match[0];
            const key = match[1];
            const replacement = data[key] || `[${key}]`;
            result = result.replace(placeholder, replacement);
        }
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTemplates,
    createTemplate,
    generatePreview
};
