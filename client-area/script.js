// === CONFIG PLACEHOLDERS ===
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwlpapw'; // e.g. https://formspree.io/f/xyz
const ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';

// Debounce helper
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

let currentStep = 1;
const steps = () => document.querySelectorAll('.step');
const progressBar = () => document.querySelector('.progress');
let locked = false; // prevent double transition

// In-memory form data (persisted to localStorage)
let formData = {
  step: 1,
  contactInfo: {},
  referralSource: '',
  otherReferralDetails: '',
  serviceType: '',
  caseDetails: '',
  consultationType: '',
  consultationPrice: 0,
  addons: { documentReview: false, consultationTranscript: true },
  scheduling: {},
  disclaimerAccepted: false,
  totalAmount: 0
};

function updateProgress() {
  const total = document.querySelectorAll('.step').length - 1; // last is success
  const pct = Math.min((currentStep - 1) / (total - 1), 1) * 100;
  if (progressBar()) progressBar().style.width = pct + '%';
}

function goToStep(stepNum) {
  if (locked) return;
  locked = true;
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  currentStep = stepNum;
  const target = document.querySelector(`.step[data-step="${stepNum}"]`);
  if (target) target.classList.add('active');
  updateProgress();
  formData.step = currentStep;
  autoSave();
  setTimeout(() => { locked = false; }, 300);
}

function nextStep() { // guarded
  if (!validateStep(currentStep)) return;
  if (formData.consultationType === 'free' && currentStep === 5) {
    goToStep(7);
  } else if (formData.consultationType === 'paid' && currentStep === 5) {
    goToStep(6);
  } else {
    goToStep(currentStep + 1);
  }
}

function prevStep() {
  if (locked) return;
  if (currentStep > 1) goToStep(currentStep - 1);
}

function autoSave() {
  localStorage.setItem('legalFormData', JSON.stringify(formData));
}

function restoreFormData() {
  const saved = localStorage.getItem('legalFormData');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    formData = { ...formData, ...data };

    if (formData.contactInfo.fullName) document.getElementById('fullName').value = formData.contactInfo.fullName;
    if (formData.contactInfo.email) document.getElementById('email').value = formData.contactInfo.email;
    if (formData.contactInfo.phone) document.getElementById('phone').value = formData.contactInfo.phone;
    if (formData.contactInfo.location) document.getElementById('location').value = formData.contactInfo.location;
    if (formData.caseDetails) document.getElementById('caseDetails').value = formData.caseDetails;

    if (formData.referralSource) {
      const card = document.querySelector(`[data-referral="${formData.referralSource}"]`);
      if (card) card.classList.add('selected');
    }
    if (formData.serviceType) {
      const card = document.querySelector(`[data-service="${formData.serviceType}"]`);
      if (card) card.classList.add('selected');
    }
    if (formData.consultationType) {
      const card = document.querySelector(`.consultation-option[data-type="${formData.consultationType}"]`);
      if (card) card.classList.add('selected');
    }
    if (formData.scheduling.preferredDateTime) {
      document.getElementById('preferredDateTime').value = formData.scheduling.preferredDateTime;
    }
    if (formData.disclaimerAccepted) {
      document.getElementById('disclaimer-agreement').checked = true;
    }
    if (formData.step) {
      goToStep(formData.step);
    }
  } catch (e) {
    console.warn('Failed restoring saved data', e);
  }
}


