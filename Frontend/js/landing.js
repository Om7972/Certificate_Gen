document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled', 'navbar-light', 'bg-white', 'shadow-sm');
            navbar.classList.remove('navbar-dark', 'bg-transparent');
        } else {
            navbar.classList.remove('scrolled', 'navbar-light', 'bg-white', 'shadow-sm');
            // If hero is dark, use navbar-dark
            // But we use glass effect in CSS, so maybe just toggle scrolled
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's a stats section, trigger counter animation
                if (entry.target.classList.contains('count-up')) {
                    animateCounter(entry.target);
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .count-up').forEach(el => {
        observer.observe(el);
    });

    // 3. Counter Animation
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = Math.ceil(target / (duration / 16)); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target.toLocaleString() + '+'; // Add + suffix
                clearInterval(timer);
            } else {
                el.innerText = current.toLocaleString();
            }
        }, 16);
    }

    // 4. Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Do nothing for empty anchors

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 5. Theme Toggle Logic (Optional foundation)
    // const themeToggle = document.getElementById('theme-toggle');
    // ... logic ...
});
