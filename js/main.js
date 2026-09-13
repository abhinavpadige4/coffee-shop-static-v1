/* Coffee Shop Website - Main JavaScript File */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Update screen reader text
            const srText = navToggle.querySelector('.sr-only');
            if (srText) {
                srText.textContent = isExpanded ? 'Open menu' : 'Close menu';
            }
        });
    }
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navToggle.click();
                    }
                    
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form Validation and Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            const formErrors = contactForm.querySelectorAll('.form-error');
            formErrors.forEach(error => error.textContent = '');
            
            // Get form values
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();
            
            // Validation flags
            let isValid = true;
            
            // Name validation
            if (name === '') {
                document.getElementById('name-error').textContent = 'Please enter your name';
                isValid = false;
            } else if (name.length < 2) {
                document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
                isValid = false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                document.getElementById('email-error').textContent = 'Please enter your email';
                isValid = false;
            } else if (!emailRegex.test(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Message validation
            if (message === '') {
                document.getElementById('message-error').textContent = 'Please enter a message';
                isValid = false;
            } else if (message.length < 10) {
                document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
                isValid = false;
            }
            
            // If valid, submit form
            if (isValid) {
                // Show success message
                const formSuccess = document.getElementById('form-success');
                formSuccess.textContent = 'Thank you for your message! We\'ll get back to you soon.';
                formSuccess.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
                
                // In a real application, you would send this data to a backend service
                // For now, we'll just log it to console
                console.log('Form submitted:', { name, email, message });
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const errorId = this.id + '-error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }
    
    // Active Navigation Link Based on Scroll Position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    function updateActiveNavLink() {
        let scrollPosition = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link on page load
    updateActiveNavLink();
    
    // Lazy Loading for Images (if supported)
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading]');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for older browsers - could implement Intersection Observer
        // For simplicity, we'll rely on native support in modern browsers
    }
    
    // Add focus outline only for keyboard users
    let hadKeyboardEvent = false;
    
    const handleFirstTab = (e) => {
        if (e.key === 'Tab') {
            hadKeyboardEvent = true;
            document.body.classList.add('user-is-tabbing');
            
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDown);
        }
    };
    
    const handleMouseDown = () => {
        if (hadKeyboardEvent) {
            document.body.classList.remove('user-is-tabbing');
            hadKeyboardEvent = false;
            
            window.removeEventListener('mousedown', handleMouseDown);
            window.addEventListener('keydown', handleFirstTab);
        }
    };
    
    window.addEventListener('keydown', handleFirstTab);
    
    // Animation on Scroll (simple fade-in)
    const fadeElements = document.querySelectorAll('.menu-column, .hours-day, .location-info, .location-map, .contact-form, .footer-info, .footer-social');
    
    function checkFadeIn() {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for fade-in animation
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', checkFadeIn);
    // Check on initial load
    checkFadeIn();
});

// Utility function for debouncing (used for resize/scroll events)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}