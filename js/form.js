/* ============================================
   form.js — Contact form validation & submit
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');

  if (!form) return;

  // Set minimum date to today
  const dateInput = form.querySelector('#date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear all previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    let isValid = true;

    // Validate required fields
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const city = form.querySelector('#city');
    const service = form.querySelector('#service');

    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!phone.value.trim() || !/^[\+]?[0-9\s\-]{8,15}$/.test(phone.value.trim())) {
      phone.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!city.value.trim()) {
      city.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!service.value) {
      service.closest('.form-group').classList.add('error');
      isValid = false;
    }

    // Validate email if provided
    const email = form.querySelector('#email');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Form is valid — show success
    form.style.display = 'none';
    if (successEl) {
      successEl.classList.add('active');
    }

    // In production, replace this with actual form submission:
    // - Formspree: fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })
    // - Netlify: form will auto-submit with netlify attribute
    // - Custom API: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    console.log('Form submitted:', Object.fromEntries(new FormData(form)));
  });

  // Remove error state on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group')?.classList.remove('error');
    });
    input.addEventListener('change', () => {
      input.closest('.form-group')?.classList.remove('error');
    });
  });
});
