const crypto = require('crypto');
const Block = require('../models/Block');
const Certificate = require('../models/Certificate');

// Helper to calculate Hash
const calculateHash = (index, previousHash, timestamp, data) => {
    // Ensure data is stringified consistently
    // We sort keys to ensure object property order doesn't affect hash
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(String(index) + previousHash + String(timestamp) + dataString).digest('hex');
};

// @desc    Add a Block (Certificate) to the Blockchain
// @route   POST /api/blockchain/add
// @access  Internal/Private
const addBlock = async (req, res) => {
    try {
        const { certificateId, data } = req.body;

        if (!certificateId || !data) {
            return res.status(400).json({ message: 'Certificate ID and Data required' });
        }

        // Get latest block
        const latestBlock = await Block.findOne().sort({ index: -1 });

        let index = 0;
        let previousHash = '0'; // Genesis previous hash

        if (latestBlock) {
            index = latestBlock.index + 1;
            previousHash = latestBlock.hash;
        }

        const timestamp = Date.now(); // Store as number for consistency
        const hash = calculateHash(index, previousHash, timestamp, data);

        const newBlock = await Block.create({
            index,
            timestamp,
            certificateId,
            data,
            previousHash,
            hash
        });

        res.status(201).json({
            success: true,
            block: newBlock
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Certificate Integrity via Blockchain
// @route   GET /api/blockchain/verify/:certificateId
// @access  Public
const verifyChain = async (req, res) => {
    try {
        const { certificateId } = req.params;

        // 1. Find Block
        const block = await Block.findOne({ certificateId });

        if (!block) {
            return res.status(404).json({ verified: false, message: 'Block not found for this Certificate ID' });
        }

        // 2. Extract Data (Convert to plain object to match storage)
        // Mongoose document to object
        const blockData = block.toObject();
        const { index, previousHash, timestamp, data, hash } = blockData;

        // 3. Recalculate Hash
        // timestamp stored as Date in schema, so let's check schema
        // I changed schema to Date, but here used Date.now() (number).
        // If schema is Date, Mongoose casts number to Date.
        // When retrieving, we get Date object.
        // We need `.getTime()` to match the number used in calculation.

        let timestampMs = timestamp;
        if (timestamp instanceof Date) {
            timestampMs = timestamp.getTime();
        }

        const recalculatedHash = calculateHash(index, previousHash, timestampMs, data);

        // 4. Verify Matches
        if (hash !== recalculatedHash) {
            return res.status(200).json({
                verified: false,
                message: 'Hash Mismatch! Data validation failed.',
                details: { stored: hash, calculated: recalculatedHash }
            });
        }

        // 5. Verify Previous Block Linkage
        if (index > 0) {
            const prevBlock = await Block.findOne({ index: index - 1 });
            if (!prevBlock || prevBlock.hash !== previousHash) {
                return res.status(200).json({
                    verified: false,
                    message: 'Chain broken! Previous hash mismatch.'
                });
            }
        }

        res.status(200).json({
            verified: true,
            message: 'Blockchain Verified: Certificate Integrity Confirmed.',
            block: {
                index,
                timestamp,
                hash,
                previousHash
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get Full Chain
const getFullChain = async (req, res) => {
    try {
        const chain = await Block.find().sort({ index: 1 });
        res.status(200).json(chain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addBlock,
    verifyChain,
    getFullChain
};
