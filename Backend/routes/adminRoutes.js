const express = require('express');
const router = express.Router();
const { getDashboardStats, getAuditLogs, getUsers } = require('../controllers/adminController');
const { createRule, getRules, deleteRule } = require('../controllers/expiryController');
const { getFraudAlerts, updateAlertStatus } = require('../controllers/fraudController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/logs', protect, admin, getAuditLogs);
router.get('/users', protect, admin, getUsers);

// Expiry Rules
router.post('/expiry-rules', protect, admin, createRule);
router.get('/expiry-rules', protect, admin, getRules);
router.delete('/expiry-rules/:id', protect, admin, deleteRule);

// Fraud Detection
router.get('/fraud-alerts', protect, admin, getFraudAlerts);
router.put('/fraud-alerts/:id', protect, admin, updateAlertStatus);

module.exports = router;
