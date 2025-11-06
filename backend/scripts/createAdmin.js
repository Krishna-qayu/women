const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const connectDb = require('../config/connectionDb');

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDb();
        
        const username = process.argv[2] || 'admin';
        const password = process.argv[3] || 'admin123';

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin({
            username,
            password
        });

        await admin.save();
        console.log(`Admin user created successfully!`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log('\nPlease change the default password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

