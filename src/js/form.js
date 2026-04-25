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

  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    ['input', 'change'].forEach(ev =>
      input.addEventListener(ev, () => input.closest('.form-group')?.classList.remove('error'))
    );
  });
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
