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

// Particle Wave / Starfield Background Style
function initRadialBurst() {
    const container = document.getElementById('radial-burst');
    if (!container) return;

    const colors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#A142F4', '#24C1E0'];
    const markCount = 300;

    for (let i = 0; i < markCount; i++) {
        const mark = document.createElement('div');
        const isLarge = Math.random() > 0.8;
        mark.className = isLarge ? 'color-mark large' : 'color-mark';

        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 600;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        mark.style.left = `calc(50% + ${x}px)`;
        mark.style.top = `calc(50% + ${y}px)`;
        mark.style.color = colors[Math.floor(Math.random() * colors.length)];
        mark.style.backgroundColor = 'currentColor';

        const speedFactor = isLarge ? 0.5 : 1.5;
        const duration = (8 + Math.random() * 12) / speedFactor;
        const delay = Math.random() * -20;

        mark.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0 },
            { transform: `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.5)`, opacity: isLarge ? 0.3 : 0.8, offset: 0.5 },
            { transform: `translate(${x * 0.15}px, ${y * 0.15}px) scale(1)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            delay: delay * 1000,
            easing: 'ease-in-out'
        });

        container.appendChild(mark);
    }
}

// SLOW Letter-by-letter animation with 1s initial delay
function initTitleAnimation() {
    const title = document.getElementById('hero-title');
    if (!title) return;

    const text = title.innerHTML;
    title.innerHTML = '';

    const parts = text.split(/(<br>)/);
    let letterIndex = 0;
    const baseDelay = 1.0; // 1 second hold before first letter
    const speed = 0.12;    // Slower reveal speed (time between letters)

    parts.forEach(part => {
        if (part === '<br>') {
            title.appendChild(document.createElement('br'));
        } else {
            [...part].forEach((char) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                // Calculate delay: 1s base + incremental delay for each character
                span.style.animationDelay = `${baseDelay + (letterIndex * speed)}s`;
                title.appendChild(span);
                letterIndex++;
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

    // ─── EmailJS Contact Form ────────────────────────────────────────────────
    // STEP 1: Go to https://www.emailjs.com/ → sign up (free) → 
    //         Dashboard → Email Services → Add Service (Gmail) → copy "Service ID"
    // STEP 2: Dashboard → Email Templates → Create Template, set:
    //         To Email = qevixinfosolutions@gmail.com
    //         Subject  = New Inquiry from {{from_name}}
    //         Body     = Name: {{from_name}} | Email: {{reply_to}} | Message: {{message}}
    //         → copy "Template ID"
    // STEP 3: Dashboard → Account → Public Key → copy it
    // Then replace the three placeholders below:

    const EMAILJS_PUBLIC_KEY = '_p7PmU6IQTLlat28V';
    const EMAILJS_SERVICE_ID = 'service_hcyan6u';
    const EMAILJS_TEMPLATE_ID = 'template_el7drz4';

    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // UI: loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            statusDiv.style.display = 'none';

            const templateParams = {
                from_name: document.getElementById('from_name').value,
                reply_to: document.getElementById('reply_to').value,
                message: document.getElementById('message').value,
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    statusDiv.style.display = 'block';
                    statusDiv.style.color = '#34A853';
                    statusDiv.textContent = "✅ Message sent! We'll get back to you shortly.";
                    contactForm.reset();
                })
                .catch((err) => {
                    console.error('EmailJS error:', err);
                    statusDiv.style.display = 'block';
                    statusDiv.style.color = '#EA4335';
                    statusDiv.textContent =
                        '❌ Oops! Something went wrong. Please email us directly at qevixinfosolutions@gmail.com';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
        });
    }
    // ─────────────────────────────────────────────────────────────────────────
});
