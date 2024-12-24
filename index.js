// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop = 0;
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize EmailJS
(function() {
    // Replace with your actual public key from EmailJS dashboard
    emailjs.init("qI9f3YWw6FOBAjxtg"); // You'll get this from EmailJS
})();

// Enhanced form submission handling with email functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    const submitText = button.querySelector('.submit-text');
    const loadingIcon = button.querySelector('.loading');
    
    // Add sending class for animation
    button.classList.add('sending');
    
    // Prepare email parameters
    const templateParams = {
        from_name: this.querySelector('input[type="text"]').value,
        from_email: this.querySelector('input[type="email"]').value,
        message: this.querySelector('textarea').value,
        to_email: 'raqtencryptus@gmail.com'
    };

    // Send email using EmailJS
    emailjs.send(
        'service_id',  // You'll get this from EmailJS
        'template_id', // You'll get this from EmailJS
        templateParams
    )
    .then(() => {
        // Success state
        button.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
        loadingIcon.classList.remove('fa-spinner');
        loadingIcon.classList.add('fa-check');
        loadingIcon.style.animation = 'success 0.5s ease forwards';
        
        // Reset form after delay
        setTimeout(() => {
            button.classList.remove('sending');
            button.style.background = '';
            loadingIcon.classList.remove('fa-check');
            loadingIcon.classList.add('fa-spinner');
            loadingIcon.style.animation = '';
            this.reset();
        }, 2000);
    })
    .catch((error) => {
        // Error state
        console.error('Failed to send email:', error);
        button.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
        loadingIcon.classList.remove('fa-spinner');
        loadingIcon.classList.add('fa-times');
        
        // Reset button after delay
        setTimeout(() => {
            button.classList.remove('sending');
            button.style.background = '';
            loadingIcon.classList.remove('fa-times');
            loadingIcon.classList.add('fa-spinner');
            loadingIcon.style.animation = '';
        }, 2000);
    });
});

// Optimize scroll and mousemove event handlers with throttling
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimized scroll handler
window.addEventListener('scroll', throttle(() => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(26, 26, 26, 0.98)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(26, 26, 26, 0.95)';
        nav.style.boxShadow = 'none';
    }

    // Optimize parallax
    const parallax = document.querySelector('.parallax');
    if (parallax && isElementInViewport(parallax)) {
        const scrolled = window.pageYOffset;
        parallax.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
}, 50));

// Optimize mousemove handlers
document.addEventListener('mousemove', throttle(e => {
    // Update cursor position
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    // Optimize hero parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && isElementInViewport(heroContent)) {
        const moveX = (e.clientX - window.innerWidth/2) * 0.01;
        const moveY = (e.clientY - window.innerHeight/2) * 0.01;
        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}, 16)); // ~60fps

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Animation for service cards
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { threshold: 0.1 }); // Reduced threshold for earlier triggering

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

// Add counter animation for stats
function animateValue(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-item h3');
            statValues.forEach(stat => {
                const finalValue = parseInt(stat.textContent);
                stat.textContent = '0';
                animateValue(stat, 0, finalValue, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('#stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add scroll reveal animations
const revealElements = document.querySelectorAll('.service-card, .stat-item, .about-content, .contact-form');

const scrollReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollReveal.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-50px'
});

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    scrollReveal.observe(element);
});

// Parallax effect for stats section
window.addEventListener('scroll', () => {
    const parallax = document.querySelector('.parallax');
    if (parallax) {
        const scrolled = window.pageYOffset;
        parallax.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Add hover effect for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${angleX}deg)
            rotateY(${angleY}deg)
            scale(1.05)
        `;
        
        const glare = card.querySelector('.service-hover');
        if (glare) {
            glare.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(255,255,255,0.2) 0%,
                    rgba(255,255,255,0) 80%
                )
            `;
        }
    });
});

// Add cyber grid background animation
const createCyberGrid = () => {
    const grid = document.querySelector('.cyber-grid-bg');
    for (let i = 0; i < 50; i++) {
        const dot = document.createElement('div');
        dot.className = 'grid-dot';
        grid.appendChild(dot);
    }
};

// Add scroll indicator animation
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Add animation for about section elements
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const textElements = entry.target.querySelectorAll('.about-text p, .about-stat-item');
            textElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            });
            aboutObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    aboutObserver.observe(aboutContent);
}

// Add hover effect for about image
const aboutImage = document.querySelector('.about-image');
if (aboutImage) {
    aboutImage.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = aboutImage.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        aboutImage.style.transform = `
            perspective(1000px)
            rotateY(${x * 20}deg)
            rotateX(${-y * 20}deg)
            scale(1.05)
        `;
    });
    
    aboutImage.addEventListener('mouseleave', () => {
        aboutImage.style.transform = 'perspective(1000px) rotateY(-15deg)';
    });
}

// Animated text effect for hero section
const text = document.querySelector('.hero h1');
text.innerHTML = text.textContent.split('').map(
    char => `<span>${char}</span>`
).join('');

// Cursor effect
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Glitch effect on hover
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.classList.add('glitch');
        setTimeout(() => card.classList.remove('glitch'), 1000);
    });
});

// Parallax effect for hero section
document.addEventListener('mousemove', e => {
    const moveX = (e.clientX - window.innerWidth/2) * 0.01;
    const moveY = (e.clientY - window.innerHeight/2) * 0.01;
    
    document.querySelector('.hero-content').style.transform = 
        `translate(${moveX}px, ${moveY}px)`;
});

// Typing effect for section headers
function typeWriter(element) {
    const text = element.getAttribute('data-text');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    type();
}

// Add mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Add touch event handlers for better mobile interaction
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
    });
    
    card.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
    });
});

// Optimize performance for mobile
const optimizeForMobile = () => {
    if (window.innerWidth <= 768) {
        // Disable parallax effects on mobile
        document.removeEventListener('mousemove', parallaxEffect);
        
        // Reduce animation complexity
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.transition = 'transform 0.3s ease';
        });
    }
};

// Call on load and resize
window.addEventListener('load', optimizeForMobile);
window.addEventListener('resize', optimizeForMobile);
