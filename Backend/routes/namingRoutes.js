const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, generatePreview } = require('../controllers/namingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/templates', getTemplates);
router.post('/templates', protect, createTemplate);
router.post('/preview', generatePreview);

module.exports = router;
