// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    initTypingAnimation();
    initNavigation();
    initMobileMenu();
    initContactForm();
    initResumeDownload();
    initScrollAnimations();
    initNavbarScrollEffect();
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const typedTextElement = document.querySelector('.typed-text');
    const cursorElement = document.querySelector('.cursor');

    if (!typedTextElement) return;

    const roles = [
        'AI Engineer',
        'Data Scientist',
        'ML Engineer',
        'Generative AI Specialist',
        'Deep Learning Practitioner'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    const typeSpeed = 100; // Speed of typing
    const deleteSpeed = 50; // Speed of deleting
    const waitTime = 2000; // Wait time after completing a word

    function typeText() {
        const currentRole = roles[roleIndex];

        if (isWaiting) {
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                typeText();
            }, waitTime);
            return;
        }

        if (isDeleting) {
            // Deleting text
            typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            setTimeout(typeText, deleteSpeed);
        } else {
            // Typing text
            typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isWaiting = true;
            }

            setTimeout(typeText, typeSpeed);
        }
    }

    // Start the typing animation
    typeText();
}

// Navigation functionality
function initNavigation() {
    // Get all navigation links (including hero buttons)
    const allNavLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    console.log('Found navigation links:', allNavLinks.length);
    console.log('Found sections:', sections.length);

    // Add smooth scroll for all navigation links
    allNavLinks.forEach((link, index) => {
        console.log(`Setting up navigation for link ${index}:`, link.getAttribute('href'));

        link.addEventListener('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            console.log(`Attempting to scroll to: ${targetId}`, targetSection);

            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                console.log(`Scrolling to position: ${targetPosition}`);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();

                // Add active class to navigation
                updateActiveNavLink(targetId);
            } else {
                console.warn(`Target section not found: ${targetId}`);
            }
        });
    });

    // Highlight active navigation link based on scroll position
    function highlightActiveNavLink() {
        const scrollPos = window.scrollY + 150; // Offset for better detection
        let activeSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });

        updateActiveNavLink(activeSection);
    }

    function updateActiveNavLink(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Throttled scroll event for performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    // Initial call to highlight correct nav link
    setTimeout(highlightActiveNavLink, 100);
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!navToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    console.log('Initializing mobile menu');

    navToggle.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Mobile menu toggle clicked');

        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            console.log('Nav link clicked, closing mobile menu');
            setTimeout(closeMobileMenu, 100); // Small delay to allow navigation to happen first
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        console.log('Mobile menu closed');
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.form');

    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }

    console.log('Contact form initialized');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Contact form submitted');

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('entry.1584615677')?.trim();
        const email = formData.get('entry.1215701783')?.trim();
        const message = formData.get('entry.2002317261')?.trim();

        console.log('Form data:', { name, email, message: message?.substring(0, 50) + '...' });

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (since this is frontend only)
        const submitButton = this.querySelector('.btn--primary');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfsmlPrPomUSegwRGOSOD5lGkXKi-ASxT7dBvUiNUzretSAaA/formResponse', {
            method: 'POST',
            mode: 'no-cors', // Required to bypass CORS policy
            body: formData
        })
            .then(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                console.log('Contact form submission completed');
            })
            .catch(() => {
                showNotification('Error sending message. Please try again..', 'error');
            });



        // setTimeous
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    console.log(`Showing notification: ${message} (${type})`);

    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Add styles
    const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6B7280';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Resume download functionality
function initResumeDownload() {
    const resumeButton = document.querySelector('.resume-btn');

    if (!resumeButton) {
        console.warn('Resume button not found');
        return;
    }

    console.log('Resume download initialized');


    resumeButton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Resume download clicked');

        const fileUrl = 'asset/Kapish_Luhariwala_Resume.pdf';

        // Check if the file exists before downloading
        fetch(fileUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists, trigger download
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = 'Kapish_Luhariwala_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    // File does not exist, show notification
                    showNotification('Resume file not found. Please contact me at kapishluhariwala@outlook.com or via LinkedIn!', 'error');
                }
            })
            .catch(error => {
                // Network error or other issues
                console.error('Error checking resume file:', error);
                showNotification('Unable to download resume. Please contact me at kapishluhariwala@outlook.com or via LinkedIn!', 'error');
            });
    });

}

// Scroll-based animations
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported');
        return;
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Special animation for stat numbers
                if (entry.target.classList.contains('stat-item')) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        animateNumber(statNumber);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-tag, .cert-card, .achievement-card, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations
    if (!document.getElementById('scroll-animations-css')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-css';
        style.textContent = `
            .project-card, .skill-tag, .cert-card, .achievement-card, .stat-item {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }
            
            .project-card.animate-in, .skill-tag.animate-in, .cert-card.animate-in, .achievement-card.animate-in, .stat-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .skill-tag.animate-in {
                transition-delay: calc(var(--index, 0) * 0.05s);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    // Add index to skill tags for staggered animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.setProperty('--index', index);
    });

    console.log('Scroll animations initialized for', animateElements.length, 'elements');
}

// Animate numbers in stats
function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasDollar = text.includes('$');
    const hasM = text.includes('M');

    // Extract number
    let number = parseFloat(text.replace(/[^\d.]/g, ''));
    if (isNaN(number)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        current += increment;
        step++;

        let displayValue = Math.floor(current);
        let displayText = displayValue.toString();

        if (hasDollar) displayText = '$' + displayText;
        if (hasM) displayText += 'M';
        if (hasPlus) displayText += '+';

        element.textContent = displayText;

        if (step >= steps) {
            clearInterval(timer);
            element.textContent = text; // Restore original text
        }
    }, duration / steps);
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(23, 23, 23, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(23, 23, 23, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        lastScrollY = currentScrollY;
    });
}

// Handle keyboard navigation
document.addEventListener('keydown', function (e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();

        // Also close any notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => removeNotification(notification));
    }

    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Performance optimization: Lazy load animations
function initLazyAnimations() {
    const lazyElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window && lazyElements.length > 0) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add(element.dataset.animate);
                    lazyObserver.unobserve(element);
                }
            });
        });

        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// Error handling for missing elements
window.addEventListener('error', function (e) {
    console.warn('Application error:', e.message);
    // Don't show user-facing errors for missing elements in this context
});

// Accessibility enhancements
function initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }

    // Announce page changes for screen readers
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionName = entry.target.querySelector('h1, h2, h3')?.textContent;
                    if (sectionName) {
                        // Create a live region for screen reader announcements
                        let liveRegion = document.getElementById('live-region');
                        if (!liveRegion) {
                            liveRegion = document.createElement('div');
                            liveRegion.id = 'live-region';
                            liveRegion.setAttribute('aria-live', 'polite');
                            liveRegion.setAttribute('aria-atomic', 'true');
                            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
                            document.body.appendChild(liveRegion);
                        }

                        setTimeout(() => {
                            liveRegion.textContent = `Now viewing ${sectionName} section`;
                        }, 100);
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }
}

// Initialize on load
window.addEventListener('load', function () {
    initLazyAnimations();

    // Hide any loading indicators
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }

    console.log('Portfolio website fully loaded');
});

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function () {
    initAccessibility();
    console.log('Portfolio website initialized');
});