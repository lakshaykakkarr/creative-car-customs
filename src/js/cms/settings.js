/* ============================================
   cms/settings.js — Apply siteSettings + businessHours
   Runs on every page to update footer, WhatsApp button, etc.
   ============================================ */

import { client, esc } from '../sanity.js';

const SETTINGS_QUERY = `{
  "settings": *[_type == "siteSettings"][0]{
    brandName, tagline, footerBlurb, phone, whatsappNumber,
    whatsappMessage, email, address, foundedYear, copyrightYear,
    socialLinks, "logoUrl": logo.asset->url
  },
  "hours": *[_type == "businessHours"] | order(order asc) {
    dayLabel, openTime, closeTime, isByAppointment
  }
}`;

export async function applySettings() {
  try {
    const { settings: s, hours } = await client.fetch(SETTINGS_QUERY);
    if (!s) return;

    // ---- Meta tags ----
    // (individual page loaders set page-specific meta; settings sets phone/address in footer)

    // ---- WhatsApp floating button ----
    const waBtn = document.querySelector('.whatsapp-float');
    if (waBtn && s.whatsappNumber) {
      const msg = encodeURIComponent(s.whatsappMessage || "Hi CCC! I'd like to know more about your services.");
      waBtn.href = `https://wa.me/${s.whatsappNumber.replace(/\D/g, '')}?text=${msg}`;
    }

    // ---- Nav logo image ----
    if (s.logoUrl) {
      document.querySelectorAll('.nav-logo svg').forEach(svg => {
        const img = document.createElement('img');
        img.src = s.logoUrl;
        img.alt = s.brandName || 'Logo';
        img.style.cssText = 'height:40px;width:auto;display:block;';
        svg.replaceWith(img);
      });
    }

    // ---- Footer brand blurb ----
    const footerBlurb = document.querySelector('.footer-brand > p');
    if (footerBlurb && s.footerBlurb) footerBlurb.textContent = s.footerBlurb;

    // ---- Footer contact column ----
    const footerContactList = document.querySelector('.footer-contact-list');
    if (footerContactList) {
      footerContactList.innerHTML = `
        ${s.phone ? `<li><a href="tel:${esc(s.phone.replace(/\s/g,''))}">${esc(s.phone)}</a></li>` : ''}
        ${s.email ? `<li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>` : ''}
        ${s.address ? `<li>${esc(s.address)}</li>` : ''}
      `;
    }

    // ---- Footer social links ----
    const footerSocial = document.querySelector('.footer-social');
    if (footerSocial && s.socialLinks) {
      const links = s.socialLinks;
      const sns = [
        { key: 'instagram', label: 'Instagram', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` },
        { key: 'youtube', label: 'YouTube', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>` },
        { key: 'facebook', label: 'Facebook', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
        { key: 'whatsapp', label: 'WhatsApp', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>` },
      ];
      const rendered = sns
        .filter(sn => links[sn.key])
        .map(sn => `<a href="${esc(links[sn.key])}" aria-label="${sn.label}" target="_blank" rel="noopener noreferrer">${sn.icon}</a>`)
        .join('');
      if (rendered) footerSocial.innerHTML = rendered;
    }

    // ---- Footer copyright year ----
    const footerYear = document.querySelector('.footer-year');
    if (footerYear && s.copyrightYear) footerYear.textContent = s.copyrightYear;

    // ---- Business hours (on any page with #businessHours) ----
    const hoursEl = document.getElementById('businessHours');
    if (hoursEl && hours?.length) {
      hoursEl.innerHTML = hours.map(h => `
        <div class="hours-row">
          <span class="hours-day">${esc(h.dayLabel)}</span>
          <span class="hours-time">${h.isByAppointment ? 'By Appointment' : `${esc(h.openTime)} – ${esc(h.closeTime)}`}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('[CMS] Failed to load settings:', err);
  }
}
