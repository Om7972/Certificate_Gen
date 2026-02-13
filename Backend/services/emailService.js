const nodemailer = require('nodemailer');
const path = require('path');

// Configure Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App Password
    }
});

/**
 * Send Certificate Email (With Attachment)
 */
const sendCertificateEmail = async (to, name, courseName, pdfBuffer) => {
    try {
        const mailOptions = {
            from: `"Certificate Gen" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Your Certificate for ${courseName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Certificate of Achievement</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                        <p>Dear <strong>${name}</strong>,</p>
                        <p>Congratulations on successfully completing <strong>${courseName}</strong>!</p>
                        <p>Please find your official certificate attached to this email.</p>
                        <br>
                        <p>Best Regards,</p>
                        <p>The Organization Team</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                        &copy; ${new Date().getFullYear()} Certificate Generator. All rights reserved.
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: `${name.replace(/\s+/g, '_')}_Certificate.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Send Issuance Notification (No attachment)
 */
const sendIssuanceNotification = async (to, name, courseName) => {
    try {
        const mailOptions = {
            from: `"Certificate Gen" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Congratulations! Your Certificate for ${courseName} is Ready`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">New Certificate Issued</h2>
                    </div>
                    <div style="padding: 30px;">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Congratulations on completing your course! Your official certificate for <strong>${courseName}</strong> has been issued and is now ready for retrieval.</p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000/history.html" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Certificate</a>
                        </div>
                        <br>
                        <p>Best Regards,<br>Certificate Gen Team</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Issuance notification error:', error);
    }
};

/**
 * Send Download Reminder
 */
const sendDownloadReminder = async (to, name, courseName) => {
    try {
        const mailOptions = {
            from: `"Certificate Gen" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Action Required: Download Your Certificate for ${courseName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Gentle Reminder</h2>
                    </div>
                    <div style="padding: 30px;">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>We noticed you haven't downloaded your certificate for <strong>${courseName}</strong> yet.</p>
                        <p>Your hard work deserves to be showcased! Log in to your dashboard to download your official certificate.</p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000/history.html" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Now</a>
                        </div>
                        <br>
                        <p>Best Regards,<br>Certificate Gen Team</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Download reminder error:', error);
    }
};

/**
 * Send Expiry Reminder
 */
const sendExpiryReminder = async (to, name, courseName, expiryDate) => {
    try {
        const mailOptions = {
            from: `"Certificate Gen" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: `Attention: Your Certificate for ${courseName} is Expiring Soon`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #ef4444; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Expiry Warning</h2>
                    </div>
                    <div style="padding: 30px;">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>This is to inform you that your certificate for <strong>${courseName}</strong> is set to expire on <strong>${new Date(expiryDate).toLocaleDateString()}</strong>.</p>
                        <p>Please ensure you have a copy or contact your administrator if you need a renewal.</p>
                        <br>
                        <p>Best Regards,<br>Certificate Gen Team</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Expiry reminder error:', error);
    }
};

module.exports = {
    sendCertificateEmail,
    sendIssuanceNotification,
    sendDownloadReminder,
    sendExpiryReminder
};
