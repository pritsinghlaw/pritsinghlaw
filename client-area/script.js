// Step control 
let currentStep = 1;
let selectedConsultationType = '';
let selectedReferral = '';
let selectedService = '';
let totalFee = 350;

const steps = document.querySelectorAll('.step');
const progress = document.querySelector('.progress');
const totalSteps = steps.length;

// Progress update
function updateProgress() {
  const pct = ((currentStep - 1)/(totalSteps - 1))*100;
  progress.style.width = pct + '%';
}

// Step navigation
function prevStep(){
  if(currentStep > 1){
    steps[currentStep - 1].classList.remove('active');
    currentStep--;
    steps[currentStep - 1].classList.add('active');
    updateProgress();
  }
}

function nextStep(){
  if(currentStep < totalSteps){
    steps[currentStep - 1].classList.remove('active');
    currentStep++;
    steps[currentStep - 1].classList.add('active');
    updateProgress();

    // Skip step 6 if brief consultation is selected
    if(currentStep === 6 && selectedConsultationType === 'brief') {
      currentStep++;
      steps[5].classList.remove('active');
      steps[6].classList.add('active');
      updateProgress();
    }
  }
}

// Spinner functions
function showSpinner(show) {
  const spinner = document.querySelector('.spinner-overlay');
  if (spinner) {
    spinner.hidden = !show;
    spinner.style.display = show ? 'flex' : 'none';
  }
}

// Autosave function
function autoSave() {
  const data = {
    step: currentStep,
    fname: sessionStorage.getItem('fname'),
    referral: selectedReferral,
    service: selectedService,
    consultationType: selectedConsultationType,
    form: {},
    case: '',
    scheduling: {},
    totalFee: totalFee
  };

  // Save client info form
  const clientForm = document.getElementById('client-info-form');
  if (clientForm) {
    data.form = Object.fromEntries(new FormData(clientForm));
  }

  // Save case info
  const caseForm = document.getElementById('case-info-form');
  if (caseForm) {
    const textarea = caseForm.querySelector('textarea');
    data.case = textarea ? textarea.value : '';
  }

  // Save scheduling info
  const schedulingForm = document.getElementById('scheduling-form');
  if (schedulingForm) {
    data.scheduling = Object.fromEntries(new FormData(schedulingForm));
  }

  localStorage.setItem('formData', JSON.stringify(data));
}

// Restore function
function restore() {
  const data = JSON.parse(localStorage.getItem('formData') || '{}');

  if(data.step){
    currentStep = data.step;
    steps.forEach((s,i) => s.classList.toggle('active', i === currentStep-1));
    updateProgress();
  }

  if(data.fname){
    document.querySelectorAll('.fname-placeholder').forEach(el => el.textContent = ' ' + data.fname);
  }

  if(data.referral){
    selectedReferral = data.referral;
    const referralCard = document.querySelector(`[data-referral="${data.referral}"]`);
    if(referralCard) referralCard.classList.add('selected');
  }

  if(data.service){
    selectedService = data.service;
    const serviceCard = document.querySelector(`[data-service="${data.service}"]`);
    if(serviceCard) serviceCard.classList.add('selected');
  }

  if(data.consultationType){
    selectedConsultationType = data.consultationType;
    const consultationCard = document.querySelector(`[data-consultation-type="${data.consultationType}"]`);
    if(consultationCard) consultationCard.classList.add('selected');
  }

  if(data.form){
    const form = document.getElementById('client-info-form');
    if(form) {
      Object.entries(data.form).forEach(([k,v]) => {
        const field = form[k];
        if(field) field.value = v;
      });
    }
  }

  if(data.case){
    const textarea = document.querySelector('#case-info-form textarea');
    if(textarea) textarea.value = data.case;
  }

  if(data.scheduling){
    const form = document.getElementById('scheduling-form');
    if(form) {
      Object.entries(data.scheduling).forEach(([k,v]) => {
        const field = form[k];
        if(field) {
          if(field.type === 'checkbox') {
            field.checked = v === 'on';
          } else {
            field.value = v;
          }
        }
      });
    }
  }

  if(data.totalFee){
    totalFee = data.totalFee;
    updateTotalFee();
  }
}

