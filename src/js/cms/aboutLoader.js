/* ============================================
   cms/aboutLoader.js — Render about.html
   Sections: story, team, stats, mission/vision
   ============================================ */

import { client, esc } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

const ABOUT_QUERY = `{
  "page": *[_type == "pageContent" && page == "about"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle,
    storyLabel, storyTitle, storyBody,
    missionText, visionText,
    ctaBannerHeading, ctaBannerSubtext, ctaBannerBtnText, ctaBannerBtnUrl
  },
  "team": *[_type == "teamMember"] | order(order asc) {
    name, initials, role, bio
  },
  "stats": *[_type == "stat"] | order(order asc) {
    value, suffix, label
  }
}`;

export async function renderAbout() {
  try {
    const { page, team, stats } = await client.fetch(ABOUT_QUERY);

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
    if (storyTitle && page?.storyTitle) storyTitle.textContent = page.storyTitle;

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

    // ---- Team ----
    const teamEl = document.getElementById('teamGrid');
    if (teamEl && team?.length) {
      teamEl.innerHTML = team.map(m => `
        <div class="card gsap-reveal" style="text-align:center;">
          <div class="team-avatar" style="width:72px;height:72px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;margin:0 auto 1rem;">${esc(m.initials || m.name.split(' ').map(n => n[0]).join(''))}</div>
          <h3 class="card-title">${esc(m.name)}</h3>
          <p style="color:var(--accent);font-size:0.875rem;font-weight:600;margin-bottom:0.75rem;">${esc(m.role)}</p>
          <p class="card-text">${esc(m.bio || '')}</p>
        </div>
      `).join('');
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
      if (btn && page.ctaBannerBtnText) {
        btn.textContent = page.ctaBannerBtnText;
        if (page.ctaBannerBtnUrl) btn.href = page.ctaBannerBtnUrl;
      }
    }

  } catch (err) {
    console.error('[CMS] Failed to load about page:', err);
  }
}
