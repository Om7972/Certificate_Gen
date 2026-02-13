const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Determine transporter
    // For local dev, we might use ethereal.email or just console log if no SMTP provided
    // But user asked for implementation.

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Matches certificat.env
            pass: process.env.EMAIL_PASSWORD // Matches certificat.env
        }
    });

    const message = {
        from: `Certificate Gen <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