// Update total fee display
function updateTotalFee() {
  const feeDisplay = document.getElementById('total-fee');
  if(feeDisplay) {
    feeDisplay.textContent = '$' + totalFee;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {

  // Add save progress event listeners
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      autoSave();
      alert('Progress saved! ✨');
    });
  });

  // Scroll into view for inputs
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      setTimeout(() => el.scrollIntoView({behavior:'smooth', block:'center'}), 300);
    });
  });

  // Step 1: Client info form submission
  const clientInfoForm = document.getElementById('client-info-form');
  if(clientInfoForm) {
    clientInfoForm.addEventListener('submit', async e => {
      e.preventDefault();

      // Check disclaimer checkbox
      const disclaimer = document.getElementById('disclaimer');
      if(!disclaimer.checked) {
        alert('Please acknowledge the disclaimer to continue.');
        return;
      }

      showSpinner(true);
      const form = e.target;
      const data = new FormData(form);
      const fname = data.get('fullName').split(' ')[0];

      sessionStorage.setItem('fname', fname);
      document.querySelectorAll('.fname-placeholder').forEach(el => el.textContent = ' ' + fname);

      try {
        await fetch('https://formspree.io/f/xpwlpapw', { 
          method:'POST', 
          body:data, 
          headers:{'Accept':'application/json'}
        });
      } catch(error) {
        console.error('Form submission error:', error);
      }

      showSpinner(false);
      nextStep();
    });
  }

  // Step 2: Referral source selection
  const referralOptions = document.getElementById('referral-options');
  if(referralOptions) {
    referralOptions.addEventListener('click', e => {
      const card = e.target.closest('.option-card');
      if(!card) return;

      referralOptions.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
      card.classList.add('selected');
      selectedReferral = card.dataset.referral;
      sessionStorage.setItem('referral', selectedReferral);

      const otherInput = document.getElementById('referral-other');
      if(selectedReferral === 'Other') {
        otherInput.style.display = 'block';
        otherInput.required = true;
        otherInput.focus();
      } else {
        otherInput.style.display = 'none';
        otherInput.required = false;
        setTimeout(() => nextStep(), 500);
      }
    });

    // Handle "Other" input
    const otherInput = document.getElementById('referral-other');
    if(otherInput) {
      otherInput.addEventListener('keypress', e => {
        if(e.key === 'Enter' && otherInput.value.trim()) {
          selectedReferral = 'Other: ' + otherInput.value.trim();
          sessionStorage.setItem('referral', selectedReferral);
          nextStep();
        }
      });
    }
  }

  // Step 3: Service selection
  const serviceContainer = document.getElementById('service-options');
  if(serviceContainer) {
    const services = [
      'Real Estate Litigation','Landlord / Tenant Matters','Premises Liability',
      'Boundary Disputes','Quiet Title Actions','Adverse Possession Claims',
      'Easements and Encroachments','Mortgage Fraud','Foreclosure Defense',
      'Contract Review and Drafting','Purchase Agreements','Real Estate Closings',
      'Real Estate Broker Disputes','Real Estate Financing Documents','Title and Escrow Disputes'
    ];

    services.forEach(name => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.textContent = name;
      card.dataset.service = name;
      serviceContainer.appendChild(card);
    });

    serviceContainer.addEventListener('click', e => {
      const card = e.target.closest('.option-card');
      if(!card) return;

      serviceContainer.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
      card.classList.add('selected');
      selectedService = card.dataset.service;
      sessionStorage.setItem('service', selectedService);

      setTimeout(() => nextStep(), 500);
    });
  }

  // Step 4: Case info form
  const caseInfoForm = document.getElementById('case-info-form');
  if(caseInfoForm) {
    caseInfoForm.addEventListener('submit', async e => {
      e.preventDefault();
      showSpinner(true);

      const data = new FormData(e.target);
      // Add additional data
      data.append('referralSource', selectedReferral);
      data.append('selectedService', selectedService);
      data.append('clientName', sessionStorage.getItem('fname'));

      try {
        await fetch('https://formspree.io/f/xpwlpapw', {
          method:'POST', 
          body:data, 
          headers:{'Accept':'application/json'}
        });
      } catch(error) {
        console.error('Case form submission error:', error);
      }

      showSpinner(false);
      nextStep();
    });
  }

  // Step 5: Consultation type selection
  const consultationOptions = document.querySelector('.step-5 .options');
  if(consultationOptions) {
    consultationOptions.addEventListener('click', e => {
      const card = e.target.closest('.option-card');
      if(!card) return;

      consultationOptions.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
      card.classList.add('selected');
      selectedConsultationType = card.dataset.consultationType;
      sessionStorage.setItem('consultationType', selectedConsultationType);

      // Update consultation type display
      const typeDisplay = document.getElementById('consultation-type-display');
      if(typeDisplay) {
        typeDisplay.textContent = selectedConsultationType === 'brief' ? '15-Minute Call' : '60-Minute Consultation';
      }

      setTimeout(() => nextStep(), 500);
    });
  }

  // Step 6: Document review and transcript options
  const documentReviewCheckbox = document.getElementById('document-review');
  if(documentReviewCheckbox) {
    documentReviewCheckbox.addEventListener('change', e => {
      totalFee = e.target.checked ? 500 : 350;
      updateTotalFee();
      sessionStorage.setItem('totalFee', totalFee);
    });
  }

  // Step 7: Scheduling form
  const schedulingForm = document.getElementById('scheduling-form');
  if(schedulingForm) {
    schedulingForm.addEventListener('submit', async e => {
      e.preventDefault();
      showSpinner(true);

      const formData = new FormData(e.target);

      // Add consultation details
      formData.append('consultationType', selectedConsultationType);
      formData.append('totalFee', totalFee);
      formData.append('clientName', sessionStorage.getItem('fname'));
      formData.append('selectedService', selectedService);
      formData.append('referralSource', selectedReferral);

      // Get add-on selections
      const documentReview = document.getElementById('document-review');
      const transcriptOptout = document.getElementById('transcript-optout');

      formData.append('documentReview', documentReview ? documentReview.checked : false);
      formData.append('transcriptOptout', transcriptOptout ? transcriptOptout.checked : false);

      try {
        // Submit to Zapier webhook (you'll need to replace with actual webhook URL)
        await fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', {
          method:'POST', 
          body:formData
        });
      } catch(error) {
        console.error('Scheduling submission error:', error);
      }

      showSpinner(false);

      // Show appropriate confirmation
      const paymentRequired = document.getElementById('payment-required');
      const freeConsultation = document.getElementById('free-consultation');

      if(selectedConsultationType === 'brief') {
        freeConsultation.style.display = 'block';
        paymentRequired.style.display = 'none';
      } else {
        paymentRequired.style.display = 'block';
        freeConsultation.style.display = 'none';

        // Redirect to payment after a short delay
        setTimeout(() => {
          window.location.href = 'https://your-payment-processor.com/pay?amount=' + totalFee;
        }, 2000);
      }

      nextStep();
    });
  }

  // Initialize
  restore();
  updateProgress();
  updateTotalFee();
});
