/* ============================================
   cms/home.js — Render index.html dynamic sections
   Sections: hero, service categories, before/after,
             stats, testimonials
   ============================================ */

import { client, esc, renderStars } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

// Lucide-based SVG icons (MIT) keyed by category slug
const CATEGORY_ICONS = {
  detailing:   `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
  protection:  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  wrapping:    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  performance: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  tech:        `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  maintenance: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
};

const HOME_QUERY = `{
  "page": *[_type == "homePage"][0]{
    metaTitle, metaDescription, heroBadge, heroTitle, heroTitleAccent,
    heroSubtitle, heroImageUrl, heroCta1Text, heroCta1Url,
    heroCta2Text, heroCta2Url,
    servicesSectionLabel, servicesSectionTitle, servicesSectionDesc
  },
  "categories": *[_type == "serviceCategory"] | order(order asc) {
    title, slug, tabLabel, cardDescription, icon, _id
  },
  "serviceCounts": *[_type == "service"] {
    category
  },
  "sliders": *[_type == "beforeAfterSlider" && placement == "home"] | order(order asc) {
    caption, beforeImageUrl, beforeAlt, afterImageUrl, afterAlt
  },
  "stats": *[_type == "stat"] | order(order asc) {
    value, suffix, label
  },
  "testimonials": *[_type == "testimonial"] | order(order asc) {
    reviewerName, initials, carMake, carModel, city, rating, quote
  }
}`;

export async function renderHome() {
  try {
    const { page, categories, serviceCounts, sliders, stats, testimonials } = await client.fetch(HOME_QUERY);

    // ---- Meta tags ----
    if (page?.metaTitle) document.title = page.metaTitle;
    if (page?.metaDescription) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', page.metaDescription);
    }

    // ---- Hero ----
    _renderHero(page);

    // ---- Service categories grid ----
    const catGrid = document.getElementById('serviceCategoriesGrid');
    if (catGrid && categories?.length) {
      // Count services per category
      const countMap = {};
      (serviceCounts || []).forEach(s => { countMap[s.category] = (countMap[s.category] || 0) + 1; });

      catGrid.innerHTML = categories.map(cat => {
        const slug = cat.slug?.current || cat.slug || '';
        const catIcon = CATEGORY_ICONS[slug] || CATEGORY_ICONS.maintenance;
        return `
        <a href="services.html#${esc(cat.slug?.current || cat.slug || '')}" class="card gsap-reveal" style="text-decoration:none;">
          <div class="card-icon" style="display:flex;align-items:center;justify-content:center;color:var(--accent);">${catIcon}</div>
          <h3 class="card-title">${esc(cat.title)}</h3>
          <p class="card-text">${esc(cat.cardDescription || '')}</p>
          <span style="color:var(--accent);font-size:0.85rem;font-weight:600;margin-top:1rem;display:inline-flex;align-items:center;gap:0.35rem;">
            ${countMap[cat.slug?.current || cat.slug] || 0} Services
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </a>`;
      }).join('');
      revealElements(catGrid);
    }

    // ---- Before/After sliders ----
    const slidersEl = document.getElementById('homeSliders');
    if (slidersEl && sliders?.length) {
      slidersEl.innerHTML = sliders.map((sl, i) => `
        <div class="ba-slider gsap-reveal" id="baSlider${i}">
          <img src="${esc(sl.beforeImageUrl || '')}" alt="${esc(sl.beforeAlt || 'Before')}" class="ba-before">
          <img src="${esc(sl.afterImageUrl || '')}" alt="${esc(sl.afterAlt || 'After')}" class="ba-after">
          <div class="ba-handle" id="baHandle${i}"></div>
          <span class="ba-label before">Before</span>
          <span class="ba-label after">After</span>
          ${sl.caption ? `<div class="ba-caption">${esc(sl.caption)}</div>` : ''}
        </div>
      `).join('');
      revealElements(slidersEl);
      // Re-init slider behavior after dynamic render
      import('../slider.js').then(m => m.initSliders?.());
    }

    // ---- Stats ----
    const statsEl = document.getElementById('statsGrid');
    if (statsEl && stats?.length) {
      statsEl.innerHTML = stats.map(st => `
        <div class="stat-item">
          <div class="stat-number" data-target="${esc(String(st.value))}">${st.value >= 1000 ? '0' : '0'}</div>
          <div class="stat-label">${esc(st.label)}</div>
        </div>
      `).join('');
      // Re-init counters after dynamic render
      import('../main.js').then(m => m.initCounters?.());
    }

    // ---- Testimonials ----
    const testimonialsEl = document.getElementById('testimonialsTrack');
    if (testimonialsEl && testimonials?.length) {
      testimonialsEl.innerHTML = testimonials.map(t => `
        <div class="testimonial-card gsap-reveal">
          <div class="testimonial-stars">${renderStars(t.rating || 5)}</div>
          <p class="testimonial-text">"${esc(t.quote)}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${esc(t.initials || t.reviewerName.split(' ').map(n => n[0]).join('')).toUpperCase()}</div>
            <div>
              <div class="testimonial-name">${esc(t.reviewerName)}</div>
              <div class="testimonial-car">${esc(t.carMake)} ${esc(t.carModel)} &bull; ${esc(t.city)}</div>
            </div>
          </div>
        </div>
      `).join('');
      revealElements(testimonialsEl);
    }

  } catch (err) {
    console.error('[CMS] Failed to load home page:', err);
  }
}

function _renderHero(page) {
  if (!page) return;
  const badge = document.getElementById('heroBadge');
  if (badge && page.heroBadge) badge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
    ${esc(page.heroBadge)}`;

  const title = document.getElementById('heroTitle');
  if (title && page.heroTitle) {
    title.innerHTML = `${esc(page.heroTitle)}<br><span class="accent">${esc(page.heroTitleAccent || '')}</span>`;
  }

  const sub = document.getElementById('heroSubtitle');
  if (sub && page.heroSubtitle) sub.textContent = page.heroSubtitle;

  const cta1 = document.getElementById('heroCta1');
  if (cta1 && page.heroCta1Text) {
    cta1.textContent = page.heroCta1Text;
    if (page.heroCta1Url) cta1.href = page.heroCta1Url;
  }

  const cta2 = document.getElementById('heroCta2');
  if (cta2 && page.heroCta2Text) {
    cta2.textContent = page.heroCta2Text;
    if (page.heroCta2Url) cta2.href = page.heroCta2Url;
  }

  if (page.heroImageUrl) {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${page.heroImageUrl}')`;
  }
}
