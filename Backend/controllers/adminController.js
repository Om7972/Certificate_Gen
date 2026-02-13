const User = require('../models/User');
const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCertificates = await Certificate.countDocuments();
        const verifications = await AuditLog.countDocuments({ action: 'VERIFY_CERTIFICATE' });

        // Active Users (Unique users who logged an action in last 30 days)
        const activeUserIds = await AuditLog.distinct('user', {
            createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            user: { $ne: null }
        });
        const activeUsers = activeUserIds.length;

        const recentLogs = await AuditLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Group certificates by month (Simple stats)
        // MongoDB Aggregation for charts
        const certificatesByMonth = await Certificate.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const topEvents = await Certificate.aggregate([
            { $group: { _id: "$courseName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            counts: {
                users: totalUsers,
                certificates: totalCertificates,
                verifications,
                activeUsers
            },
            recentLogs,
            charts: {
                certificatesByMonth,
                topEvents
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
    try {
        const { action, userId, startDate, endDate } = req.query;
        let query = {};

        if (action) {
            query.action = action;
        }

        if (userId) {
            query.user = userId;
        }

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await AuditLog.find(query)
            .populate('user', 'name email')
            .populate('certificate', 'certificateId recipientName')
            .sort({ timestamp: -1 })
            .limit(500);

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAuditLogs,
    getUsers
};
