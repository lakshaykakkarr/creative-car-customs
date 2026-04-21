/* ============================================
   cms/servicesLoader.js — Render services.html
   Sections: tabs, service cards, packages, FAQ
   ============================================ */

import { client, esc } from '../sanity.js';
import { revealElements } from '../gsap-utils.js';

const SERVICES_QUERY = `{
  "categories": *[_type == "serviceCategory"] | order(order asc) {
    title, slug, tabLabel, cardDescription
  },
  "services": *[_type == "service"] | order(order asc) {
    title, category, description, startingPrice, priceLabel, isFree, isPopular
  },
  "packages": *[_type == "servicePackage"] | order(order asc) {
    name, price, priceUnit, description, features, isFeatured
  },
  "faqs": *[_type == "faqItem"] | order(order asc) {
    question, answer
  },
  "page": *[_type == "pageContent" && page == "services"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle,
    servicesProcessSteps
  }
}`;

export async function renderServices() {
  try {
    const { categories, services, packages, faqs, page } = await client.fetch(SERVICES_QUERY);

    // ---- Meta / Hero ----
    if (page?.metaTitle) document.title = page.metaTitle;
    if (page?.metaDescription) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', page.metaDescription);
    }
    _renderPageHero(page);

    // ---- Tabs + Service cards ----
    _renderServiceTabs(categories, services);

    // ---- Packages ----
    const pkgGrid = document.getElementById('packagesGrid');
    if (pkgGrid && packages?.length) {
      pkgGrid.innerHTML = packages.map(pkg => `
        <div class="package-card gsap-reveal${pkg.isFeatured ? ' featured' : ''}">
          ${pkg.isFeatured ? '<div class="package-badge">Most Popular</div>' : ''}
          <h3 class="package-name">${esc(pkg.name)}</h3>
          <div class="package-price">
            ${pkg.price ? `<span class="price-amount">₹${esc(String(pkg.price))}</span>` : ''}
            ${pkg.priceUnit ? `<span class="price-unit">${esc(pkg.priceUnit)}</span>` : ''}
          </div>
          ${pkg.description ? `<p class="package-desc">${esc(pkg.description)}</p>` : ''}
          <ul class="package-features">
            ${(pkg.features || []).map(f => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>${esc(f)}</li>`).join('')}
          </ul>
          <a href="contact.html" class="btn${pkg.isFeatured ? ' btn-primary' : ' btn-outline'}" style="width:100%;justify-content:center;">Get Quote</a>
        </div>
      `).join('');
      revealElements(pkgGrid);
    }

    // ---- FAQ ----
    const faqEl = document.getElementById('faqList');
    if (faqEl && faqs?.length) {
      faqEl.innerHTML = faqs.map(f => `
        <div class="faq-item">
          <button class="faq-question">${esc(f.question)}
            <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="faq-answer"><p>${esc(f.answer)}</p></div>
        </div>
      `).join('');
      // Re-init FAQ accordion (main.js handles it)
      import('../main.js').then(m => m.initFaq?.());
    }

  } catch (err) {
    console.error('[CMS] Failed to load services page:', err);
  }
}

function _renderPageHero(page) {
  if (!page) return;
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const h1 = hero.querySelector('h1');
  const p = hero.querySelector('p');
  if (h1 && page.heroHeading) {
    h1.innerHTML = `${esc(page.heroHeading)}${page.heroHeadingAccent ? ` <span class="text-accent">${esc(page.heroHeadingAccent)}</span>` : ''}`;
  }
  if (p && page.heroSubtitle) p.textContent = page.heroSubtitle;
}

function _renderServiceTabs(categories, services) {
  const tabsNav = document.getElementById('serviceTabs');
  const contentsWrap = document.getElementById('serviceTabContents');
  if (!tabsNav || !contentsWrap || !categories?.length) return;

  // Build service lookup by category slug
  const byCategory = {};
  (services || []).forEach(s => {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(s);
  });

  // Render tab buttons
  tabsNav.innerHTML = categories.map((cat, i) => {
    const slug = cat.slug?.current || cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-');
    return `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${esc(slug)}">${esc(cat.tabLabel || cat.title)}</button>`;
  }).join('');

  // Add sliding indicator
  const indicator = document.createElement('div');
  indicator.className = 'tab-indicator';
  tabsNav.appendChild(indicator);

  // Render tab content panels
  contentsWrap.innerHTML = categories.map((cat, i) => {
    const slug = cat.slug?.current || cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-');
    const catServices = byCategory[slug] || byCategory[cat.slug?.current] || [];
    return `
      <div class="tab-content${i === 0 ? ' active' : ''}" id="${esc(slug)}">
        <div class="section-header" style="margin-bottom:2.5rem;">
          <h2 class="section-title" style="font-size:1.75rem;">${esc(cat.title)}</h2>
          ${cat.cardDescription ? `<p class="section-desc">${esc(cat.cardDescription)}</p>` : ''}
        </div>
        <div class="services-grid">
          ${catServices.map(s => _serviceCard(s)).join('')}
        </div>
      </div>`;
  }).join('');

  // Re-init tab logic
  import('../services.js').then(m => m.initTabs?.());
}

function _serviceCard(s) {
  const priceStr = s.isFree
    ? '<span style="color:var(--success,#22c55e);font-weight:700;">Free with package</span>'
    : s.startingPrice
      ? `Starting from ₹${Number(s.startingPrice).toLocaleString('en-IN')}`
      : s.priceLabel || '';

  return `
    <div class="service-card${s.isPopular ? ' popular' : ''}">
      ${s.isPopular ? '<div class="popular-badge">⭐ Popular</div>' : ''}
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.description || '')}</p>
      ${priceStr ? `<div class="price">${priceStr}</div>` : ''}
      <a href="contact.html" class="btn btn-sm btn-outline">Book Now</a>
    </div>`;
}
