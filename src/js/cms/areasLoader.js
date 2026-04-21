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
    areasMapEmbedUrl
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
    const { areas, page } = await client.fetch(AREAS_QUERY);

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

  } catch (err) {
    console.error('[CMS] Failed to load areas page:', err);
  }
}
