/* Universal Dropdown Fix - Ensures no hidden links are clickable when closed */
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.navbar-menu-dropdown');
    const dropdownToggles = document.querySelectorAll('.navbar-dropdwn-toggle');
    
    // Function to close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.navbar-dropdown-list-container, .w-dropdown-list').forEach(list => {
            list.style.display = 'none';
            list.style.pointerEvents = 'none'; // Disable clicks on hidden dropdowns
            list.setAttribute('aria-hidden', 'true');
        });
        document.querySelectorAll('.navbar-menu-dropdown').forEach(d => {
            d.classList.remove('w--open');
        });
    }
    
    // Function to open a specific dropdown
    function openDropdown(dropdown) {
        const dropdownList = dropdown.querySelector('.navbar-dropdown-list-container, .w-dropdown-list');
        if (dropdownList) {
            dropdownList.style.display = 'block';
            dropdownList.style.pointerEvents = 'auto'; // Enable clicks when visible
            dropdownList.setAttribute('aria-hidden', 'false');
            dropdown.classList.add('w--open');
        }
    }
    
    // Initially close all dropdowns to prevent hidden clickable links
    closeAllDropdowns();
    
    // Desktop behavior (hover and click)
    if (window.matchMedia("(min-width: 992px)").matches) {
        dropdowns.forEach(dropdown => {
            let hoverTimeout;
            
            // Hover to open
            dropdown.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                closeAllDropdowns();
                openDropdown(this);
            });
            
            // Hover to close with delay
            dropdown.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    closeAllDropdowns();
                }, 200);
            });
        });
    }
    
    // Click functionality for all devices
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.navbar-menu-dropdown');
            const dropdownList = dropdown.querySelector('.navbar-dropdown-list-container, .w-dropdown-list');
            
            if (dropdownList && dropdownList.style.display === 'block') {
                closeAllDropdowns();
            } else {
                closeAllDropdowns();
                openDropdown(dropdown);
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar-menu-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Ensure dropdown links work properly
    document.querySelectorAll('.navbar-dropdown-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Prevent any interaction with hidden dropdown elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const element = mutation.target;
                if (element.classList.contains('navbar-dropdown-list-container') || 
                    element.classList.contains('w-dropdown-list')) {
                    if (element.style.display === 'none' || !element.style.display) {
                        element.style.pointerEvents = 'none';
                    }
                }
            }
        });
    });
    
    // Observe all dropdown lists for changes
    document.querySelectorAll('.navbar-dropdown-list-container, .w-dropdown-list').forEach(list => {
        observer.observe(list, { attributes: true });
    });
});