function validateStep(step) {
  // Clear existing errors
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
  let valid = true;
  let firstInvalid = null;

  switch (step) {
    case 1:
      ['fullName', 'email', 'phone', 'location'].forEach(name => {
        const el = document.getElementById(name);
        if (!el || !el.value.trim()) {
          showError(name, 'This field is required.');
          if (!firstInvalid && el) firstInvalid = el;
          valid = false;
        } else if (name === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)) {
          showError(name, 'Email seems invalid.');
          if (!firstInvalid && el) firstInvalid = el;
          valid = false;
        }
      });
      break;
    case 2:
      if (!formData.referralSource) valid = false;
      break;
    case 3:
      if (!formData.serviceType) valid = false;
      break;
    case 4:
      if (!formData.caseDetails || !formData.caseDetails.trim()) {
        showError('caseDetails', 'Provide case details.');
        const el = document.getElementById('caseDetails');
        if (!firstInvalid && el) firstInvalid = el;
        valid = false;
      }
      break;
    case 5:
      if (!formData.consultationType) valid = false;
      break;
    case 7:
      if (!formData.scheduling.preferredDateTime) {
        showError('preferredDateTime', 'Pick a preferred date/time.');
        const el = document.getElementById('preferredDateTime');
        if (!firstInvalid && el) firstInvalid = el;
        valid = false;
      }
      break;
    case 8:
      if (!formData.disclaimerAccepted) valid = false;
      break;
  }

  if (!valid && firstInvalid) {
    firstInvalid.focus();
  }
  return valid;
}




function showError(fieldName, message) {
  const errEl = document.querySelector(`.error[data-for="${fieldName}"]`);
  if (errEl) errEl.textContent = message;
}

function updateTotalCost() {
  let total = formData.consultationPrice || 0;
  if (formData.addons.documentReview) total += 150;
  formData.totalAmount = total;
  const totalElem = document.getElementById('total-amount');
  if (totalElem) totalElem.textContent = `$${total}`;
  const docCost = document.getElementById('document-cost');
  if (formData.addons.documentReview) docCost.style.display = 'block'; else docCost.style.display = 'none';
}

function populateConsultationSummary() {
  const summary = document.getElementById('consultation-summary');
  if (!summary) return;
  const consultationText = formData.consultationType === 'paid' ? 'Full 60-Minute Consultation' : 'Brief 15-Minute Call';
  let addonsText = '';
  if (formData.consultationType === 'paid') {
    const addons = [];
    if (formData.addons.documentReview) addons.push('Document Review Service (+$150)');
    if (formData.addons.consultationTranscript) addons.push('Consultation Transcript (free)');
    if (addons.length) addonsText = `<br><strong>Add-ons:</strong> ${addons.join(', ')}`;
  }
  const totalCost = formData.consultationType === 'paid' ? `$${formData.totalAmount}` : 'FREE';
  const pref = formData.scheduling.preferredDateTime ? new Date(formData.scheduling.preferredDateTime).toLocaleString(undefined, { timeZoneName: 'short' }) : 'Not selected';
  summary.innerHTML = `
    <p><strong>Service:</strong> ${formData.serviceType}</p>
    <p><strong>Consultation Type:</strong> ${consultationText}</p>
    ${addonsText}
    <p><strong>Total Cost:</strong> ${totalCost}</p>
    <p><strong>Preferred:</strong> ${pref}</p>
    <p><strong>Zoom Preference:</strong> ${formData.scheduling.zoomPreference ? 'Yes' : 'No'}</p>
  `;
}

function populateNextSteps() {
  const list = document.getElementById('next-steps-list');
  const msg = document.getElementById('success-message');
  if (!list || !msg) return;
  if (formData.consultationType === 'paid') {
    msg.textContent = 'Your paid consultation request has been submitted successfully.';
    list.innerHTML = `
      <li>Payment link will be emailed within 10 minutes.</li>
      <li>Confirm payment to lock in the appointment.</li>
      <li>Calendar invite with Zoom details will follow.</li>
      <li>Prepare materials ahead of the consultation.</li>
    `;
  } else {
    msg.textContent = 'Your free consultation request has been submitted successfully.';
    list.innerHTML = `
      <li>Calendar invite will be emailed shortly.</li>
      <li>Initial 15-minute call to assess need.</li>
      <li>We may recommend a full consultation afterward.</li>
    `;
  }
}

function disableDuringTransition(button) {
  button.disabled = true;
  setTimeout(() => { button.disabled = false; }, 600);
}

