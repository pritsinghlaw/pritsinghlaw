// JavaScript for Law Offices of Pritpal Singh Payment Portal

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing payment portal...');
    
    // Modal functionality elements
    const payNowBtn = document.getElementById('payNowBtn');
    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const proceedToPayment = document.getElementById('proceedToPayment');
    
    // Mobile navigation elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // LawPay URL
    const lawPayUrl = 'https://secure.lawpay.com/pages/lawofficesofpritpalsingh/operating';
    
    // Debug: Log element detection
    console.log('Element detection:', {
        payNowBtn: !!payNowBtn,
        paymentModal: !!paymentModal,
        modalClose: !!modalClose,
        modalOverlay: !!modalOverlay,
        proceedToPayment: !!proceedToPayment,
        hamburger: !!hamburger,
        navMenu: !!navMenu
    });
    
    // Pay Now button click handler - opens modal instead of direct navigation
    if (payNowBtn) {
        console.log('Setting up Pay Now button event listener');
        payNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Pay Now button clicked - opening modal');
            openModal();
        });
        
        // Also add keyboard support
        payNowBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Pay Now button activated via keyboard');
                openModal();
            }
        });
    } else {
        console.error('Pay Now button not found!');
    }
    
    // Proceed to Payment button - opens LawPay in new tab
    if (proceedToPayment) {
        console.log('Setting up Proceed to Payment button event listener');
        proceedToPayment.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Proceeding to LawPay payment...');
            
            try {
                // Open LawPay in new tab
                const lawPayWindow = window.open(lawPayUrl, '_blank', 'noopener,noreferrer');
                
                if (lawPayWindow) {
                    console.log('LawPay opened successfully in new tab');
                    showNotification('Redirecting to secure payment portal...', 'success');
                    
                    // Close modal after opening payment page
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                } else {
                    console.error('Failed to open LawPay - popup may be blocked');
                    showNotification('Please allow popups for this site to process payments securely.', 'error');
                }
            } catch (error) {
                console.error('Error opening LawPay:', error);
                showNotification('Error opening payment portal. Please try again.', 'error');
            }
        });
    } else {
        console.error('Proceed to Payment button not found!');
    }
    
    // Modal close button handler
    if (modalClose) {
        console.log('Setting up modal close button event listener');
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Modal close button clicked');
            closeModal();
        });
    } else {
        console.error('Modal close button not found!');
    }
    
    // Modal overlay click handler (close when clicking outside)
    if (modalOverlay) {
        console.log('Setting up modal overlay event listener');
        modalOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Modal overlay clicked - closing modal');
            closeModal();
        });
    } else {
        console.error('Modal overlay not found!');
    }
    
    // Escape key handler for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (paymentModal && paymentModal.classList.contains('show')) {
                console.log('Escape key pressed, closing modal');
                closeModal();
            }
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                console.log('Escape key pressed, closing mobile menu');
                closeMobileMenu();
            }
        }
        
        // Handle Enter and Space for hamburger menu
        if (e.target === hamburger && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Mobile hamburger menu handler with improved functionality
    if (hamburger && navMenu) {
        console.log('Setting up hamburger menu event listener');
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked');
            toggleMobileMenu();
        });
        
        // Add keyboard support for hamburger
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        // Ensure hamburger is focusable
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
    } else {
        console.error('Hamburger menu or nav menu not found!');
    }
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            console.log(`Navigation link ${index} clicked:`, this.href);
            
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('mobile-open')) {
                console.log('Closing mobile menu after nav link click');
                closeMobileMenu();
            }
            
            // For placeholder links, prevent default navigation
            const href = this.getAttribute('href');
            if (href && (href.startsWith('/') || href === '#')) {
                e.preventDefault();
                console.log('Navigation placeholder - showing notification');
                showNotification(`Navigation to ${this.textContent} - Coming Soon!`, 'info');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('mobile-open')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                console.log('Clicked outside mobile menu, closing');
                closeMobileMenu();
            }
        }
    });
    
    // Handle window resize for mobile menu
    window.addEventListener('resize', function() {
        console.log(`Window resized to: ${window.innerWidth}px`);
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Modal Functions
    function openModal() {
        console.log('Opening payment modal...');
        if (!paymentModal) {
            console.error('Cannot open modal - paymentModal element not found');
            return;
        }
        
        try {
            // Remove hidden class first
            paymentModal.classList.remove('hidden');
            console.log('Removed hidden class from modal');
            
            // Force a repaint
            paymentModal.offsetHeight;
            
            // Add show class for animation with slight delay
            requestAnimationFrame(() => {
                paymentModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Focus management - focus on the proceed button
                if (proceedToPayment) {
                    setTimeout(() => {
                        proceedToPayment.focus();
                    }, 100);
                }
                
                console.log('Payment modal opened successfully');
                showNotification('Payment information loaded', 'info');
            });
        } catch (error) {
            console.error('Error opening modal:', error);
            showNotification('Error opening payment information', 'error');
        }
    }
    
    function closeModal() {
        console.log('Closing payment modal...');
        if (!paymentModal) {
            console.error('Cannot close modal - paymentModal element not found');
            return;
        }
        
        try {
            // Remove show class for animation
            paymentModal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Return focus to pay now button
            if (payNowBtn) {
                payNowBtn.focus();
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                paymentModal.classList.add('hidden');
                console.log('Payment modal closed successfully');
            }, 300);
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }
    
    function toggleMobileMenu() {
        console.log('Toggling mobile menu...');
        if (!navMenu || !hamburger) {
            console.error('Cannot toggle menu - elements not found');
            return;
        }
        
        const isOpen = navMenu.classList.contains('mobile-open');
        console.log('Mobile menu currently open:', isOpen);
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        console.log('Opening mobile menu...');
        if (!navMenu || !hamburger) return;
        
        try {
            navMenu.classList.add('mobile-open');
            hamburger.classList.add('active');
            
            // Update ARIA attributes for accessibility
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close navigation menu');
            
            console.log('Mobile menu opened successfully');
        } catch (error) {
            console.error('Error opening mobile menu:', error);
        }
    }
    
    function closeMobileMenu() {
        console.log('Closing mobile menu...');
        if (!navMenu || !hamburger) return;
        
        if (navMenu.classList.contains('mobile-open')) {
            try {
                navMenu.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                
                // Update ARIA attributes for accessibility
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation menu');
                
                console.log('Mobile menu closed successfully');
            } catch (error) {
                console.error('Error closing mobile menu:', error);
            }
        }
    }
    
    // Notification system for user feedback
    function showNotification(message, type = 'info') {
        console.log(`Showing notification: ${message} (${type})`);
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Notification styles
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            zIndex: '3000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: '14px',
            lineHeight: '1.4',
            fontWeight: '500'
        };
        
        // Apply base styles
        Object.assign(notification.style, baseStyles);
        
        // Adjust colors based on type
        switch(type) {
            case 'error':
                notification.style.background = '#dc3545';
                notification.style.color = 'white';
                break;
            case 'success':
                notification.style.background = '#28a745';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#212529';
                break;
            default:
                notification.style.background = '#001f54';
                notification.style.color = 'white';
        }
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
        });
        
        // Auto-hide notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    console.log(`Found ${buttons.length} buttons for enhancement`);
    
    buttons.forEach((button, index) => {
        console.log(`Setting up button ${index}:`, button.className);
        
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (this.contains(ripple)) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .skip-link:focus {
            top: 6px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Track external link clicks
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    console.log(`Found ${externalLinks.length} external links`);
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('External link clicked:', this.href);
            
            // Show confirmation for support links
            if (this.href.includes('contact') || this.href.includes('support')) {
                showNotification('Opening support page...', 'info');
            }
        });
    });
    
    // Track phone link clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    console.log(`Found ${phoneLinks.length} phone links`);
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone link clicked:', this.href);
            showNotification('Initiating phone call...', 'success');
        });
    });
    
    // Accessibility enhancements
    function enhanceAccessibility() {
        console.log('Enhancing accessibility...');
        
        // Add skip link for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #001f54;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
            font-weight: bold;
        `;
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID for skip link
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }
        
        // Enhance modal accessibility
        if (paymentModal) {
            paymentModal.setAttribute('role', 'dialog');
            paymentModal.setAttribute('aria-modal', 'true');
            paymentModal.setAttribute('aria-labelledby', 'modal-title');
            
            const modalTitle = paymentModal.querySelector('.modal-header h3');
            if (modalTitle) {
                modalTitle.id = 'modal-title';
            }
        }
        
        console.log('Accessibility enhancements completed');
    }
    
    // Initialize accessibility enhancements
    enhanceAccessibility();
    
    // Page performance and error tracking
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Payment portal page loaded in ${loadTime.toFixed(2)}ms`);
        showNotification('Payment portal loaded successfully', 'success');
    });
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        showNotification('An error occurred. Please refresh if issues persist.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise rejection:', e.reason);
        showNotification('Network error. Please check connection.', 'warning');
    });
    
    // Final initialization log
    console.log('Payment portal JavaScript fully initialized');
    console.log('Ready for user interaction');
    
    // Test notification on load (remove in production)
    setTimeout(() => {
        console.log('Initialization complete - all systems ready');
    }, 1000);
});