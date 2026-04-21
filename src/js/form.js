/* ============================================
   form.js — Contact form validation (ES module)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  // Min date = today
  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    let valid = true;
    const name    = form.querySelector('#name');
    const phone   = form.querySelector('#phone');
    const city    = form.querySelector('#city');
    const service = form.querySelector('#service');
    const email   = form.querySelector('#email');

    if (!name?.value.trim())   { name.closest('.form-group').classList.add('error');    valid = false; }
    if (!phone?.value.trim() || !/^[\+]?[0-9\s\-]{8,15}$/.test(phone.value.trim())) {
      phone.closest('.form-group').classList.add('error'); valid = false;
    }
    if (!city?.value.trim())   { city.closest('.form-group').classList.add('error');    valid = false; }
    if (!service?.value)       { service.closest('.form-group').classList.add('error'); valid = false; }
    if (email?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.closest('.form-group').classList.add('error'); valid = false;
    }

    if (!valid) {
      form.querySelector('.form-group.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    form.style.display = 'none';
    successEl?.classList.add('active');
    // Production: replace with Formspree / Netlify / custom fetch
    console.log('Form submitted:', Object.fromEntries(new FormData(form)));
  });

  // Clear errors on change
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    ['input', 'change'].forEach(ev =>
      input.addEventListener(ev, () => input.closest('.form-group')?.classList.remove('error'))
    );
  });
});
