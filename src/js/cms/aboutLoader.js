/* ============================================
   cms/aboutLoader.js — Render about.html
   Sections: story, team, stats, mission/vision,
             why choose us
   ============================================ */

import { client, esc } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

// Lucide SVG paths keyed by icon name (used for whyChooseUs cards)
const WHY_ICONS = {
  shield:       `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  award:        `<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>`,
  clock:        `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  star:         `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  users:        `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  'map-pin':    `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>`,
  layers:       `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
  gift:         `<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`,
  wrench:       `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  'check-circle': `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
  zap:          `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
};

const ABOUT_QUERY = `{
  "page": *[_type == "pageContent" && page == "about"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle,
    storyLabel, storyTitle, storyTitleAccent, storyBody, storyImageUrl,
    missionText, visionText,
    ctaBannerHeading, ctaBannerSubtext, ctaBannerBtnText, ctaBannerBtnUrl
  },
  "team": *[_type == "teamMember"] | order(order asc) {
    name, initials, role, bio, "photoUrl": photo.asset->url
  },
  "stats": *[_type == "stat"] | order(order asc) {
    value, suffix, label
  },
  "whyItems": *[_type == "whyChooseUs"] | order(order asc) {
    icon, title, description
  }
}`;

export async function renderAbout() {
  try {
    const { page, team, stats, whyItems } = await client.fetch(ABOUT_QUERY);

    // ---- Meta / Hero ----
    if (page?.metaTitle) document.title = page.metaTitle;
    if (page?.metaDescription) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', page.metaDescription);
    }
    const hero = document.querySelector('.page-hero');
    if (hero && page) {
      const h1 = hero.querySelector('h1');
      const p = hero.querySelector('p');
      if (h1 && page.heroHeading)
        h1.innerHTML = `${esc(page.heroHeading)}${page.heroHeadingAccent ? ` <span class="text-accent">${esc(page.heroHeadingAccent)}</span>` : ''}`;
      if (p && page.heroSubtitle) p.textContent = page.heroSubtitle;
    }

    // ---- Story section ----
    const storyLabel = document.getElementById('storyLabel');
    if (storyLabel && page?.storyLabel) storyLabel.textContent = page.storyLabel;

    const storyTitle = document.getElementById('storyTitle');
    if (storyTitle && page?.storyTitle) {
      storyTitle.innerHTML = `${esc(page.storyTitle)}${page.storyTitleAccent ? ` <span class="text-accent">${esc(page.storyTitleAccent)}</span>` : ''}`;
    }

    // ---- Story image ----
    const storyImg = document.getElementById('storyImage');
    if (storyImg && page?.storyImageUrl) {
      storyImg.src = page.storyImageUrl;
    }

    const storyBody = document.getElementById('storyBody');
    if (storyBody && page?.storyBody) {
      // storyBody is block content; render as paragraphs (simplified)
      if (Array.isArray(page.storyBody)) {
        storyBody.innerHTML = page.storyBody
          .filter(b => b._type === 'block')
          .map(b => `<p>${esc((b.children || []).map(c => c.text || '').join(''))}</p>`)
          .join('');
      } else {
        storyBody.textContent = page.storyBody;
      }
    }

    // ---- Mission / Vision ----
    const missionEl = document.getElementById('missionText');
    if (missionEl && page?.missionText) missionEl.textContent = page.missionText;
    const visionEl = document.getElementById('visionText');
    if (visionEl && page?.visionText) visionEl.textContent = page.visionText;

    // ---- Stats ----
    const statsEl = document.getElementById('statsGrid');
    if (statsEl && stats?.length) {
      statsEl.innerHTML = stats.map(st => `
        <div class="stat-item">
          <div class="stat-number" data-target="${esc(String(st.value))}">${st.value >= 1000 ? '0' : '0'}</div>
          <div class="stat-label">${esc(st.label)}</div>
        </div>
      `).join('');
      import('../main.js').then(m => m.initCounters?.());
    }

    // ---- Why Choose Us ----
    const whyGrid = document.getElementById('whyChooseUsGrid');
    if (whyGrid && whyItems?.length) {
      whyGrid.innerHTML = whyItems.map(w => {
        const svgPath = WHY_ICONS[w.icon] || WHY_ICONS.star;
        return `
        <div class="card gsap-reveal" style="text-align:center;">
          <div class="card-icon" style="margin:0 auto 1.25rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>
          </div>
          <h3 class="card-title">${esc(w.title)}</h3>
          <p class="card-text">${esc(w.description || '')}</p>
        </div>`;
      }).join('');
      revealElements(whyGrid);
    }

    // ---- Team ----
    const teamEl = document.getElementById('teamGrid');
    const validTeam = (team || []).filter(m => m.name);
    if (teamEl && validTeam.length) {
      teamEl.innerHTML = validTeam.map(m => {
        const initials = esc(m.initials || m.name.split(' ').map(n => n[0]).join('').toUpperCase());
        const avatarHtml = m.photoUrl
          ? `<img src="${esc(m.photoUrl)}" alt="${esc(m.name)}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin:0 auto 1.25rem;display:block;">`
          : `<div class="team-avatar" style="width:100px;height:100px;border-radius:50%;background:var(--bg-elevated);border:2px solid var(--border-accent);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;margin:0 auto 1.25rem;">${initials}</div>`;
        return `
        <div class="card gsap-reveal" style="text-align:center;">
          ${avatarHtml}
          <h3 class="card-title">${esc(m.name)}</h3>
          <p style="color:var(--accent);font-size:0.875rem;font-weight:600;margin-bottom:0.75rem;">${esc(m.role || '')}</p>
          <p class="card-text">${esc(m.bio || '')}</p>
        </div>`;
      }).join('');
      revealElements(teamEl);
    }

    // ---- CTA Banner ----
    const ctaBanner = document.querySelector('.about-cta-banner');
    if (ctaBanner && page) {
      const h2 = ctaBanner.querySelector('h2');
      const p = ctaBanner.querySelector('p');
      const btn = ctaBanner.querySelector('.btn');
      if (h2 && page.ctaBannerHeading) h2.textContent = page.ctaBannerHeading;
      if (p && page.ctaBannerSubtext) p.textContent = page.ctaBannerSubtext;
      if (btn) {
        if (page.ctaBannerBtnText) btn.childNodes[0].textContent = page.ctaBannerBtnText + '\n          ';
        if (page.ctaBannerBtnUrl) btn.href = page.ctaBannerBtnUrl;
      }
    }

  } catch (err) {
    console.error('[CMS] Failed to load about page:', err);
  }
}
