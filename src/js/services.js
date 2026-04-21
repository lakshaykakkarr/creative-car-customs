/* ============================================
   services.js — Category tab switching (ES module)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => initTabs());

export function initTabs() {

  const tabsNav     = document.getElementById('serviceTabs');
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabsNav || tabBtns.length === 0) return;

  // Sliding indicator
  const indicator = document.createElement('div');
  indicator.className = 'tab-indicator';
  tabsNav.appendChild(indicator);

  function moveIndicator(btn, animate) {
    const navRect  = tabsNav.getBoundingClientRect();
    const btnRect  = btn.getBoundingClientRect();
    const offsetLeft = btnRect.left - navRect.left + tabsNav.scrollLeft;
    if (!animate) indicator.style.transition = 'none';
    else indicator.style.transition = '';
    indicator.style.width     = btnRect.width + 'px';
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    if (!animate) { indicator.offsetHeight; indicator.style.transition = ''; }
  }

  const initialActive = tabsNav.querySelector('.tab-btn.active');
  if (initialActive) moveIndicator(initialActive, false);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moveIndicator(btn, true);
      tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  tabsNav.addEventListener('scroll', () => {
    const active = tabsNav.querySelector('.tab-btn.active');
    if (active) moveIndicator(active, false);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = tabsNav.querySelector('.tab-btn.active');
      if (active) moveIndicator(active, false);
    }, 100);
  });

  function activateFromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const targetBtn = tabsNav.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (targetBtn) {
      targetBtn.click();
      setTimeout(() => tabsNav.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }
  activateFromHash();
  window.addEventListener('hashchange', activateFromHash);
}
