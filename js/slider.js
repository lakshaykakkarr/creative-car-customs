/* ============================================
   slider.js — Before/After comparison slider
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.ba-slider');
  
  sliders.forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const afterImg = slider.querySelector('.ba-after');
    
    if (!handle || !afterImg) return;

    let isDragging = false;

    function getPosition(e) {
      const rect = slider.getBoundingClientRect();
      let x;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
      } else {
        x = e.clientX - rect.left;
      }
      return Math.max(0, Math.min(x, rect.width));
    }

    function updateSlider(x) {
      const rect = slider.getBoundingClientRect();
      const percent = (x / rect.width) * 100;
      handle.style.left = percent + '%';
      afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    function onStart(e) {
      isDragging = true;
      e.preventDefault();
      updateSlider(getPosition(e));
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      updateSlider(getPosition(e));
    }

    function onEnd() {
      isDragging = false;
    }

    // Mouse events
    slider.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Touch events
    slider.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    // Initialize at 50%
    const rect = slider.getBoundingClientRect();
    updateSlider(rect.width / 2);
  });
});
