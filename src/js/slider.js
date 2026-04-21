/* ============================================
   slider.js — Before/After comparison (ES module)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle   = slider.querySelector('.ba-handle');
    const afterImg = slider.querySelector('.ba-after');
    if (!handle || !afterImg) return;

    let isDragging = false;

    function getX(e) {
      const rect = slider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return Math.max(0, Math.min(clientX - rect.left, rect.width));
    }

    function update(x) {
      const pct = (x / slider.getBoundingClientRect().width) * 100;
      handle.style.left = pct + '%';
      afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    }

    slider.addEventListener('mousedown',  e => { isDragging = true; e.preventDefault(); update(getX(e)); });
    window.addEventListener('mousemove',  e => { if (isDragging) { e.preventDefault(); update(getX(e)); } });
    window.addEventListener('mouseup',    ()  => { isDragging = false; });
    slider.addEventListener('touchstart', e => { isDragging = true; update(getX(e)); }, { passive: false });
    window.addEventListener('touchmove',  e => { if (isDragging) { e.preventDefault(); update(getX(e)); } }, { passive: false });
    window.addEventListener('touchend',   ()  => { isDragging = false; });

    // Init at 50%
    const rect = slider.getBoundingClientRect();
    update(rect.width / 2);
  });
});
