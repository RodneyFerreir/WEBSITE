// Smooth scrolling and interactive functionality for Porlah website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            body.classList.toggle('nav-open');
        });

        // Close mobile nav when clicking on a link
        const navLinksItems = document.querySelectorAll('.nav-link');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                body.classList.remove('nav-open');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.post-card, .category-card, .trust-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');

    if (newsletterForm && newsletterInput && newsletterBtn) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate form submission
                newsletterBtn.textContent = 'Subscribing...';
                newsletterBtn.disabled = true;
                
                setTimeout(() => {
                    newsletterBtn.textContent = 'Subscribed!';
                    newsletterInput.value = '';
                    
                    setTimeout(() => {
                        newsletterBtn.textContent = 'Subscribe';
                        newsletterBtn.disabled = false;
                    }, 2000);
                }, 1000);
            } else {
                showEmailError();
            }
        });
    }

    // Post card interactions
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('click', function() {
            // Simulate navigation to blog post
            const title = this.querySelector('.post-title').textContent;
            console.log(`Navigating to post: ${title}`);
            // In a real implementation, this would navigate to the actual post
        });

        // Add subtle hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Category card interactions
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Cosmic orb and floating elements animation control
    const cosmicOrb = document.querySelector('.cosmic-orb');
    const floatingElements = document.querySelectorAll('.element');

    // Pause animations when not in view to improve performance
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cosmicOrb?.style.setProperty('animation-play-state', 'running');
                floatingElements.forEach(el => {
                    el.style.setProperty('animation-play-state', 'running');
                });
            } else {
                cosmicOrb?.style.setProperty('animation-play-state', 'paused');
                floatingElements.forEach(el => {
                    el.style.setProperty('animation-play-state', 'paused');
                });
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Theme detection and preference (for future dark mode implementation)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile nav
        if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.modal'); // For future modal implementation

    // Performance optimization: Debounce scroll events
    let ticking = false;
    function updateScrollEffects() {
        // All scroll-related updates go here
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    // Replace direct scroll event listener with debounced version for better performance
    window.addEventListener('scroll', requestScrollUpdate);
});

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showEmailError() {
    const input = document.querySelector('.newsletter-input');
    if (input) {
        input.style.borderColor = '#ef4444';
        input.placeholder = 'Please enter a valid email';
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'Your email address';
        }, 3000);
    }
}

// Add CSS for additional animations and mobile nav
const additionalStyles = `
    .nav-links.active {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        z-index: 999;
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }

    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .post-card, .category-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.3s ease;
    }

    .post-card.animate-in, .category-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .category-icon {
        transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);