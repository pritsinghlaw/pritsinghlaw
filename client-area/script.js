// Step Management
let currentStep = 1;
const steps = document.querySelectorAll('.step');
const progress = document.querySelector('.progress');
const totalSteps = steps.length - 1; // Excluding success step

// Form Data Storage
let formData = {
    step: 1,
    contactInfo: {},
    referralSource: '',
    otherReferralDetails: '',
    serviceType: '',
    caseDetails: '',
    consultationType: '',
    consultationPrice: 0,
    addons: {
        documentReview: false,
        consultationTranscript: true
    },
    scheduling: {},
    disclaimerAccepted: false,
    totalAmount: 350
};

// Progress Update
function updateProgress() {
    const progressStep = Math.min(currentStep, totalSteps);
    const percentage = ((progressStep - 1) / (totalSteps - 1)) * 100;
    progress.style.width = percentage + '%';
}

// Step Navigation Functions
function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        steps[currentStep - 1].classList.remove('active');

        // Handle special navigation logic
        if (currentStep === 7 && formData.consultationType === 'free') {
            // If going back from scheduling and consultation is free, go to step 5
            currentStep = 5;
        } else if (currentStep === 6) {
            // If going back from add-ons, go to consultation type
            currentStep = 5;
        } else {
            currentStep--;
        }

        // Show new step
        steps[currentStep - 1].classList.add('active');
        updateProgress();
        autoSave();
    }
}

function nextStep() {
    if (currentStep < totalSteps + 1) {
        // Validate current step before proceeding
        if (!validateCurrentStep()) {
            return;
        }

        // Hide current step
        steps[currentStep - 1].classList.remove('active');

        // Handle conditional navigation logic
        if (currentStep === 5) {
            // From consultation type selection
            if (formData.consultationType === 'paid') {
                currentStep = 6; // Go to add-ons
            } else {
                currentStep = 7; // Skip add-ons, go to scheduling
            }
        } else {
            currentStep++;
        }

        // Show new step
        steps[currentStep - 1].classList.add('active');
        updateProgress();
        autoSave();

        // Special handling for different steps
        if (currentStep === 8) {
            populateConsultationSummary();
        }
    }
}

function goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= totalSteps + 1) {
        steps[currentStep - 1].classList.remove('active');
        currentStep = stepNumber;
        steps[currentStep - 1].classList.add('active');
        updateProgress();
        autoSave();
    }
}

// Validation function for current step
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateContactInfo();
        case 2:
            return validateReferralSource();
        case 3:
            return validateServiceSelection();
        case 4:
            return validateCaseDetails();
        case 5:
            return validateConsultationType();
        case 7:
            return validateScheduling();
        case 8:
            return formData.disclaimerAccepted;
        default:
            return true;
    }
}

function validateContactInfo() {
    const requiredFields = ['fullName', 'email', 'phone', 'location'];
    const form = document.getElementById('client-info-form');

    for (let field of requiredFields) {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input || !input.value.trim()) {
            showValidationError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
            input?.focus();
            return false;
        }
    }
    return true;
}

function validateReferralSource() {
    if (!formData.referralSource) {
        showValidationError('Please select how you were referred to us.');
        return false;
    }

    if (formData.referralSource === 'other' && !formData.otherReferralDetails.trim()) {
        showValidationError('Please specify how you found us.');
        document.querySelector('[name="otherReferral"]')?.focus();
        return false;
    }

    return true;
}

function validateServiceSelection() {
    if (!formData.serviceType) {
        showValidationError('Please select the service you need.');
        return false;
    }
    return true;
}

function validateCaseDetails() {
    if (!formData.caseDetails.trim()) {
        showValidationError('Please provide details about your case.');
        document.querySelector('[name="caseDetails"]')?.focus();
        return false;
    }
    return true;
}

function validateConsultationType() {
    if (!formData.consultationType) {
        showValidationError('Please select a consultation type.');
        return false;
    }
    return true;
}

