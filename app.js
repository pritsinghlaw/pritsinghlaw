// Law Offices of Pritpal Singh Knowledge Center JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSearch();
    initializeKnowledgeBase();
    initializeFAQ();
    initializeContactForm();
    initializeMobileMenu();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                nav.classList.remove('nav--open');
                
                // Smooth scroll to target
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('nav__link--active');
    });
    activeLink.classList.add('nav__link--active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('.section[id]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            updateActiveNavLink(correspondingLink);
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('nav--open');
            this.classList.toggle('mobile-menu-toggle--open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('nav--open');
                mobileMenuToggle.classList.remove('mobile-menu-toggle--open');
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('knowledge-search');
    const searchBtn = document.querySelector('.search-btn');
    const articles = document.querySelectorAll('.knowledge-article');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search as user types (debounced)
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const articles = document.querySelectorAll('.knowledge-article');
        const categories = document.querySelectorAll('.knowledge-category');
        let hasResults = false;
        
        // Show loading state
        searchBtn.innerHTML = 'Searching... <span class="search-loading"></span>';
        searchBtn.disabled = true;
        
        // Simulate search delay for better UX
        setTimeout(() => {
            if (query === '') {
                // Show all articles if search is empty
                articles.forEach(article => {
                    article.style.display = 'block';
                });
                categories.forEach(category => {
                    category.style.display = 'block';
                });
                hasResults = true;
            } else {
                // Hide all categories first
                categories.forEach(category => {
                    category.style.display = 'none';
                });
                
                articles.forEach(article => {
                    const title = article.querySelector('.article__title').textContent.toLowerCase();
                    const summary = article.querySelector('.article__summary').textContent.toLowerCase();
                    const content = article.querySelector('.article__content') ? 
                        article.querySelector('.article__content').textContent.toLowerCase() : '';
                    const keyPoints = Array.from(article.querySelectorAll('.article__key-points li'))
                        .map(li => li.textContent.toLowerCase()).join(' ');
                    
                    const searchText = `${title} ${summary} ${content} ${keyPoints}`;
                    
                    if (searchText.includes(query)) {
                        article.style.display = 'block';
                        article.closest('.knowledge-category').style.display = 'block';
                        hasResults = true;
                        
                        // Highlight search terms
                        highlightSearchTerms(article, query);
                    } else {
                        article.style.display = 'none';
                    }
                });
            }
            
            // Show no results message
            showSearchResults(hasResults, query);
            
            // Reset search button
            searchBtn.innerHTML = 'Search';
            searchBtn.disabled = false;
        }, 300);
    }
    
    function highlightSearchTerms(article, query) {
        // Remove previous highlights
        const highlighted = article.querySelectorAll('.search-highlight');
        highlighted.forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        if (query.length > 2) {
            const walker = document.createTreeWalker(
                article,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            textNodes.forEach(textNode => {
                const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
                const text = textNode.textContent;
                if (regex.test(text)) {
                    const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = highlightedText;
                    
                    while (tempDiv.firstChild) {
                        textNode.parentNode.insertBefore(tempDiv.firstChild, textNode);
                    }
                    textNode.remove();
                }
            });
        }
    }
    
    function showSearchResults(hasResults, query) {
        let resultsContainer = document.querySelector('.search-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            document.querySelector('.knowledge-categories').insertBefore(
                resultsContainer, 
                document.querySelector('.knowledge-categories').firstChild
            );
        }
        
        if (query && !hasResults) {
            resultsContainer.innerHTML = `
                <div class="no-results card">
                    <div class="card__body">
                        <h3>No results found for "${query}"</h3>
                        <p>Try searching with different keywords or browse our categories below.</p>
                    </div>
                </div>
            `;
        } else if (query && hasResults) {
            resultsContainer.innerHTML = `
                <div class="search-results-info">
                    <p>Search results for: <strong>"${query}"</strong></p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = '';
        }
    }
}

// Knowledge base article expansion
function initializeKnowledgeBase() {
    const expandButtons = document.querySelectorAll('.expand-article');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const article = this.closest('.knowledge-article');
            const content = article.querySelector('.article__content');
            
            if (content.style.display === 'none' || content.style.display === '') {
                // Expand content
                content.style.display = 'block';
                this.textContent = 'Show Less';
                this.classList.add('expanded');
                
                // Smooth scroll to content
                setTimeout(() => {
                    content.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
                
            } else {
                // Collapse content
                content.style.display = 'none';
                this.textContent = 'Learn More';
                this.classList.remove('expanded');
            }
        });
    });
}

// FAQ accordion functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items in the same category
            const category = this.closest('.faq-category');
            const categoryQuestions = category.querySelectorAll('.faq-question');
            const categoryAnswers = category.querySelectorAll('.faq-answer');
            
            categoryQuestions.forEach(q => q.classList.remove('active'));
            categoryAnswers.forEach(a => a.classList.remove('active'));
            
            // Toggle current FAQ item
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
                
                // Smooth scroll to question
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
            }
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('consultation-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitForm(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate phone format
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        if (!isValidPhone(phoneField.value)) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('form-control--error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('form-control--error');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        console.log('Form submitted:', data);
        
        // Show success message
        showFormMessage(form, 'success', 'Thank you for your consultation request. We will contact you within 24 hours.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // In a real application, you would send this data to your server
        // fetch('/api/consultation-request', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
    }, 2000);
}

function showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.parentNode.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.innerHTML = `
        <div class="status status--${type === 'success' ? 'success' : 'error'}">
            ${message}
        </div>
    `;
    
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add CSS for search highlighting and form states
const additionalStyles = `
    .search-highlight {
        background-color: rgba(var(--color-warning-rgb), 0.3);
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: var(--font-weight-medium);
    }
    
    .form-control--error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
    
    .form-error {
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
        font-weight: var(--font-weight-medium);
    }
    
    .form-message {
        margin-bottom: var(--space-16);
        padding: var(--space-12);
        border-radius: var(--radius-base);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
    }
    
    .no-results {
        text-align: center;
        margin-bottom: var(--space-24);
    }
    
    .search-results-info {
        margin-bottom: var(--space-20);
        padding: var(--space-12) var(--space-16);
        background: var(--color-bg-3);
        border-radius: var(--radius-base);
        border-left: 4px solid var(--color-success);
    }
    
    .search-results-info p {
        margin: 0;
        color: var(--color-text-secondary);
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-slate-900);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: var(--shadow-lg);
        }
        
        .nav--open {
            display: block;
        }
        
        .nav__list {
            flex-direction: column;
            padding: var(--space-16);
        }
        
        .mobile-menu-toggle--open span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle--open span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle--open span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);