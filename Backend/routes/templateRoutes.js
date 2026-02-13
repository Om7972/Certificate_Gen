const express = require('express');
const router = express.Router();
const { createTemplate, getTemplates, getTemplate, deleteTemplate } = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTemplate)
    .get(protect, getTemplates);

router.route('/:id')
    .get(protect, getTemplate)
    .delete(protect, deleteTemplate);

module.exports = router;
