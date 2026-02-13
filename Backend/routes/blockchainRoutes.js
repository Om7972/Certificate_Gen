const express = require('express');
const router = express.Router();
const { addBlock, verifyChain, getFullChain } = require('../controllers/blockchainController');
// Import protection middleware if needed, but verify is public
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addBlock);
router.get('/verify/:certificateId', verifyChain);
router.get('/chain', protect, getFullChain);

module.exports = router;
