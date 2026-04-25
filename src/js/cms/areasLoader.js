/* ============================================
   cms/areasLoader.js — Render areas.html
   Sections: region columns (North/West/South/East)
   ============================================ */

import { client, esc } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

const AREAS_QUERY = `{
  "areas": *[_type == "serviceArea"] | order(order asc) {
    cityName, region, isHQ
  },
  "page": *[_type == "pageContent" && page == "areas"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle,
    areasMapEmbedUrl,
    ctaBannerHeading, ctaBannerSubtext, ctaBannerBtnText, ctaBannerBtnUrl,
    areasDooorstepLabel, areasDooorstepTitle, areasDooorstepSteps
  },
  "settings": *[_type == "siteSettings"][0]{
    phone, address, whatsappNumber
  },
  "hours": *[_type == "businessHours"] | order(order asc) {
    dayLabel, openTime, closeTime, isByAppointment
  }
}`;

const REGION_LABELS = {
  north: 'North India',
  west:  'West India',
  south: 'South India',
  east:  'East India',
};

export async function renderAreas() {
  try {
    const { areas, page, settings: s, hours } = await client.fetch(AREAS_QUERY);

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

    // ---- Map embed ----
    if (page?.areasMapEmbedUrl) {
      const mapEl = document.getElementById('areasMapEmbed');
      if (mapEl) mapEl.src = page.areasMapEmbedUrl;
    }

    // ---- HQ contact details ----
    if (s) {
      const addrEl = document.getElementById('hqAddress');
      if (addrEl && s.address) addrEl.textContent = s.address;

      const phoneEl = document.getElementById('hqPhone');
      if (phoneEl && s.phone) {
        phoneEl.textContent = s.phone;
        phoneEl.href = `tel:${s.phone.replace(/\s/g, '')}`;
      }
    }

    // ---- HQ working hours (compact single-line summary) ----
    const hoursEl = document.getElementById('hqHours');
    if (hoursEl && hours?.length) {
      hoursEl.textContent = hours
        .map(h => `${h.dayLabel}: ${h.isByAppointment ? 'By Appointment' : `${h.openTime} – ${h.closeTime}`}`)
        .join(' | ');
    }

    // ---- Areas by region ----
    const areasEl = document.getElementById('areasGrid');
    if (areasEl && areas?.length) {
      const byRegion = { north: [], west: [], south: [], east: [] };
      areas.forEach(a => { if (byRegion[a.region]) byRegion[a.region].push(a); });

      areasEl.innerHTML = Object.entries(byRegion)
        .filter(([, list]) => list.length > 0)
        .map(([region, list]) => `
          <div class="areas-column gsap-reveal">
            <h3 class="areas-region-title">${esc(REGION_LABELS[region] || region)}</h3>
            <ul class="areas-city-list">
              ${list.map(a => `
                <li class="area-city${a.isHQ ? ' hq' : ''}">
                  ${esc(a.cityName)}${a.isHQ ? ' <span class="hq-badge">HQ</span>' : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('');
      revealElements(areasEl);
    }

    // ---- Doorstep section heading ----
    const doorstepHeader = document.getElementById('doorstepSectionHeader');
    if (doorstepHeader && page) {
      if (page.areasDooorstepLabel) {
        const labelEl = doorstepHeader.querySelector('.section-label');
        if (labelEl) {
          // Preserve leading SVG icon, update only the text node
          const textNode = [...labelEl.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
          if (textNode) textNode.textContent = ' ' + page.areasDooorstepLabel;
        }
      }
      if (page.areasDooorstepTitle) {
        const titleEl = doorstepHeader.querySelector('.section-title');
        if (titleEl) titleEl.textContent = page.areasDooorstepTitle;
      }
    }

    // ---- Doorstep steps (CMS-driven if provided) ----
    const doorstepStepsEl = document.getElementById('doorstepSteps');
    if (doorstepStepsEl && page?.areasDooorstepSteps?.length) {
      doorstepStepsEl.innerHTML = page.areasDooorstepSteps.map((s, i) => `
        <div class="card gsap-reveal" style="text-align:center;position:relative;">
          <div style="position:absolute;top:1.5rem;right:1.5rem;width:36px;height:36px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem;color:#fff;">${i + 1}</div>
          <h3 class="card-title">${esc(s.title)}</h3>
          <p class="card-text">${esc(s.description || '')}</p>
        </div>
      `).join('');
      revealElements(doorstepStepsEl);
    }

    // ---- CTA Banner ----
    const ctaBanner = document.getElementById('areasCTABanner');
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
    console.error('[CMS] Failed to load areas page:', err);
  }
}
