/**
 * Sidebar Navigation Component
 * Replaces static sidebar with dynamic, user-role aware navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Select the sidebar element - adjust selector as needed if multiple sidebars exist
    const sidebar = document.querySelector('aside');
    if (!sidebar) return; // Exit if no sidebar (e.g., login page)

    // Clear existing content except the logo/header if possible, or rebuild entirely
    // We'll rebuild the nav section
    const navContainer = sidebar.querySelector('nav');
    if (navContainer) {
        navContainer.innerHTML = ''; // Clear current links
    } else {
        // Create nav if missing
        const newNav = document.createElement('nav');
        newNav.className = 'space-y-1 px-2';
        sidebar.querySelector('.flex-1').appendChild(newNav);
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Navigation Structure
    const menuItems = [
        { header: 'Main' },
        {
            label: 'Dashboard',
            icon: 'fas fa-home',
            href: 'dashboard.html',
            active: ['dashboard.html']
        },

        { header: 'Create & Manage' },
        {
            label: 'Generate New',
            icon: 'fas fa-plus-circle',
            href: 'generator.html',
            active: ['generator.html']
        },
        {
            label: 'Bulk Generation',
            icon: 'fas fa-layer-group',
            href: 'bulk-generation.html',
            active: ['bulk-generation.html']
        },
        {
            label: 'History & Logs',
            icon: 'fas fa-history',
            href: 'history.html',
            active: ['history.html', 'timeline.html']
        },

        { header: 'Intelligence' },
        {
            label: 'Usage Analytics',
            icon: 'fas fa-chart-pie',
            href: 'analytics.html',
            active: ['analytics.html']
        },
        {
            label: 'Fraud Detection',
            icon: 'fas fa-user-shield',
            href: 'fraud-detection.html',
            active: ['fraud-detection.html']
        },
        {
            label: 'Naming Engine',
            icon: 'fas fa-tags',
            href: 'naming-engine.html',
            active: ['naming-engine.html']
        },

        { header: 'System & Tools' },
        {
            label: 'Verify Portal',
            icon: 'fas fa-shield-alt',
            href: 'verify-portal.html',
            active: ['verify-portal.html', 'verify.html'] // Keep verify.html active just in case
        },
        {
            label: 'Blockchain Verify',
            icon: 'fas fa-link',
            href: 'blockchain.html',
            active: ['blockchain.html']
        },
        {
            label: 'Watermark Ctrl',
            icon: 'fas fa-stamp',
            href: 'watermark.html',
            active: ['watermark.html']
        },
        {
            label: 'Expiry Rules',
            icon: 'fas fa-hourglass-half',
            href: 'expiry-rules.html',
            active: ['expiry-rules.html']
        },
        {
            label: 'Notifications',
            icon: 'fas fa-bell',
            href: 'notifications.html',
            active: ['notifications.html']
        },
        {
            label: 'Sharing Hub',
            icon: 'fas fa-share-alt',
            href: 'sharing.html',
            active: ['sharing.html']
        },
        {
            label: 'Preview Sandbox',
            icon: 'fas fa-flask',
            href: 'sandbox.html',
            active: ['sandbox.html']
        },

        // Restricted
        {
            label: 'Audit Logs',
            icon: 'fas fa-clipboard-list',
            href: 'audit-logs.html',
            active: ['audit-logs.html'],
            restrictedTo: 'odhumkekar@gmail.com'
        },

        { header: 'Account' },
        {
            label: 'Settings',
            icon: 'fas fa-cog',
            href: 'profile.html',
            active: ['profile.html']
        },
        {
            label: 'Watch Demo',
            icon: 'fas fa-play-circle',
            href: 'demo.html',
            active: ['demo.html'],
            highlight: true
        },
    ];

    const nav = sidebar.querySelector('nav');

    menuItems.forEach(item => {
        // Restriction Check
        if (item.restrictedTo) {
            if (!user || user.email !== item.restrictedTo) return;
        }

        if (item.header) {
            const header = document.createElement('div');
            header.className = 'pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-300';
            header.innerText = item.header;
            nav.appendChild(header);
            return;
        }

        const isActive = item.active && item.active.some(path => currentPath.includes(path));
        if (item.header) { // handled above
            return;
        }
        const link = document.createElement('a');
        link.href = item.href;

        let baseClass = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-all duration-200 ease-in-out relative overflow-hidden ";

        if (isActive) {
            baseClass += "bg-blue-600 text-white shadow-md shadow-blue-500/20";
        } else if (item.highlight) {
            baseClass += "text-blue-400 hover:bg-blue-900/30 hover:text-white border border-blue-900/50";
        } else {
            baseClass += "text-slate-400 hover:bg-slate-800 hover:text-white";
        }

        link.className = baseClass;
        link.innerHTML = `
            <i class="${item.icon} w-6 text-center mr-3 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400 group-hover:text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors"></i>
            <span>${item.label}</span>
            ${item.highlight ? '<span class="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>' : ''}
        `;

        nav.appendChild(link);
    });
});
