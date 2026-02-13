const API_URL = 'http://localhost:5000/api/auth';

// Register User
async function register(name, email, password, role) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful, saving user data...');
            localStorage.setItem('user', JSON.stringify(data));
            console.log('Redirecting to index.html...');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Login User
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful, saving user data...');
            localStorage.setItem('user', JSON.stringify(data));
            console.log('Redirecting to index.html...');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}




// Logout User
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // Redirect to login if on protected page (optional logic)
        // For now, we will just update UI
    }
    return user;
}

// Update UI based on auth status
function updateUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('mainNavLinks');
    const authButtons = document.getElementById('authButtons');

    // Check if we are on the new landing page (index.html)
    if (!navLinks || !authButtons) {
        // Fallback for older pages if they still use the old structure
        const legacyNavLinks = document.querySelector('.nav-links');
        if (legacyNavLinks && user) {
            legacyNavLinks.innerHTML = `
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="generator.html">Generator</a></li>
                <li><a href="history.html">History</a></li>
                <li><button onclick="logout()" class="btn-secondary">Logout (${user.name})</button></li>
            `;
        }
        return;
    }

    if (user) {
        // 1. Add Dashboard, Generator, History to center links if they don't exist
        if (!document.getElementById('nav-dashboard')) {
            const dashboardLi = document.createElement('li');
            dashboardLi.className = 'nav-item';
            dashboardLi.id = 'nav-dashboard';
            dashboardLi.innerHTML = `<a class="nav-link px-3" href="dashboard.html">Dashboard</a>`;
            navLinks.appendChild(dashboardLi);

            const generatorLi = document.createElement('li');
            generatorLi.className = 'nav-item';
            generatorLi.id = 'nav-generator';
            generatorLi.innerHTML = `<a class="nav-link px-3" href="generator.html">Generator</a>`;
            navLinks.appendChild(generatorLi);

            const historyLi = document.createElement('li');
            historyLi.className = 'nav-item';
            historyLi.id = 'nav-history';
            historyLi.innerHTML = `<a class="nav-link px-3" href="history.html">History</a>`;
            navLinks.appendChild(historyLi);
        }

        // 2. Replace Login/Register buttons with Profile & Logout
        const userName = user.name || 'User';
        const roleBadge = user.role === 'admin' ? `<span class="badge bg-danger ms-1">Admin</span>` : '';
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary rounded-pill px-4 fw-semibold dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle fs-5"></i>
                    <span>${userName}</span>
                    ${roleBadge}
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2">
                    <li><a class="dropdown-item rounded py-2" href="dashboard.html"><i class="fas fa-th-large me-2 text-primary"></i> Dashboard</a></li>
                    <li><a class="dropdown-item rounded py-2" href="generator.html"><i class="fas fa-magic me-2 text-primary"></i> Create Certificate</a></li>
                    <li><a class="dropdown-item rounded py-2" href="naming-engine.html"><i class="fas fa-robot me-2 text-primary"></i> Smart Naming</a></li>
                    <li><a class="dropdown-item rounded py-2" href="generator.html#watermark"><i class="fas fa-stamp me-2 text-primary"></i> Watermark Control</a></li>
                    <li><a class="dropdown-item rounded py-2" href="analytics.html"><i class="fas fa-chart-line me-2 text-primary"></i> Usage Analytics</a></li>
                    <li><a class="dropdown-item rounded py-2" href="notifications.html"><i class="fas fa-bell me-2 text-primary"></i> Smart Notifications</a></li>
                    <li><a class="dropdown-item rounded py-2" href="history.html"><i class="fas fa-share-alt me-2 text-primary"></i> Sharing Hub</a></li>
                    ${user.role === 'admin' ? '<li><a class="dropdown-item rounded py-2" href="audit-logs.html"><i class="fas fa-shield-alt me-2 text-primary"></i> Audit Logs</a></li>' : ''}
                    ${user.role === 'admin' ? '<li><a class="dropdown-item rounded py-2" href="expiry-rules.html"><i class="fas fa-hourglass-end me-2 text-primary"></i> Expiry Rules</a></li>' : ''}
                    ${user.role === 'admin' ? '<li><a class="dropdown-item rounded py-2" href="fraud-detection.html"><i class="fas fa-user-shield me-2 text-primary"></i> Fraud Detection</a></li>' : ''}
                    <li><a class="dropdown-item rounded py-2" href="sandbox.html"><i class="fas fa-vials me-2 text-primary"></i> Preview Sandbox</a></li>
                    <li><a class="dropdown-item rounded py-2" href="profile.html"><i class="fas fa-user-cog me-2 text-primary"></i> Profile Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item rounded py-2 text-danger" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i> Logout</a></li>
                </ul>
            </div>
        `;

        // 3. Optional: Update Hero section if present
        const heroTitle = document.querySelector('.hero-section h1');
        if (heroTitle && !heroTitle.dataset.updated) {
            heroTitle.innerHTML = `Welcome back, <br><span class="text-gradient">${userName}</span>`;
            heroTitle.dataset.updated = "true";

            const heroText = document.querySelector('.hero-section p');
            if (heroText) {
                heroText.innerText = `Manage your certificates, generate new ones, or view your issuance history below.`;
            }

            const heroButtons = document.querySelector('.hero-section .d-flex');
            if (heroButtons) {
                heroButtons.innerHTML = `
                    <a href="generator.html" class="btn btn-primary btn-lg rounded-pill px-5 shadow-lg">New Certificate</a>
                    <a href="history.html" class="btn btn-white btn-lg rounded-pill px-5 border shadow-sm">View History</a>
                `;
            }
        }
    }

    // Show admin-only elements if user is admin
    if (user.role === 'admin') {
        const adminLinks = document.querySelectorAll('.admin-only');
        adminLinks.forEach(link => link.style.display = 'block');
    }
}

/**
 * Record an action on a certificate
 * @param {String} certId - Database _id or Certificate ID string
 * @param {String} action - Action type (VIEWED, DOWNLOADED, etc)
 * @param {String} details - Optional details
 */
async function recordCertificateAction(certId, action, details = '') {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const headers = { 'Content-Type': 'application/json' };
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        await fetch(`http://localhost:5000/api/certificates/${certId}/log`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ action, details })
        });
    } catch (err) {
        console.error('Failed to log action:', err);
    }
}
