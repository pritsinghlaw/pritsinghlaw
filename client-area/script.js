// Steps management
let currentStep = 1;
const totalSteps = 5;
const steps = document.querySelectorAll('.step');

// Populate service options
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
const serviceContainer = document.getElementById('service-options');
services.forEach(name => {
  const div = document.createElement('div');
  div.className = 'option-card';
  div.textContent = name;
  div.dataset.service = name;
  serviceContainer.appendChild(div);
});

// Proceed to next step
function nextStep() {
  if (currentStep < totalSteps) {
    steps[currentStep - 1].classList.remove('active');
    currentStep++;
    steps[currentStep - 1].classList.add('active');
  }
}

// Go back
function prevStep() {
  if (currentStep > 1) {
    steps[currentStep - 1].classList.remove('active');
    currentStep--;
    steps[currentStep - 1].classList.add('active');
  }
}

// Handle client info submission
document.getElementById('client-info-form').addEventListener('submit', e => {
  e.preventDefault();
  // TODO: store client form data
  nextStep();
});

// Handle service selection
serviceContainer.addEventListener('click', e => {
  const card = e.target.closest('.option-card');
  if (!card) return;
  document.querySelectorAll('#service-options .option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  // store selected service
  sessionStorage.setItem('selectedService', card.dataset.service);
  nextStep();
});

// Handle case info submission
document.getElementById('case-info-form').addEventListener('submit', e => {
  e.preventDefault();
  // TODO: store case info
  nextStep();
});

// Consultation choice logic
document.querySelector('.step-4 .options').addEventListener('click', e => {
  const card = e.target.closest('.option-card');
  if (!card) return;
  const type = card.dataset.type;
  nextStep();
  // redirect after 0.5s
  setTimeout(() => {
    if (type === 'free') {
      window.location.href = 'https://calendly.com/your-firm/free-15min';
    } else {
      window.location.href = 'https://calendly.com/your-firm/consult-1hr';
    }
  }, 500);
});
