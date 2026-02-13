const express = require('express');
const router = express.Router();
const { verifyCertificatePublic } = require('../controllers/certificateController');

// @route   GET /api/verify/:certId
// @desc    Verify certificate public endpoint (Alias)
// @access  Public
router.get('/:certId', verifyCertificatePublic);

module.exports = router;
