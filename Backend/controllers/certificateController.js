const Certificate = require('../models/Certificate');
const User = require('../models/User');
const CertificateVersion = require('../models/CertificateVersion');
const { logAction } = require('../utils/logger');
const xlsx = require('xlsx');
const AuditLog = require('../models/AuditLog');
const { sendDownloadReminder, sendExpiryReminder, sendIssuanceNotification } = require('../services/emailService');
const { detectFraud } = require('../utils/fraudDetection');

// @desc    Get certificates with pagination
// @route   GET /api/certificates
// @access  Private
const getCertificates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.user.role !== 'admin') {
            // Use issuedBy instead of user
            query = { issuedBy: req.user.id };
        }

        const certificates = await Certificate.find(query)
            .populate('issuedBy', 'name email') // Join with User collection
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Certificate.countDocuments(query);

        res.status(200).json({
            success: true,
            count: certificates.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: certificates
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private
const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('issuedBy', 'name email');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Access check
        if (req.user.role !== 'admin' && certificate.issuedBy._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
    try {
        const { recipientName, recipientEmail, courseName, startDate, endDate, certificateId, templateUsed } = req.body;

        if (!recipientName || !recipientEmail || !courseName || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Auto-generate ID if not provided
        const finalCertId = certificateId || `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Handle Photo Upload
        const recipientPhoto = req.file ? req.file.path.replace(/\\/g, "/") : '';

        const certificate = await Certificate.create({
            issuedBy: req.user.id,
            certificateId: finalCertId,
            recipientName,
            recipientEmail,
            courseName,
            startDate,
            endDate,
            templateUsed: templateUsed || 'classic',
            expiresAt: req.body.expiresAt || null,
            recipientPhoto
        });

        // Log action
        logAction(req.user.id, 'CREATED', `Created certificate for ${recipientName} (${finalCertId})`, req.ip, certificate._id);

        // Run AI Fraud Detection
        detectFraud(certificate, req.user.id);

        // Send Issuance Notification
        sendIssuanceNotification(recipientEmail, recipientName, courseName);

        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Access check
        if (req.user.role !== 'admin' && certificate.issuedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await certificate.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify certificate (Public)
// @route   GET /api/certificates/verify/:certId
// @access  Public
const verifyCertificatePublic = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certId })
            .populate('issuedBy', 'name email'); // Populate issuer details

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Log public verification
        logAction(null, 'VERIFIED', `Public verification for ${req.params.certId}`, req.ip, certificate._id);

        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get certificate metadata for sharing (social cards)
// @route   GET /api/certificates/share/:certId
// @access  Public
const getShareMetadata = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certId });

        if (!certificate) {
            return res.status(404).send('Certificate not found');
        }

        // Return a minimal HTML page with meta tags for social bots
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Achievement - ${certificate.recipientName}</title>
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="http://localhost:3000/share.html?id=${certificate.certificateId}">
    <meta property="og:title" content="Verified Achievement: ${certificate.courseName}">
    <meta property="og:description" content="${certificate.recipientName} has successfully completed ${certificate.courseName}. Verified by CertGen Blockchain.">
    <meta property="og:image" content="http://localhost:3000/assets/og-preview.png"> <!-- Fallback or generated preview -->

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="Verified Achievement: ${certificate.courseName}">
    <meta property="twitter:description" content="${certificate.recipientName} has successfully completed ${certificate.courseName}.">
    
    <script>
        // Redirect real users to the actual frontend share page
        window.location.href = "http://localhost:3000/share.html?id=${certificate.certificateId}";
    </script>
</head>
<body>
    <h1>Certificate for ${certificate.recipientName}</h1>
    <p>Loading certificate details...</p>
</body>
</html>`;

        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading metadata');
    }
};

// @desc    Create multiple certificates (Bulk)
// @route   POST /api/certificates/bulk
// @access  Private
const createBulkCertificates = async (req, res) => {
    try {
        const certificatesData = req.body; // Expects an array of certificate objects

        if (!Array.isArray(certificatesData) || certificatesData.length === 0) {
            return res.status(400).json({ message: 'No certificate data provided' });
        }

        // Add issuer to each certificate
        const certificatesWithIssuer = certificatesData.map(cert => ({
            ...cert,
            issuedBy: req.user._id,
            certificateId: cert.certificateId || `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }));

        const createdCertificates = await Certificate.insertMany(certificatesWithIssuer);

        // Log action (Optional if AuditLog is setup)
        logAction(req.user._id, 'BULK_GENERATE', `Generated ${createdCertificates.length} certificates`, req.ip);

        res.status(201).json(createdCertificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk Upload via Excel
// @route   POST /api/certificates/bulk-upload
// @access  Private
const bulkUploadCertificates = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(req.file.path ? require('fs').readFileSync(req.file.path) : req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        const certificates = [];
        const errors = [];

        for (const [index, row] of data.entries()) {
            const name = row['Name'] || row['Recipient Name'];
            const email = row['Email'] || row['Recipient Email'];
            const course = row['Course'] || row['Course Name'];
            const dateStr = row['Date'] || row['End Date'];

            if (!name || !course) {
                errors.push(`Row ${index + 2}: Missing Name or Course`);
                continue;
            }

            certificates.push({
                recipientName: name,
                recipientEmail: email || '',
                courseName: course,
                date: dateStr ? new Date(dateStr) : new Date(),
                certificateId: `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}-${index}`,
                issuedBy: req.user.id,
                templateUsed: 'classic' // Default
            });
        }

        if (certificates.length > 0) {
            await Certificate.insertMany(certificates);

            // Log Action
            try {
                // Assuming AuditLog is available and not strictly required
                await AuditLog.create({
                    user: req.user.id,
                    action: 'BULK_UPLOAD',
                    details: `Uploaded ${certificates.length} certificates via Excel`
                });
            } catch (e) { console.error("Audit Log Error", e); }
        }

        res.status(201).json({
            success: true,
            count: certificates.length,
            errors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Revoke a certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private
const revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

        // Check ownership
        if (certificate.issuedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        certificate.status = 'revoked';
        await certificate.save();

        logAction(req.user.id, 'REVOKED', `Revoked certificate ${certificate.certificateId}`, req.ip, certificate._id);
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check Expirations (Cron Job)
const checkExpirations = async () => {
    try {
        const result = await Certificate.updateMany(
            { expiresAt: { $lt: new Date() }, status: 'valid' },
            { $set: { status: 'expired' } }
        );
        if (result.modifiedCount > 0) {
            console.log(`[CRON] Expired ${result.modifiedCount} certificates.`);
        }
    } catch (error) {
        console.error('Expiration Check Error:', error);
    }
};

// @desc    Get timeline logs for a specific certificate
// @route   GET /api/certificates/:id/timeline
// @access  Private
const getTimeline = async (req, res) => {
    try {
        const logs = await AuditLog.find({ certificate: req.params.id })
            .populate('user', 'name email')
            .sort({ timestamp: -1 });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record an action on a certificate (DOWNLOADED, VIEWED, etc)
// @route   POST /api/certificates/:id/log
// @access  Private/Public
const recordAction = async (req, res) => {
    try {
        const { action, details } = req.body;
        const certId = req.params.id;

        // Find existing certificate by ID or certificateId string
        let cert = await Certificate.findById(certId);
        if (!cert) {
            cert = await Certificate.findOne({ certificateId: certId });
        }

        if (!cert) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        await logAction(
            req.user ? req.user.id : null,
            action,
            details || `Action performed: ${action}`,
            req.ip,
            cert._id
        );

        // Track download state in the certificate itself
        if (action === 'DOWNLOADED' && !cert.isDownloaded) {
            cert.isDownloaded = true;
            await cert.save();
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update certificate and create new version
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Check ownership
        if (certificate.issuedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update' });
        }

        // 1. Save snapshot of current (to be "old") state as a Version
        await CertificateVersion.create({
            parentCertificate: certificate._id,
            versionNumber: certificate.currentVersion,
            updatedBy: req.user.id,
            changeSummary: req.body.changeSummary || 'Details updated',
            data: {
                recipientName: certificate.recipientName,
                recipientEmail: certificate.recipientEmail,
                courseName: certificate.courseName,
                startDate: certificate.startDate,
                endDate: certificate.endDate,
                templateUsed: certificate.templateUsed,
                status: certificate.status,
                recipientPhoto: certificate.recipientPhoto
            }
        });

        // 2. Update certificate with new data
        certificate.recipientName = req.body.recipientName || certificate.recipientName;
        certificate.courseName = req.body.courseName || certificate.courseName;
        certificate.startDate = req.body.startDate || certificate.startDate;
        certificate.endDate = req.body.endDate || certificate.endDate;
        certificate.templateUsed = req.body.templateUsed || certificate.templateUsed;

        // Increment version
        certificate.currentVersion += 1;

        const updatedCert = await certificate.save();

        // Log the edit
        logAction(req.user.id, 'EDITED', `Updated to version ${certificate.currentVersion}`, req.ip, certificate._id);

        res.status(200).json(updatedCert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get version history
// @route   GET /api/certificates/:id/versions
// @access  Private
const getVersions = async (req, res) => {
    try {
        const versions = await CertificateVersion.find({ parentCertificate: req.params.id })
            .populate('updatedBy', 'name email')
            .sort({ versionNumber: -1 });

        res.status(200).json(versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get usage statistics for heatmap
// @route   GET /api/certificates/stats/usage
// @access  Private (Admin/Issuer)
const getUsageStats = async (req, res) => {
    try {
        const stats = await AuditLog.aggregate([
            {
                $match: {
                    action: { $in: ['VIEWED', 'VERIFIED'] }
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$timestamp" }, // 1 (Sun) to 7 (Sat)
                    hour: { $hour: "$timestamp" }           // 0 to 23
                }
            },
            {
                $group: {
                    _id: { day: "$dayOfWeek", hour: "$hour" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.day": 1, "_id.hour": 1 }
            }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Scheduled Task: Send Reminders (Cron Job)
const sendScheduledReminders = async () => {
    try {
        console.log('[CRON] Starting Notification Checks...');

        // 1. Check for missing downloads (7 days after creation)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const undownloaded = await Certificate.find({
            isDownloaded: false,
            downloadReminderSent: false,
            createdAt: { $lt: sevenDaysAgo }
        });

        for (const cert of undownloaded) {
            await sendDownloadReminder(cert.recipientEmail, cert.recipientName, cert.courseName);
            cert.downloadReminderSent = true;
            await cert.save();
            console.log(`[CRON] Download reminder sent to ${cert.recipientEmail}`);
        }

        // 2. Check for upcoming expiries (30 days before expiry)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiring = await Certificate.find({
            status: 'valid',
            expiresAt: { $ne: null, $lt: thirtyDaysFromNow },
            expiryReminderSent: false
        });

        for (const cert of expiring) {
            await sendExpiryReminder(cert.recipientEmail, cert.recipientName, cert.courseName, cert.expiresAt);
            cert.expiryReminderSent = true;
            await cert.save();
            console.log(`[CRON] Expiry reminder sent to ${cert.recipientEmail}`);
        }

    } catch (error) {
        console.error('[CRON ERROR] Notification Check failed:', error);
    }
};

module.exports = {
    getCertificates,
    getCertificate,
    createCertificate,
    createBulkCertificates,
    deleteCertificate,
    verifyCertificatePublic,
    bulkUploadCertificates,
    revokeCertificate,
    checkExpirations,
    getTimeline,
    recordAction,
    updateCertificate,
    getVersions,
    getUsageStats,
    sendScheduledReminders,
    getShareMetadata
};
