/* ============================================
   services.js — Category tab switching
   with liquid glass sliding indicator
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const tabsNav = document.getElementById('serviceTabs');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabsNav || tabBtns.length === 0) return;

  // --- Create sliding indicator element ---
  const indicator = document.createElement('div');
  indicator.classList.add('tab-indicator');
  tabsNav.appendChild(indicator);

  // --- Position indicator behind active button ---
  function moveIndicator(btn, animate) {
    const navRect = tabsNav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const scrollLeft = tabsNav.scrollLeft;
    const offsetLeft = btnRect.left - navRect.left + scrollLeft;

    if (!animate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = '';
    }

    indicator.style.width = btnRect.width + 'px';
    indicator.style.transform = 'translateX(' + offsetLeft + 'px)';

    if (!animate) {
      // Force reflow then restore transition
      indicator.offsetHeight;
      indicator.style.transition = '';
    }
  }

  // --- Init indicator on first active button ---
  const initialActive = tabsNav.querySelector('.tab-btn.active');
  if (initialActive) {
    moveIndicator(initialActive, false);
  }

  // --- Tab click handler ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      // Update active button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Slide indicator
      moveIndicator(btn, true);

      // Show target tab, hide others
      tabContents.forEach(content => {
        if (content.id === tabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Scroll tab button into view (mobile)
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // --- Recalculate on scroll (horizontal tab scroll) ---
  tabsNav.addEventListener('scroll', () => {
    const active = tabsNav.querySelector('.tab-btn.active');
    if (active) moveIndicator(active, false);
  }, { passive: true });

  // --- Recalculate on resize ---
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = tabsNav.querySelector('.tab-btn.active');
      if (active) moveIndicator(active, false);
    }, 100);
  });

  // --- Handle hash in URL (e.g., services.html#protection) ---
  function activateFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector('.tab-btn[data-tab="' + hash + '"]');
      if (targetBtn) {
        targetBtn.click();
        setTimeout(() => {
          tabsNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  activateFromHash();
  window.addEventListener('hashchange', activateFromHash);
});
