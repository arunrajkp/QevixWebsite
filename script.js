// Initialize Vanilla Tilt
function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            VanillaTilt.init(document.querySelectorAll(".card, [data-tilt]"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
            });
        }
    }
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 1px 2px rgba(33, 34, 38, 0.05)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Reveal Animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// NEW: Particle Wave / Starfield Background Style
function initRadialBurst() {
    const container = document.getElementById('radial-burst');
    if (!container) return;

    const colors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#A142F4', '#24C1E0'];
    const markCount = 250;

    for (let i = 0; i < markCount; i++) {
        const mark = document.createElement('div');
        mark.className = 'color-mark';

        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 500;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Randomize size slightly for a "starry" feel
        const size = 1 + Math.random() * 3;
        mark.style.width = `${size}px`;
        mark.style.height = `${size}px`;

        // Wavy Particle Animation
        const duration = 5 + Math.random() * 8;
        const delay = Math.random() * -10;
        mark.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.4 },
            { transform: `translate(${Math.sin(i) * 30}px, ${Math.cos(i) * 30}px) scale(1.5)`, opacity: 0.8 },
            { transform: 'translate(0, 0) scale(1)', opacity: 0.4 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            delay: delay * 1000,
            easing: 'ease-in-out'
        });

        container.appendChild(mark);
    }
}

// NEW: Split text into letters for animation
function initTitleAnimation() {
    const title = document.getElementById('hero-title');
    if (!title) return;

    const text = title.innerHTML;
    title.innerHTML = '';

    // Split into characters but preserve <br> tags
    const parts = text.split(/(<br>)/);

    parts.forEach(part => {
        if (part === '<br>') {
            title.appendChild(document.createElement('br'));
        } else {
            [...part].forEach((char, i) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                span.style.animationDelay = `${0.2 + (i * 0.04)}s`;
                title.appendChild(span);
            });
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initTitleAnimation();
    initRadialBurst();
    initTilt();

    const dashboardStack = document.querySelector('.dashboard-stack');
    if (dashboardStack) {
        dashboardStack.addEventListener('click', () => {
            dashboardStack.classList.toggle('swapped');
        });
    }

    document.querySelectorAll('.card, .section-header, .split-content, .split-image').forEach(el => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });
});
