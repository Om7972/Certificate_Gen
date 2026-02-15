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
                <button class="btn btn-outline-primary rounded-pill px-4 fw-semibold dropdown-toggle d-flex align-items-center gap-2 shadow-sm" type="button" data-bs-toggle="dropdown" style="transition: all 0.2s;">
                    <i class="fas fa-user-circle fs-5"></i>
                    <span>${userName}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2 rounded-4" style="animation: dropIn 0.2s ease-out forwards; transform-origin: top right;">
                    <li>
                        <a class="dropdown-item rounded-3 py-2 px-3 mb-1 d-flex align-items-center" href="dashboard.html">
                            <div class="bg-blue-50 text-primary rounded-circle p-1 me-2 d-flex align-items-center justify-center" style="width: 24px; height: 24px; background: #eff6ff;">
                                <i class="fas fa-th-large" style="font-size: 0.8rem;"></i>
                            </div>
                            <span class="fw-medium">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item rounded-3 py-2 px-3 mb-1 d-flex align-items-center" href="profile.html">
                            <div class="bg-blue-50 text-primary rounded-circle p-1 me-2 d-flex align-items-center justify-center" style="width: 24px; height: 24px; background: #eff6ff;">
                                <i class="fas fa-user-cog" style="font-size: 0.8rem;"></i>
                            </div>
                            <span class="fw-medium">Profile Settings</span>
                        </a>
                    </li>
                    <li><hr class="dropdown-divider my-1"></li>
                    <li>
                        <a class="dropdown-item rounded-3 py-2 px-3 d-flex align-items-center text-danger" href="#" onclick="logout()">
                            <div class="bg-red-50 text-danger rounded-circle p-1 me-2 d-flex align-items-center justify-center" style="width: 24px; height: 24px; background: #fef2f2;">
                                <i class="fas fa-sign-out-alt" style="font-size: 0.8rem;"></i>
                            </div>
                            <span class="fw-medium">Logout</span>
                        </a>
                    </li>
                </ul>
                <style>
                    @keyframes dropIn {
                        from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .dropdown-item:hover {
                        background-color: #f8fafc;
                        transform: translateX(4px);
                        transition: all 0.2s ease;
                    }
                    .dropdown-item {
                        transition: all 0.2s ease;
                    }
                </style>
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
                    <a href="demo.html" class="btn btn-white btn-lg rounded-pill px-5 border shadow-sm"><i class="fas fa-play me-2 text-primary"></i> Watch Demo</a>
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
