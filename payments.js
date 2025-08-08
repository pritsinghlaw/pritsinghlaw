// JavaScript for Law Offices of Pritpal Singh Payment Portal

document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const payNowBtn = document.getElementById('payNowBtn');
    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Mobile navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Pay Now button click handler
    if (payNowBtn) {
        payNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Pay Now button clicked');
            openModal();
        });
    }
    
    // Modal close button handler
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal close button clicked');
            closeModal();
        });
    }
    
    // Modal overlay click handler (close when clicking outside)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal overlay clicked');
            closeModal();
        });
    }
    
    // Escape key handler for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && paymentModal && !paymentModal.classList.contains('hidden')) {
            console.log('Escape key pressed, closing modal');
            closeModal();
        }
    });
    
    // Mobile hamburger menu handler
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hamburger menu clicked');
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navMenu.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('mobile-open')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle window resize for mobile menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
        
        // Show/hide hamburger menu based on screen size
        updateMenuVisibility();
    });
    
    // Initial menu visibility setup
    updateMenuVisibility();
    
    // Functions
    function openModal() {
        console.log('Opening modal...');
        if (paymentModal) {
            // Remove hidden class first
            paymentModal.classList.remove('hidden');
            
            // Force a repaint, then add show class
            paymentModal.offsetHeight;
            
            // Add show class for animation
            setTimeout(() => {
                paymentModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                console.log('Modal opened successfully');
            }, 10);
        } else {
            console.error('Payment modal not found');
        }
    }
    
    function closeModal() {
        console.log('Closing modal...');
        if (paymentModal) {
            // Remove show class for animation
            paymentModal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                paymentModal.classList.add('hidden');
                console.log('Modal closed successfully');
            }, 300);
        } else {
            console.error('Payment modal not found');
        }
    }
    
    function toggleMobileMenu() {
        console.log('Toggling mobile menu...');
        if (navMenu) {
            const isOpen = navMenu.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    }
    
    function openMobileMenu() {
        console.log('Opening mobile menu...');
        navMenu.classList.add('mobile-open');
        hamburger.classList.add('active');
        
        // Animate hamburger lines
        animateHamburger(true);
    }
    
    function closeMobileMenu() {
        console.log('Closing mobile menu...');
        if (navMenu && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            hamburger.classList.remove('active');
            
            // Reset hamburger lines
            animateHamburger(false);
        }
    }
    
    function animateHamburger(isActive) {
        const lines = hamburger.querySelectorAll('.hamburger-line');
        if (isActive) {
            lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        }
    }
    
    function updateMenuVisibility() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Show hamburger, hide desktop menu unless mobile-open
            hamburger.style.display = 'flex';
            if (!navMenu.classList.contains('mobile-open')) {
                navMenu.style.display = 'none';
            }
        } else {
            // Show desktop menu, hide hamburger
            hamburger.style.display = 'none';
            navMenu.style.display = 'flex';
            // Close mobile menu if it was open
            closeMobileMenu();
        }
    }
    
    // Animation for payment method cards on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe payment method cards for animation
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Skip the contact support button since it's a link
        if (button.tagName.toLowerCase() !== 'a') {
            button.addEventListener('mouseenter', function() {
                if (this.classList.contains('btn-pay-now')) {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
    
    // Iframe load handler for better user experience
    const paymentIframe = document.querySelector('#paymentModal iframe');
    if (paymentIframe) {
        paymentIframe.addEventListener('load', function() {
            console.log('Payment form loaded successfully');
        });
        
        paymentIframe.addEventListener('error', function() {
            console.error('Failed to load payment form');
            showNotification('Failed to load payment form. Please try again or contact support.', 'error');
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--law-primary);
            color: white;
            border-radius: 8px;
            z-index: 3000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        if (type === 'error') {
            notification.style.background = '#dc3545';
        } else if (type === 'success') {
            notification.style.background = '#28a745';
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // External link tracking
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('External link clicked:', this.href);
        });
    });
    
    // Phone link tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone link clicked:', this.href);
        });
    });
    
    // Page load performance tracking
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Payment portal page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Debug information
    console.log('Payment portal JavaScript initialized successfully');
    console.log('Elements found:', {
        payNowBtn: !!payNowBtn,
        paymentModal: !!paymentModal,
        modalClose: !!modalClose,
        modalOverlay: !!modalOverlay,
        hamburger: !!hamburger,
        navMenu: !!navMenu
    });
});
