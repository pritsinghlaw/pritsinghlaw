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
    serviceType: '',
    caseDetails: '',
    consultationType: '',
    consultationPrice: 0,
    addons: {
        documentReview: false,
        consultationTranscript: true
    },
    scheduling: {},
    disclaimerAccepted: false
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
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');
        updateProgress();
        autoSave();
    }
}

function nextStep() {
    if (currentStep < totalSteps + 1) {
        steps[currentStep - 1].classList.remove('active');
        currentStep++;
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

// Auto-save Functionality
function autoSave() {
    formData.step = currentStep;
    localStorage.setItem('legalFormData', JSON.stringify(formData));
}

function restoreFormData() {
    const saved = localStorage.getItem('legalFormData');
    if (saved) {
        const data = JSON.parse(saved);
        formData = { ...formData, ...data };
        
        // Restore form fields
        if (formData.contactInfo.fullName) {
            document.querySelector('input[name="fullName"]').value = formData.contactInfo.fullName;
            updateNamePlaceholders(formData.contactInfo.fullName);
        }
        if (formData.contactInfo.email) {
            document.querySelector('input[name="email"]').value = formData.contactInfo.email;
        }
        if (formData.contactInfo.phone) {
            document.querySelector('input[name="phone"]').value = formData.contactInfo.phone;
        }
        if (formData.contactInfo.location) {
            document.querySelector('input[name="location"]').value = formData.contactInfo.location;
        }
        if (formData.caseDetails) {
            document.querySelector('textarea[name="caseDetails"]').value = formData.caseDetails;
        }
        
        // Restore selections
        if (formData.referralSource) {
            const referralCard = document.querySelector(`[data-referral="${formData.referralSource}"]`);
            if (referralCard) referralCard.classList.add('selected');
        }
        
        if (formData.serviceType) {
            const serviceCard = document.querySelector(`[data-service="${formData.serviceType}"]`);
            if (serviceCard) serviceCard.classList.add('selected');
        }
        
        // Restore step
        if (data.step && data.step !== 1) {
            goToStep(data.step);
        }
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
    container.innerHTML = ''; // Clear existing content
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.textContent = service;
        card.dataset.service = service;
        container.appendChild(card);
    });
}

// Step 1: Contact Information Form
document.getElementById('client-info-form').addEventListener('submit', async (e) => {
    e.preventDefault();
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

// Step 2: Referral Source Selection
document.getElementById('referral-options').addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    
    document.querySelectorAll('#referral-options .option-card').forEach(c => 
        c.classList.remove('selected')
    );
    card.classList.add('selected');
    
    formData.referralSource = card.dataset.referral;
    
    // Show/hide other input
    const otherInput = document.getElementById('other-referral-input');
    if (card.dataset.referral === 'other') {
        otherInput.classList.remove('hidden');
        // Don't auto-advance for "other" option
    } else {
        otherInput.classList.add('hidden');
        formData.otherReferralDetails = '';
        // Auto-advance after a short delay
        setTimeout(() => nextStep(), 500);
    }
});

// Handle "Other" referral input
document.querySelector('input[name="otherReferral"]').addEventListener('input', (e) => {
    formData.otherReferralDetails = e.target.value;
});

// Step 3: Service Selection
document.getElementById('service-options').addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    
    document.querySelectorAll('#service-options .option-card').forEach(c => 
        c.classList.remove('selected')
    );
    card.classList.add('selected');
    
    formData.serviceType = card.dataset.service;
    setTimeout(() => nextStep(), 500);
});

// Step 4: Case Details Form
document.getElementById('case-info-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showSpinner(true);
    
    const formDataObj = new FormData(e.target);
    formData.caseDetails = formDataObj.get('caseDetails');
    
    showSpinner(false);
    nextStep();
});

// Step 5: Consultation Type Selection
document.querySelector('.step:nth-child(5) .options').addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    
    document.querySelectorAll('.consultation-option').forEach(c => 
        c.classList.remove('selected')
    );
    card.classList.add('selected');
    
    formData.consultationType = card.dataset.type;
    formData.consultationPrice = parseInt(card.dataset.price);
    
    // Update consultation type text
    const consultationText = formData.consultationType === 'paid' ? 
        'Full Consultation' : 'Brief Call';
    document.querySelectorAll('.consultation-type-text').forEach(el => {
        el.textContent = consultationText;
    });
    
    setTimeout(() => {
        if (formData.consultationType === 'paid') {
            nextStep(); // Go to add-ons step
        } else {
            goToStep(7); // Skip add-ons, go to scheduling
        }
    }, 500);
});

// Step 6: Add-ons Management
document.addEventListener('DOMContentLoaded', () => {
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
});

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
document.getElementById('scheduling-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData(e.target);
    formData.scheduling = {
        preferredDateTime: formDataObj.get('preferredDateTime'),
        alternativeDateTime: formDataObj.get('alternativeDateTime'),
        zoomPreference: formDataObj.get('zoomPreference') === 'yes',
        additionalNotes: formDataObj.get('additionalNotes')
    };
    
    nextStep();
});

// Step 8: Disclaimer and Final Submission
document.getElementById('disclaimer-agreement').addEventListener('change', (e) => {
    formData.disclaimerAccepted = e.target.checked;
    const submitBtn = document.getElementById('final-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !e.target.checked;
    }
});

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

// Final Form Submission
document.getElementById('final-submission-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!formData.disclaimerAccepted) {
        alert('Please accept the terms and conditions to proceed.');
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
        alert('There was an error submitting your form. Please try again or contact us directly.');
    }
});

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
document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        autoSave();
        
        // Show save confirmation
        const originalText = btn.textContent;
        btn.textContent = 'Saved! ✓';
        btn.style.background = '#38a169';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
});

// Smooth scrolling for focused inputs
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

// Dark mode detection and logo update
function updateLogoForDarkMode() {
    const logo = document.getElementById('main-logo');
    if (!logo) return;
    
    // Check if dark mode is preferred
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        logo.classList.add('dark-mode');
    } else {
        logo.classList.remove('dark-mode');
    }
}

// Listen for dark mode changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogoForDarkMode);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    populateServiceOptions();
    restoreFormData();
    updateProgress();
    updateLogoForDarkMode();
    
    // Initialize cost calculation for add-ons step
    if (formData.consultationType === 'paid') {
        updateTotalCost();
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('option-card')) {
        e.target.click();
    }
});

// Form Validation Enhancement
function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            const requiredFields = ['fullName', 'email', 'phone', 'location'];
            return requiredFields.every(field => {
                const input = document.querySelector(`input[name="${field}"]`);
                return input && input.value.trim() !== '';
            });
        case 2:
            return formData.referralSource !== '';
        case 3:
            return formData.serviceType !== '';
        case 4:
            return formData.caseDetails.trim() !== '';
        case 5:
            return formData.consultationType !== '';
        case 7:
            return formData.scheduling.preferredDateTime !== '';
        case 8:
            return formData.disclaimerAccepted;
        default:
            return true;
    }
}

// Auto-save on input changes
document.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea')) {
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(autoSave, 1000);
    }
});
