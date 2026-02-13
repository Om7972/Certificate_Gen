require('dotenv').config({ path: './certificat.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const upload = require('multer')({ dest: 'uploads/' }); // Basic setup if needed elsewhere, but routes handle specifics usually
const fs = require('fs');
const XLSX = require('xlsx');
const cron = require('node-cron');
const { checkExpirations, sendScheduledReminders } = require('./controllers/certificateController');
const { evaluateRules } = require('./controllers/expiryController');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded photos

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/verify', require('./routes/verifyRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/naming', require('./routes/namingRoutes'));

// Bulk Upload Route - Kept here or move to controller? 
// For cleaner architecture, moving logic to controller is better, but user asked for specific REST structure.
// Let's keep specific bulk endpoint separate or integrate. 
// However, the user request specifically asked for CRUD on /api/certificates. 
// I will keep the bulk upload here for now to avoid breaking existing frontend logic fully, 
// but essentially it should also be modularized.
const { protect } = require('./middleware/authMiddleware');
const Certificate = require('./models/Certificate'); // New Model

// Legacy endpoints support (or refactored into new structure)
// The user asked for "Build REST API", implying a clean start or refactor.
// I'll ensure the /api/bulk-certificates logic uses the new Model.

app.post('/api/bulk-certificates', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Map and add user ID
    const certificatesToInsert = data.map(row => ({
      issuedBy: req.user.id,
      recipientName: row['Recipient Name'] || row['Name'],
      recipientEmail: row['Email'],
      courseName: row['Course Name'] || row['Course'],
      startDate: new Date(row['Start Date']),
      endDate: new Date(row['End Date']),
      certificateId: `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 100)}`
    }));

    const certificates = await Certificate.insertMany(certificatesToInsert);

    fs.unlinkSync(req.file.path); // Cleanup
    res.json({ success: true, count: certificates.length });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

const { sendCertificateEmail } = require('./services/emailService');

app.post('/api/send-certificate', protect, async (req, res) => {
  try {
    const { email, name, course, pdfData } = req.body;

    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    await sendCertificateEmail(email, name, course, pdfBuffer);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error Middleware
app.use(errorHandler);

// Cron Job: Check for expired certificates daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running daily tasks...');
  await evaluateRules();
  await checkExpirations();
  await sendScheduledReminders();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Run once on startup to sync
  evaluateRules();
  checkExpirations();
});