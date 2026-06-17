const fs = require('fs');
const path = require('path');
if (fs.existsSync(path.join(__dirname, 'certificat.env'))) {
    require('dotenv').config({ path: path.join(__dirname, 'certificat.env') });
} else {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

// We will use standard HTTP requests to our local backend server running on port 5000
const adminEmail = 'odhumkekar@gmail.com';
const adminPassword = 'password123';
const baseUrl = 'http://localhost:5000';

async function runTests() {
    console.log('=== STARTING CERTGEN INTEGRATION TESTS ===');
    let token = '';

    try {
        // 1. Test Admin Login
        console.log('\n[TEST 1] Testing Admin Login...');
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail, password: adminPassword })
        });
        
        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }
        
        const loginData = await loginRes.json();
        token = loginData.token;
        console.log('✓ Admin Login Successful! Token retrieved.');

        // 2. Test Get Dashboard Stats (Admin Only)
        console.log('\n[TEST 2] Testing Dashboard Stats API (Admin Only)...');
        const statsRes = await fetch(`${baseUrl}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!statsRes.ok) {
            throw new Error(`Stats request failed: ${statsRes.status}`);
        }
        
        const statsData = await statsRes.json();
        console.log('✓ Dashboard Stats API is working:');
        console.log(`  - Total Certificates: ${statsData.counts.certificates}`);
        console.log(`  - Total System Users: ${statsData.counts.users}`);
        console.log(`  - Verifications Logged: ${statsData.counts.verifications}`);

        // 3. Test Get Audit Logs (Admin Only)
        console.log('\n[TEST 3] Testing Audit Logs API (Admin Only)...');
        const logsRes = await fetch(`${baseUrl}/api/admin/logs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!logsRes.ok) {
            throw new Error(`Audit Logs request failed: ${logsRes.status}`);
        }
        
        const logsData = await logsRes.json();
        console.log(`✓ Audit Logs API is working! Returned ${logsData.length} log records.`);

        // 4. Test Get Users List (Admin Only)
        console.log('\n[TEST 4] Testing Users List API (Admin Only)...');
        const usersRes = await fetch(`${baseUrl}/api/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!usersRes.ok) {
            throw new Error(`Users List request failed: ${usersRes.status}`);
        }
        
        const usersData = await usersRes.json();
        console.log(`✓ Users List API is working! Found ${usersData.length} registered system users.`);

        // 5. Test Expiry Rules (Admin Only)
        console.log('\n[TEST 5] Testing Expiry Rules Retrieval...');
        const rulesRes = await fetch(`${baseUrl}/api/admin/expiry-rules`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!rulesRes.ok) {
            throw new Error(`Rules request failed: ${rulesRes.status}`);
        }
        
        const rulesData = await rulesRes.json();
        console.log(`✓ Expiry Rules API is working! Active rules count: ${rulesData.length}`);

        // 6. Test Fraud Alerts (Admin Only)
        console.log('\n[TEST 6] Testing Fraud Alerts API...');
        const fraudRes = await fetch(`${baseUrl}/api/admin/fraud-alerts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!fraudRes.ok) {
            throw new Error(`Fraud Alerts request failed: ${fraudRes.status}`);
        }
        
        const fraudData = await fraudRes.json();
        console.log(`✓ Fraud Alerts API is working!`);

        // 7. Test Certificate Generation (Standard Action by Admin)
        console.log('\n[TEST 7] Testing Certificate Generation under Admin...');
        const certRes = await fetch(`${baseUrl}/api/certificates`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipientName: 'Test Student',
                recipientEmail: 'student@example.com',
                courseName: 'DBMS SCE Admin Test Course',
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiry
            })
        });

        if (!certRes.ok) {
            throw new Error(`Certificate Generation failed: ${certRes.status}`);
        }

        const certData = await certRes.json();
        console.log(`✓ Certificate Generation Successful! ID: ${certData.data ? certData.data._id : 'N/A'}`);

        console.log('\n=============================================');
        console.log('✓ ALL CERTGEN INTEGRATION TESTS PASSED!');
        console.log('=============================================');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
        process.exit(1);
    }
}

// Start tests
runTests();
