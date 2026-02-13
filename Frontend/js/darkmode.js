// Dark Mode Logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    // 1. Initial Theme Set
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        // Only try to set checkbox if it exists on this page
        if (toggleSwitch && currentTheme === 'dark-mode') {
            toggleSwitch.checked = true;
        }
    }

    // 2. Theme Switch Function
    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    // 3. Listener (only if switch exists)
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme);
    }
});
