const express = require('express');
const router = express.Router();
const {
    getCertificates,
    getCertificate,
    createCertificate,
    createBulkCertificates,
    deleteCertificate,
    verifyCertificatePublic,
    bulkUploadCertificates,
    revokeCertificate,
    getTimeline,
    recordAction,
    updateCertificate,
    getVersions,
    getUsageStats,
    getShareMetadata
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Analytics and Stats
router.get('/stats/usage', protect, getUsageStats);

router.route('/')
    .get(protect, getCertificates)
    .post(protect, upload.single('recipientPhoto'), createCertificate);

router.post('/bulk', protect, createBulkCertificates); // JSON Body
router.post('/bulk-upload', protect, upload.single('bulkFile'), bulkUploadCertificates); // Excel File

router.route('/:id')
    .get(protect, getCertificate)
    .put(protect, updateCertificate)
    .delete(protect, deleteCertificate);

router.get('/:id/versions', protect, getVersions);
router.put('/:id/revoke', protect, revokeCertificate);
router.get('/:id/timeline', protect, getTimeline);
router.post('/:id/log', recordAction); // Open for public view logs, etc.

// Public verification & sharing routes
router.get('/verify/:certId', verifyCertificatePublic);
router.get('/share/:certId', getShareMetadata);

module.exports = router;
