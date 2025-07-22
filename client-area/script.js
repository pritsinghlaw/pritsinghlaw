// Step control
let currentStep = 1;
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
    currentStep--; steps[currentStep - 1].classList.add('active');
    updateProgress();
  }
}
function nextStep(){
  if(currentStep < totalSteps){
    steps[currentStep - 1].classList.remove('active');
    currentStep++; steps[currentStep - 1].classList.add('active');
    updateProgress();
  }
}

// Autosave
function autoSave() {
  const data = {
    step: currentStep,
    fname: sessionStorage.getItem('fname'),
    service: sessionStorage.getItem('service'),
    form: Object.fromEntries(new FormData(document.getElementById('client-info-form'))),
    case: document.getElementById('case-info-form')?.caseDetails?.value
  };
  localStorage.setItem('formData', JSON.stringify(data));
}
function restore() {
  const data = JSON.parse(localStorage.getItem('formData')||'{}');
  if(data.step){
    currentStep = data.step;
    steps.forEach((s,i)=>s.classList.toggle('active', i===currentStep-1));
    updateProgress();
  }
  if(data.fname){
    document.querySelectorAll('.fname-placeholder').forEach(el=>el.textContent=data.fname);
  }
  if(data.service){
    const card = [...document.querySelectorAll('#service-options .option-card')]
      .find(c=>c.dataset.service===data.service);
    card?.classList.add('selected');
  }
  if(data.form){
    const form = document.getElementById('client-info-form');
    Object.entries(data.form).forEach(([k,v])=>form[k]&& (form[k].value=v));
  }
  if(data.case){
    const txt = document.querySelector('#case-info-form textarea');
    if(txt) txt.value = data.case;
  }
}
document.querySelectorAll('.save-btn').forEach(btn=>btn.addEventListener('click',()=>{
  autoSave();
  alert('Progress saved! ✨');
}));

// Scroll into view for inputs
document.querySelectorAll('input, textarea').forEach(el=>{
  el.addEventListener('focus',()=>{
    setTimeout(()=> el.scrollIntoView({behavior:'smooth', block:'center'}),300);
  });
});

// Formspree + personalized UX
document.getElementById('client-info-form').addEventListener('submit', async e=>{
  e.preventDefault();
  showSpinner(true);
  const form = e.target;
  const data = new FormData(form);
  const fname = data.get('fullName').split(' ')[0];
  sessionStorage.setItem('fname', fname);
  document.querySelectorAll('.fname-placeholder').forEach(el=>el.textContent=fname);
  await fetch('https://formspree.io/f/YOUR_FORM_ID', { method:'POST', body:data, headers:{'Accept':'application/json'}});
  showSpinner(false);
  nextStep();
});
const serviceContainer = document.getElementById('service-options');
['Real Estate Litigation','Landlord / Tenant Matters','Premises Liability','Boundary Disputes','Quiet Title Actions','Adverse Possession Claims','Easements and Encroachments','Mortgage Fraud','Foreclosure Defense','Contract Review and Drafting','Purchase Agreements','Real Estate Closings','Real Estate Broker Disputes','Real Estate Financing Documents','Title and Escrow Disputes'].forEach(name=>{
  const card = document.createElement('div');
  card.className = 'option-card'; card.textContent = name;
  card.dataset.service = name; serviceContainer.appendChild(card);
});
serviceContainer.addEventListener('click', e=>{
  const c = e.target.closest('.option-card'); if(!c) return;
  serviceContainer.querySelectorAll('.option-card').forEach(o=>o.classList.remove('selected'));
  c.classList.add('selected'); sessionStorage.setItem('service', c.dataset.service);
  nextStep();
});
document.getElementById('case-info-form').addEventListener('submit', async e=>{
  e.preventDefault(); showSpinner(true);
  const data = new FormData(e.target);
  await fetch('https://formspree.io/f/YOUR_FORM_ID', {method:'POST', body:data, headers:{'Accept':'application/json'}});
  showSpinner(false);
  nextStep();
});
document.querySelector('.step-4 .options').addEventListener('click', e=>{
  const c = e.target.closest('.option-card'); if(!c) return;
  c.classList.add('selected'); nextStep();
  setTimeout(()=> window.location.href = c.dataset.type==='free' ? 
    'https://calendly.com/your-firm/free-15min' : 'https://calendly.com/your-firm/consult-1hr'
  ,400);
});

// Initialize
restore();
updateProgress();
