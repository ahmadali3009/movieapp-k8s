// Script to clear existing users with plain text passwords
// Run this once after implementing bcrypt

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const usersignup = require('../model/signup');

async function clearUsers() {
    try {
        // Connect to database
        const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/movieapp";
        await mongoose.connect(dbUrl);
        console.log('Connected to database');

        // Clear all users
        const result = await usersignup.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users with plain text passwords`);
        console.log('Users can now re-register with secure hashed passwords');

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error clearing users:', error);
    }
}

clearUsers();
