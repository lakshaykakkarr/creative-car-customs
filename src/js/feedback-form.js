/* ============================================
   feedback-form.js — Customer feedback form:
   star rating, validation, Formspree submit.

   Architecture (no browser→Sanity on submit):
   1. Validate + submit to Formspree
   2. Admin email contains Approve / Discard URLs
      with all review data encoded in params
   3. approve.html reads params, writes to Sanity
      only after admin clicks Confirm
   ============================================ */

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export function initFeedbackForm() {
  const form      = document.getElementById('feedbackForm');
  const successEl = document.getElementById('feedbackSuccess');
  if (!form) return;

  // ---- Star rating ----
  const starsContainer = document.getElementById('ratingStars');
  const stars          = starsContainer ? [...starsContainer.querySelectorAll('.star')] : [];
  const ratingInput    = document.getElementById('fb-rating');
  const ratingError    = document.getElementById('ratingError');
  let selectedRating   = 0;

  function setRating(value) {
    selectedRating = value;
    if (ratingInput) ratingInput.value = String(value);
    stars.forEach(star => {
      const v = parseInt(star.dataset.value, 10);
      star.classList.toggle('active', v <= value);
    });
    if (ratingError) ratingError.style.display = 'none';
  }

  stars.forEach(star => {
    star.addEventListener('click', () => setRating(parseInt(star.dataset.value, 10)));

    star.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(star.dataset.value, 10);
      stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value, 10) <= hoverVal));
    });

    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setRating(parseInt(star.dataset.value, 10));
      }
    });
  });

  starsContainer?.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hover'));
  });

  // ---- Clear errors on change ----
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    ['input', 'change'].forEach(ev =>
      input.addEventListener(ev, () => input.closest('.form-group')?.classList.remove('error'))
    );
  });

  // ---- Submit ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots fill the hidden _gotcha field
    if (form.querySelector('[name="_gotcha"]')?.value) return;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    if (ratingError) ratingError.style.display = 'none';

    let valid = true;
    const name    = form.querySelector('#fb-name');
    const city    = form.querySelector('#fb-city');
    const service = form.querySelector('#fb-service');
    const comment = form.querySelector('#fb-comment');
    const email   = form.querySelector('#fb-email');
    const phone   = form.querySelector('#fb-phone');

    if (!name?.value.trim())    { name.closest('.form-group').classList.add('error');    valid = false; }
    if (!city?.value.trim())    { city.closest('.form-group').classList.add('error');    valid = false; }
    if (!service?.value)        { service.closest('.form-group').classList.add('error'); valid = false; }
    if (selectedRating < 1)    { if (ratingError) ratingError.style.display = 'block';  valid = false; }
    if (!comment?.value.trim() || comment.value.trim().length < 20) {
      comment.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (email?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.closest('.form-group').classList.add('error');
      valid = false;
    }
    if (phone?.value.trim() && !/^[\+]?[0-9\s\-]{8,15}$/.test(phone.value.trim())) {
      phone.closest('.form-group').classList.add('error');
      valid = false;
    }

    if (!valid) {
      (form.querySelector('.form-group.error') || ratingError)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn    = form.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const carMake  = form.querySelector('#fb-car-make')?.value.trim() || '';
    const carModel = form.querySelector('#fb-car-model')?.value.trim() || '';
    const carLabel = [carMake, carModel].filter(Boolean).join(' ') || 'Not specified';
    const starStr  = '\u2605'.repeat(selectedRating) + '\u2606'.repeat(5 - selectedRating);

    // Build approve / discard URLs — all review data encoded in params.
    // approve.html reads these and creates the Sanity doc on admin confirm,
    // avoiding any need for browser→Sanity writes from the public form.
    const reviewParams = new URLSearchParams({
      name:     name.value.trim(),
      city:     city.value.trim(),
      service:  service.value,
      rating:   String(selectedRating),
      comment:  comment.value.trim(),
      carMake,
      carModel,
      ...(email?.value.trim() && { email: email.value.trim() }),
      ...(phone?.value.trim() && { phone: phone.value.trim() }),
    });
    const approveUrl = `${SITE_URL}/approve.html?action=approve&${reviewParams}`;
    const discardUrl = `${SITE_URL}/approve.html?action=discard&${reviewParams}`;

    try {
      const fd = new FormData();
      fd.append('_subject', `[CCC Feedback] New ${selectedRating}-star review from ${name.value.trim()}`);
      fd.append('Reviewer Name',    name.value.trim());
      fd.append('City',             city.value.trim());
      fd.append('Rating',           `${selectedRating}/5  ${starStr}`);
      fd.append('Service Received', service.value);
      fd.append('Car',              carLabel);
      fd.append('Review',           comment.value.trim());
      if (email?.value.trim()) fd.append('Customer Email', email.value.trim());
      if (phone?.value.trim()) fd.append('Customer Phone', phone.value.trim());
      fd.append('--- APPROVE',  approveUrl);
      fd.append('--- DISCARD',  discardUrl);

      const endpoint = form.action || 'https://formspree.io/f/mkokeokv';
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    fd,
      });

      const json = await res.json().catch(() => null);
      console.log('[Feedback] Formspree response', res.status, json);

      if (!res.ok) throw new Error(`Formspree ${res.status}: ${json?.error || JSON.stringify(json)}`);

      form.style.display = 'none';
      successEl?.classList.add('active');

    } catch (err) {
      console.error('[Feedback] Submit error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      _showSubmitError(form, 'Could not send your feedback. Please try again or reach us on WhatsApp.');
    }
  });
}

function _showSubmitError(form, message) {
  let errEl = form.querySelector('.feedback-submit-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'feedback-submit-error';
    errEl.style.cssText = 'color:var(--accent);font-size:0.875rem;margin-top:0.75rem;text-align:center;';
    form.querySelector('[type="submit"]')?.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = message;
}


