require('dotenv').config({ path: './certificat.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const setAdmin = async () => {
    try {
        await connectDB();

        const email = 'odhumkekar@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Successfully updated ${email} to admin.`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

setAdmin();
