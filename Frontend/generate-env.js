const fs = require('fs');
const path = require('path');

// 1. Resolve API_BASE_URL (process.env takes precedence over .env file)
let apiBaseUrl = process.env.API_BASE_URL || '';

const envPath = path.join(__dirname, '.env');
if (!apiBaseUrl && fs.existsSync(envPath)) {
    console.log('Reading API_BASE_URL from .env file...');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^API_BASE_URL\s*=\s*(.+)$/m);
    if (match && match[1]) {
        apiBaseUrl = match[1].trim();
    }
}

// Fallback default if nothing is configured
if (!apiBaseUrl) {
    apiBaseUrl = 'https://dbms-sce-backend.onrender.com';
    console.log(`No API_BASE_URL found. Using fallback: ${apiBaseUrl}`);
} else {
    console.log(`Resolved API_BASE_URL: ${apiBaseUrl}`);
}

// Strip trailing slash if present
apiBaseUrl = apiBaseUrl.replace(/\/$/, '');

// 2. Inject into js/auth.js
const authJsPath = path.join(__dirname, 'js', 'auth.js');
if (fs.existsSync(authJsPath)) {
    let authContent = fs.readFileSync(authJsPath, 'utf8');
    
    // Regex matches the URL inside quotes followed by any optional wrapping code and the comment: // Production Backend URL
    const regex = /(['"`])(https?:\/\/[^'"`\)]+)(['"`])(.*?)\/\/\s*Production\s+Backend\s+URL/i;
    
    if (regex.test(authContent)) {
        authContent = authContent.replace(regex, `$1${apiBaseUrl}$3$4// Production Backend URL`);
        fs.writeFileSync(authJsPath, authContent, 'utf8');
        console.log(`Successfully updated production backend URL in js/auth.js to: ${apiBaseUrl}`);
    } else {
        console.warn('Could not find the Production Backend URL pattern in js/auth.js.');
    }
} else {
    console.error('js/auth.js not found!');
}
