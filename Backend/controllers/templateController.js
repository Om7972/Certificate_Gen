const Template = require('../models/Template');

// @desc    Create Template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res) => {
    try {
        const { name, canvasState, previewImage } = req.body;

        const template = await Template.create({
            name,
            canvasState,
            previewImage,
            createdBy: req.user.id
        });

        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Templates (Public & Own)
// @route   GET /api/templates
// @access  Private
const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find({
            $or: [
                { createdBy: req.user.id },
                { isPublic: true }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Template
// @route   GET /api/templates/:id
// @access  Private
const getTemplate = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        if (template.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await template.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTemplate,
    getTemplates,
    getTemplate,
    deleteTemplate
};
