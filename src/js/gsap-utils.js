/* ============================================
   gsap-utils.js — Helpers for post-CMS animation
   GSAP ScrollTrigger runs at page load before async
   CMS data arrives, so dynamically inserted elements
   need to be manually animated after injection.
   ============================================ */

import { gsap } from 'gsap';

/**
 * Reveal all .gsap-reveal children of a container.
 * Call this immediately after setting a container's innerHTML
 * with CMS-rendered content.
 * @param {Element} containerEl - The parent element whose children need revealing.
 */
export function revealElements(containerEl) {
  if (!containerEl) return;
  const items = containerEl.querySelectorAll('.gsap-reveal');
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.045 }
  );
}