// Event wiring
document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  restoreFormData();

  // Real-time validation on inputs
  ['fullName','email','phone','location','caseDetails','preferredDateTime'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debounce(() => {
        validateStep(currentStep);
      }, 300));
    }
  });

  // Step 1 submission
  document.getElementById('client-info-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    const form = e.target;
    disableDuringTransition(document.getElementById('to-step-2'));
    const fd = new FormData(form);
    formData.contactInfo = {
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      location: fd.get('location')
    };
    try { await fetch(FORMSPREE_ENDPOINT, { method:'POST', body: fd, headers:{ 'Accept':'application/json' } }); } catch (err) { console.warn('Formspree failed', err); }
    nextStep();
  });

  // Referral selection
  document.getElementById('referral-options')?.addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    document.querySelectorAll('#referral-options .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.referralSource = card.dataset.referral;
    if (formData.referralSource === 'other') {
      document.getElementById('other-referral-input')?.classList.remove('hidden');
    } else {
      document.getElementById('other-referral-input')?.classList.add('hidden');
      setTimeout(() => nextStep(), 300);
    }
  });
  document.getElementById('otherReferral')?.addEventListener('input', (e) => { formData.otherReferralDetails = e.target.value; });

  // Populate service options
  const services = ['Real Estate Litigation','Boundary Disputes','Quiet Title Actions','Contract Review','Closings'];
  const container = document.getElementById('service-options');
  services.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.textContent = svc;
    card.dataset.service = svc;
    container.appendChild(card);
  });
  container?.addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;
    document.querySelectorAll('#service-options .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.serviceType = card.dataset.service;
    setTimeout(() => nextStep(), 300);
  });

  // Case details
  document.getElementById('case-info-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    formData.caseDetails = document.getElementById('caseDetails').value;
    nextStep();
  });

  // Consultation selection
  document.querySelectorAll('.consultation-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.consultation-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      formData.consultationType = opt.dataset.type;
      formData.consultationPrice = parseInt(opt.dataset.price, 10) || 0;
      updateTotalCost();
      setTimeout(() => nextStep(), 300);
    });
  });

  // Add-ons
  document.getElementById('document-review')?.addEventListener('change', (e) => { formData.addons.documentReview = e.target.checked; updateTotalCost(); });
  document.getElementById('consultation-transcript')?.addEventListener('change', (e) => { formData.addons.consultationTranscript = e.target.checked; });

  // Scheduling
  document.getElementById('scheduling-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(7)) return;
    formData.scheduling = {
      preferredDateTime: document.getElementById('preferredDateTime').value,
      alternativeDateTime: document.getElementById('alternativeDateTime').value,
      zoomPreference: document.querySelector('select[name="zoomPreference"]').value === 'yes',
      additionalNotes: document.getElementById('additionalNotes').value
    };
    nextStep();
  });

  // Disclaimer
  document.getElementById('disclaimer-agreement')?.addEventListener('change', (e) => {
    formData.disclaimerAccepted = e.target.checked;
    document.getElementById('final-submit-btn').disabled = !e.target.checked;
  });

  // Final submit
  document.getElementById('final-submission-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formData.disclaimerAccepted) return;
    populateConsultationSummary();
    disableDuringTransition(document.getElementById('final-submit-btn'));
    try {
      await fetch(ZAPIER_WEBHOOK_URL, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }) });
      populateNextSteps();
      document.getElementById('success-screen')?.classList.remove('hidden');
      goToStep(9); // success screen index beyond 8
      localStorage.removeItem('legalFormData');
    } catch (err) { console.error('Submit failed', err); alert('Submission failed.'); }
  });

  // Back buttons
  document.querySelectorAll('[data-action="prev"]').forEach(b => b.addEventListener('click', prevStep));
  document.querySelectorAll('[data-action="next"]').forEach(b => b.addEventListener('click', nextStep));
});
