/* ============================================
   form.js — Contact page tab system:
   - Hash-based routing (#quote / #feedback)
   - Sliding pill indicator (reuses .tab-indicator)
   - Mobile swipe gesture (60px threshold)
   - Contact form validation
   - Initialises feedback-form.js
   ============================================ */

import { initFeedbackForm } from './feedback-form.js';

const TABS = ['quote', 'feedback'];
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '/api/send-contact.php';

// ---- Indicator -------------------------------------------------------
function moveIndicator(activeBtn, indicator) {
  if (!activeBtn || !indicator) return;
  indicator.style.width  = `${activeBtn.offsetWidth}px`;
  indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

// ---- Tab activation --------------------------------------------------
function activateTab(tabId, { updateHash = true } = {}) {
  // Buttons
  document.querySelectorAll('#contactTabsNav .tab-btn[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Indicator
  const activeBtn  = document.querySelector(`#contactTabsNav .tab-btn[data-tab="${tabId}"]`);
  const indicator  = document.getElementById('contactTabIndicator');
  moveIndicator(activeBtn, indicator);

  // Panels
  document.querySelectorAll('.contact-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === tabId);
  });

  // Hash — use replaceState so Back button isn't spammed
  if (updateHash) {
    history.replaceState(null, '', `#${tabId}`);
  }

  // Scroll to top of panel on mobile
  if (window.innerWidth < 768) {
    document.getElementById('contactPanels')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- Swipe gesture ---------------------------------------------------
function initSwipe(container) {
  let startX = 0, startY = 0;

  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    // Ignore vertical scrolls and small movements
    if (Math.abs(dy) > 30 || Math.abs(dx) < 60) return;

    const currentTab = document.querySelector('#contactTabsNav .tab-btn.active[data-tab]')?.dataset.tab;
    const currentIdx = TABS.indexOf(currentTab);

    if (dx < 0 && currentIdx < TABS.length - 1) activateTab(TABS[currentIdx + 1]);
    if (dx > 0 && currentIdx > 0)               activateTab(TABS[currentIdx - 1]);
  }, { passive: true });
}

// ---- Contact form validation -----------------------------------------
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  const dateInput = form.querySelector('#date');
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots commonly fill hidden fields.
    if (form.querySelector('[name="website"]')?.value) return;

    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    _clearContactSubmitError(form);

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

    const submitBtn = form.querySelector('[type="submit"]');
    const originalHTML = submitBtn?.innerHTML || '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email?.value.trim() || '',
      city: city.value.trim(),
      service: service.value,
      car: form.querySelector('#car')?.value.trim() || '',
      date: form.querySelector('#date')?.value || '',
      budget: form.querySelector('#budget')?.value || '',
      message: form.querySelector('#message')?.value.trim() || '',
      website: form.querySelector('[name="website"]')?.value || '',
    };

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      const rawBody = await res.text();
      const json = contentType.includes('application/json')
        ? JSON.parse(rawBody || '{}')
        : null;

      const success = res.ok && (
        json?.ok === true
        || json?.success === true
        || (json?.status && String(json.status).toLowerCase() === 'ok')
      );

      if (!success) {
        if (res.ok && !json) {
          throw new Error(
            `Endpoint returned HTTP 200 but not JSON from ${CONTACT_API_URL}. Verify VITE_CONTACT_API_URL points to a live PHP endpoint.`
          );
        }

        throw new Error(json?.error || json?.message || `Request failed (${res.status})`);
      }

      form.style.display = 'none';
      successEl?.classList.add('active');
    } catch (err) {
      console.error('[Contact] Submit error:', err);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }

      _showContactSubmitError(
        form,
        'Could not send your inquiry right now. Please try again or reach us via WhatsApp/email.'
      );
    }
  });

  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    ['input', 'change'].forEach(ev =>
      input.addEventListener(ev, () => input.closest('.form-group')?.classList.remove('error'))
    );
  });
}

function _showContactSubmitError(form, message) {
  let errEl = form.querySelector('.contact-submit-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'contact-submit-error';
    errEl.style.cssText = 'color:var(--accent);font-size:0.875rem;margin-top:0.75rem;text-align:center;';
    form.querySelector('[type="submit"]')?.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = message;
}

function _clearContactSubmitError(form) {
  const errEl = form.querySelector('.contact-submit-error');
  if (errEl) errEl.textContent = '';
}

// ---- Boot ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Determine initial tab from URL hash
  const hash       = window.location.hash.replace('#', '');
  const initialTab = TABS.includes(hash) ? hash : 'quote';

  activateTab(initialTab, { updateHash: false });

  // Tab button clicks
  document.querySelectorAll('#contactTabsNav .tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Recalculate indicator on resize (e.g. orientation change)
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('#contactTabsNav .tab-btn.active[data-tab]');
    moveIndicator(activeBtn, document.getElementById('contactTabIndicator'));
  });

  // Swipe on panels container
  const panelsContainer = document.getElementById('contactPanels');
  if (panelsContainer) initSwipe(panelsContainer);

  // Forms
  initContactForm();
  initFeedbackForm();
});