function validateScheduling() {
    if (!formData.scheduling.preferredDateTime) {
        showValidationError('Please select your preferred date and time.');
        document.querySelector('[name="preferredDateTime"]')?.focus();
        return false;
    }
    return true;
}

function showValidationError(message) {
    // Create or update validation message
    let errorDiv = document.querySelector('.validation-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.style.cssText = `
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            animation: errorSlide 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.querySelector('#error-animations')) {
            const style = document.createElement('style');
            style.id = 'error-animations';
            style.textContent = `
                @keyframes errorSlide {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    errorDiv.textContent = message;

    // Insert at the top of current step
    const currentStepElement = steps[currentStep - 1];
    const stepHeader = currentStepElement.querySelector('.step-header');
    stepHeader.parentNode.insertBefore(errorDiv, stepHeader.nextSibling);

    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv?.remove();
    }, 5000);
}

// Auto-save Functionality
function autoSave() {
    formData.step = currentStep;
    localStorage.setItem('legalFormData', JSON.stringify(formData));
}

function restoreFormData() {
    const saved = localStorage.getItem('legalFormData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            formData = { ...formData, ...data };

            // Restore form fields
            restoreContactInfo();
            restoreSelections();

            // Restore step if not the first one
            if (data.step && data.step !== 1) {
                goToStep(data.step);
            }
        } catch (error) {
            console.error('Error restoring form data:', error);
        }
    }
}

function restoreContactInfo() {
    if (formData.contactInfo.fullName) {
        const input = document.querySelector('input[name="fullName"]');
        if (input) input.value = formData.contactInfo.fullName;
        updateNamePlaceholders(formData.contactInfo.fullName);
    }

    ['email', 'phone', 'location'].forEach(field => {
        if (formData.contactInfo[field]) {
            const input = document.querySelector(`input[name="${field}"]`);
            if (input) input.value = formData.contactInfo[field];
        }
    });

    if (formData.caseDetails) {
        const textarea = document.querySelector('textarea[name="caseDetails"]');
        if (textarea) textarea.value = formData.caseDetails;
    }
}

function restoreSelections() {
    // Restore referral selection
    if (formData.referralSource) {
        const referralCard = document.querySelector(`[data-referral="${formData.referralSource}"]`);
        if (referralCard) referralCard.classList.add('selected');

        if (formData.referralSource === 'other' && formData.otherReferralDetails) {
            const otherInput = document.querySelector('[name="otherReferral"]');
            if (otherInput) {
                otherInput.value = formData.otherReferralDetails;
                document.getElementById('other-referral-input')?.classList.remove('hidden');
            }
        }
    }

    // Restore service selection
    if (formData.serviceType) {
        const serviceCard = document.querySelector(`[data-service="${formData.serviceType}"]`);
        if (serviceCard) serviceCard.classList.add('selected');
    }

    // Restore consultation type
    if (formData.consultationType) {
        const consultationCard = document.querySelector(`[data-type="${formData.consultationType}"]`);
        if (consultationCard) consultationCard.classList.add('selected');

        updateConsultationTypeText();
    }
}

// Name placeholder updates
function updateNamePlaceholders(fullName) {
    const firstName = fullName.split(' ')[0];
    document.querySelectorAll('.fname-placeholder').forEach(el => {
        el.textContent = firstName;
    });
}

// Service Options Population
function populateServiceOptions() {
    const services = [
        'Real Estate Litigation',
        'Landlord / Tenant Matters',
        'Premises Liability',
        'Boundary Disputes',
        'Quiet Title Actions',
        'Adverse Possession Claims',
        'Easements and Encroachments',
        'Mortgage Fraud',
        'Foreclosure Defense',
        'Contract Review and Drafting',
        'Purchase Agreements',
        'Real Estate Closings',
        'Real Estate Broker Disputes',
        'Real Estate Financing Documents',
        'Title and Escrow Disputes'
    ];

    const container = document.getElementById('service-options');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.textContent = service;
        card.dataset.service = service;
        container.appendChild(card);
    });
}

// Event Handlers

// Step 1: Contact Information Form
function initContactForm() {
    const form = document.getElementById('client-info-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateContactInfo()) return;

        showSpinner(true);

        const formDataObj = new FormData(e.target);
        formData.contactInfo = {
            fullName: formDataObj.get('fullName'),
            email: formDataObj.get('email'),
            phone: formDataObj.get('phone'),
            location: formDataObj.get('location')
        };

        updateNamePlaceholders(formData.contactInfo.fullName);

        // Send to Formspree (optional)
        try {
            await fetch('https://formspree.io/f/xpwlpapw', {
                method: 'POST',
                body: formDataObj,
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            console.log('Formspree submission error:', error);
        }

        showSpinner(false);
        nextStep();
    });
}

// Step 2: Referral Source Selection
function initReferralSelection() {
    const options = document.getElementById('referral-options');
    if (!options) return;

    options.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;

        // Clear previous selection
        document.querySelectorAll('#referral-options .option-card').forEach(c => 
            c.classList.remove('selected')
        );
        card.classList.add('selected');

        formData.referralSource = card.dataset.referral;

        // Handle special case for "Other"
        const otherInput = document.getElementById('other-referral-input');
        const referralNext = document.getElementById('referral-next');

        if (card.dataset.referral === 'other') {
            otherInput?.classList.remove('hidden');
            referralNext?.classList.add('hidden');
        } else {
            otherInput?.classList.add('hidden');
            referralNext?.classList.remove('hidden');
            formData.otherReferralDetails = '';
            // Auto-advance after selection
            setTimeout(() => nextStep(), 500);
        }
    });

    // Handle "Other" input
    const otherInput = document.querySelector('input[name="otherReferral"]');
    if (otherInput) {
        otherInput.addEventListener('input', (e) => {
            formData.otherReferralDetails = e.target.value;
        });
    }
}

// Handle "Other" referral next button
function handleOtherReferralNext() {
    if (formData.otherReferralDetails.trim()) {
        nextStep();
    } else {
        showValidationError('Please specify how you found us.');
    }
}

// Step 3: Service Selection
function initServiceSelection() {
    const container = document.getElementById('service-options');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;

        // Clear previous selection
        document.querySelectorAll('#service-options .option-card').forEach(c => 
            c.classList.remove('selected')
        );
        card.classList.add('selected');

        formData.serviceType = card.dataset.service;

        // Show next button
        const nextBtn = document.getElementById('service-next');
        if (nextBtn) nextBtn.classList.remove('hidden');

        // Auto-advance after selection
        setTimeout(() => nextStep(), 500);
    });
}

// Step 4: Case Details Form
function initCaseForm() {
    const form = document.getElementById('case-info-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateCaseDetails()) return;

        showSpinner(true);

        const formDataObj = new FormData(e.target);
        formData.caseDetails = formDataObj.get('caseDetails');

        showSpinner(false);
        nextStep();
    });
}

// Step 5: Consultation Type Selection
function initConsultationSelection() {
    const options = document.getElementById('consultation-options');
    if (!options) return;

    options.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;

        // Clear previous selection
        document.querySelectorAll('.consultation-option').forEach(c => 
            c.classList.remove('selected')
        );
        card.classList.add('selected');

        formData.consultationType = card.dataset.type;
        formData.consultationPrice = parseInt(card.dataset.price);

        updateConsultationTypeText();

        // Show next button
        const nextBtn = document.getElementById('consultation-next');
        if (nextBtn) nextBtn.classList.remove('hidden');

        // Auto-advance after selection
        setTimeout(() => nextStep(), 500);
    });
}

function updateConsultationTypeText() {
    const consultationText = formData.consultationType === 'paid' ? 
        'Full Consultation' : 'Brief Call';
    document.querySelectorAll('.consultation-type-text').forEach(el => {
        el.textContent = consultationText;
    });
}

function handleConsultationNext() {
    if (formData.consultationType === 'paid') {
        nextStep(); // Go to add-ons
    } else {
        goToStep(7); // Skip add-ons, go to scheduling
    }
}

// Step 6: Add-ons Management
function initAddonsManagement() {
    const documentReview = document.getElementById('document-review');
    const consultationTranscript = document.getElementById('consultation-transcript');

    if (documentReview) {
        documentReview.addEventListener('change', (e) => {
            formData.addons.documentReview = e.target.checked;
            updateTotalCost();
        });
    }

    if (consultationTranscript) {
        consultationTranscript.addEventListener('change', (e) => {
            formData.addons.consultationTranscript = e.target.checked;
        });
    }
}

function updateTotalCost() {
    let total = formData.consultationPrice;
    const documentCost = document.getElementById('document-cost');

    if (formData.addons.documentReview) {
        total += 150;
        if (documentCost) documentCost.style.display = 'flex';
    } else {
        if (documentCost) documentCost.style.display = 'none';
    }

    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) totalAmount.textContent = `$${total}`;
    formData.totalAmount = total;
}

// Step 7: Scheduling Form
function initSchedulingForm() {
    const form = document.getElementById('scheduling-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateScheduling()) return;

        const formDataObj = new FormData(e.target);
        formData.scheduling = {
            preferredDateTime: formDataObj.get('preferredDateTime'),
            alternativeDateTime: formDataObj.get('alternativeDateTime'),
            zoomPreference: formDataObj.get('zoomPreference') === 'yes',
            additionalNotes: formDataObj.get('additionalNotes')
        };

        nextStep();
    });
}

// Step 8: Disclaimer and Final Submission
function initFinalSubmission() {
    const disclaimerCheckbox = document.getElementById('disclaimer-agreement');
    if (disclaimerCheckbox) {
        disclaimerCheckbox.addEventListener('change', (e) => {
            formData.disclaimerAccepted = e.target.checked;
            const submitBtn = document.getElementById('final-submit-btn');
            if (submitBtn) {
                submitBtn.disabled = !e.target.checked;
            }
        });
    }

    const finalForm = document.getElementById('final-submission-form');
    if (finalForm) {
        finalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!formData.disclaimerAccepted) {
                showValidationError('Please accept the terms and conditions to proceed.');
                return;
            }

            showSpinner(true, 'final-submit-btn');

            try {
                // Send to Zapier webhook
                await fetch('YOUR_ZAPIER_WEBHOOK_URL', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        submissionTime: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        referrer: document.referrer
                    })
                });

                // Show success step
                showSpinner(false, 'final-submit-btn');
                nextStep();
                populateNextSteps();

                // Clear saved data
                localStorage.removeItem('legalFormData');

            } catch (error) {
                console.error('Submission error:', error);
                showSpinner(false, 'final-submit-btn');
                showValidationError('There was an error submitting your form. Please try again or contact us directly.');
            }
        });
    }
}

function populateConsultationSummary() {
    const summary = document.getElementById('consultation-summary');
    if (!summary) return;

    const consultationType = formData.consultationType === 'paid' ? 
        'Full 60-Minute Consultation' : 'Brief 15-Minute Call';

    let addonsText = '';
    if (formData.consultationType === 'paid') {
        const addons = [];
        if (formData.addons.documentReview) addons.push('Document Review Service (+$150)');
        if (formData.addons.consultationTranscript) addons.push('Free Consultation Transcript');
        addonsText = addons.length > 0 ? `<br><strong>Add-ons:</strong> ${addons.join(', ')}` : '';
    }

    const totalCost = formData.consultationType === 'paid' ? 
        `<br><strong>Total Cost:</strong> $${formData.totalAmount || formData.consultationPrice}` : 
        '<br><strong>Cost:</strong> FREE';

    const preferredDateTime = formData.scheduling.preferredDateTime ? 
        new Date(formData.scheduling.preferredDateTime).toLocaleString() : 'Not selected';

    summary.innerHTML = `
        <p><strong>Service:</strong> ${formData.serviceType}</p>
        <p><strong>Consultation Type:</strong> ${consultationType}</p>
        ${addonsText}
        ${totalCost}
        <p><strong>Preferred Date/Time:</strong> ${preferredDateTime} PST</p>
        <p><strong>Zoom Preference:</strong> ${formData.scheduling.zoomPreference ? 'Yes' : 'No'}</p>
    `;
}

function populateNextSteps() {
    const nextStepsList = document.getElementById('next-steps-list');
    const successMessage = document.getElementById('success-message');

    if (!nextStepsList || !successMessage) return;

    if (formData.consultationType === 'paid') {
        successMessage.textContent = 'Your paid consultation request has been submitted successfully.';
        nextStepsList.innerHTML = `
            <li>You will receive a payment link via email within 10 minutes</li>
            <li>Complete payment to confirm your consultation booking</li>
            <li>Once paid, you'll receive a calendar invitation with Zoom details</li>
            <li>Prepare any relevant documents for your consultation</li>
            <li>Our office will contact you 24 hours before your appointment</li>
        `;
    } else {
        successMessage.textContent = 'Your free consultation request has been submitted successfully.';
        nextStepsList.innerHTML = `
            <li>You will receive a calendar invitation within 10 minutes</li>
            <li>The call will be brief (15 minutes) to understand your basic needs</li>
            <li>We'll discuss if a full consultation would be beneficial</li>
            <li>Our office will contact you if we need to reschedule</li>
        `;
    }
}

// Utility Functions
function showSpinner(show, buttonId = null) {
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const submitText = button.querySelector('.submit-text');
        const spinner = button.querySelector('.loading-spinner');

        if (show) {
            if (submitText) submitText.style.display = 'none';
            if (spinner) spinner.style.display = 'inline-block';
            button.disabled = true;
        } else {
            if (submitText) submitText.style.display = 'inline';
            if (spinner) spinner.style.display = 'none';
            button.disabled = false;
        }
    }
}

// Save Progress Buttons
function initSaveButtons() {
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            autoSave();

            // Show save confirmation
            const originalText = btn.textContent;
            btn.textContent = 'Saved! ✓';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        });
    });
}

// Smooth scrolling for focused inputs
function initInputFocusHandling() {
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('focus', () => {
            setTimeout(() => {
                el.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        });
    });
}

// Dark mode detection and logo update
function updateLogoForDarkMode() {
    const logo = document.getElementById('main-logo');
    if (!logo) return;

    // Check if dark mode is preferred
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
        Logo.style.filter = 'brightness(0) invert(1)';
    } else {
        logo.style.filter = '';
    }
}

// Listen for dark mode changes
function initDarkModeListener() {
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogoForDarkMode);
    }
}

// Initialize Application
function initializeApp() {
    // Populate service options
    populateServiceOptions();

    // Initialize all form handlers
    initContactForm();
    initReferralSelection();
    initServiceSelection();
    initCaseForm();
    initConsultationSelection();
    initAddonsManagement();
    initSchedulingForm();
    initFinalSubmission();
    initSaveButtons();
    initInputFocusHandling();
    initDarkModeListener();

    // Restore saved data
    restoreFormData();

    // Update progress
    updateProgress();

    // Update logo for current mode
    updateLogoForDarkMode();

    // Initialize cost calculation for add-ons step
    if (formData.consultationType === 'paid') {
        updateTotalCost();
    }
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('option-card')) {
            e.target.click();
        }

        // Allow Escape key to go back
        if (e.key === 'Escape' && currentStep > 1) {
            prevStep();
        }
    });
}

// Auto-save on input changes
function initAutoSave() {
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea')) {
            clearTimeout(window.autoSaveTimeout);
            window.autoSaveTimeout = setTimeout(autoSave, 1000);
        }
    });
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initKeyboardNavigation();
    initAutoSave();
});

// Global functions for onclick handlers
window.prevStep = prevStep;
window.nextStep = nextStep;
window.handleOtherReferralNext = handleOtherReferralNext;
window.handleConsultationNext = handleConsultationNext;
