/* ============================================
   cms/galleryLoader.js — Render gallery.html
   Sections: filter buttons, gallery grid, sliders
   ============================================ */

import { client, esc } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

const GALLERY_QUERY = `{
  "items": *[_type == "galleryItem"] | order(order asc) {
    imageUrl, altText, overlayTitle, overlaySubtitle, category
  },
  "sliders": *[_type == "beforeAfterSlider" && placement == "gallery"] | order(order asc) {
    caption, beforeImageUrl, beforeAlt, afterImageUrl, afterAlt
  },
  "page": *[_type == "pageContent" && page == "gallery"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle
  }
}`;

const CATEGORY_LABELS = {
  detailing: 'Detailing',
  ceramic:   'Ceramic Coating',
  ppf:       'PPF',
  wrap:      'Wrapping',
  performance: 'Performance',
  interior:  'Interior',
};

export async function renderGallery() {
  try {
    const { items, sliders, page } = await client.fetch(GALLERY_QUERY);

    // ---- Meta / Hero ----
    if (page?.metaTitle) document.title = page.metaTitle;
    const hero = document.querySelector('.page-hero');
    if (hero && page) {
      const h1 = hero.querySelector('h1');
      const p = hero.querySelector('p');
      if (h1 && page.heroHeading)
        h1.innerHTML = `${esc(page.heroHeading)}${page.heroHeadingAccent ? ` <span class="text-accent">${esc(page.heroHeadingAccent)}</span>` : ''}`;
      if (p && page.heroSubtitle) p.textContent = page.heroSubtitle;
    }

    // ---- Filter buttons ----
    const filtersEl = document.getElementById('galleryFilters');
    if (filtersEl && items?.length) {
      const usedCats = [...new Set((items || []).map(i => i.category).filter(Boolean))];
      filtersEl.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        ${usedCats.map(cat => `<button class="filter-btn" data-filter="${esc(cat)}">${esc(CATEGORY_LABELS[cat] || cat)}</button>`).join('')}
      `;
    }

    // ---- Gallery grid ----
    const gridEl = document.getElementById('galleryGrid');
    if (gridEl && items?.length) {
      gridEl.innerHTML = items.map(item => `
        <div class="gallery-item" data-category="${esc(item.category || 'other')}">
          <img src="${esc(item.imageUrl || '')}" alt="${esc(item.altText || '')}" loading="lazy">
          <div class="overlay">
            <span class="overlay-text">
              ${esc(item.overlayTitle || '')}
              ${item.overlaySubtitle ? ` — ${esc(item.overlaySubtitle)}` : ''}
            </span>
          </div>
        </div>
      `).join('');

      // Re-init filter + lightbox behavior
      import('../gallery.js').then(m => m.initGallery?.());
    }

    // ---- Sliders ----
    const slidersEl = document.getElementById('gallerySliders');
    if (slidersEl && sliders?.length) {
      slidersEl.innerHTML = sliders.map((sl, i) => `
        <div class="ba-slider gsap-reveal" id="gbaSlider${i}">
          <img src="${esc(sl.beforeImageUrl || '')}" alt="${esc(sl.beforeAlt || 'Before')}" class="ba-before">
          <img src="${esc(sl.afterImageUrl || '')}" alt="${esc(sl.afterAlt || 'After')}" class="ba-after">
          <div class="ba-handle" id="gbaHandle${i}"></div>
          <span class="ba-label before">Before</span>
          <span class="ba-label after">After</span>
          ${sl.caption ? `<div class="ba-caption">${esc(sl.caption)}</div>` : ''}
        </div>
      `).join('');
      revealElements(slidersEl);
      import('../slider.js').then(m => m.initSliders?.());
    }

  } catch (err) {
    console.error('[CMS] Failed to load gallery page:', err);
  }
}
