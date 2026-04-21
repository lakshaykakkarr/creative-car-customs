/* ============================================
   cms/contactLoader.js — Render contact.html
   Sections: business hours, success message
   ============================================ */

import { client, esc } from '../sanity.js';

const CONTACT_QUERY = `{
  "page": *[_type == "pageContent" && page == "contact"][0]{
    metaTitle, metaDescription, heroHeading, heroHeadingAccent, heroSubtitle,
    contactSuccessMessage
  },
  "hours": *[_type == "businessHours"] | order(order asc) {
    dayLabel, openTime, closeTime, isByAppointment
  },
  "settings": *[_type == "siteSettings"][0]{
    phone, email, address, whatsappNumber, whatsappMessage
  }
}`;

export async function renderContact() {
  try {
    const { page, hours, settings: s } = await client.fetch(CONTACT_QUERY);

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

    // ---- Contact details ----
    if (s) {
      // Phone: update text + outer anchor href
      const phoneEl = document.getElementById('contactPhone');
      if (phoneEl && s.phone) {
        phoneEl.textContent = s.phone;
        const phoneAnchor = document.getElementById('contactPhoneCard');
        if (phoneAnchor) phoneAnchor.href = `tel:${s.phone.replace(/\s/g, '')}`;
      }
      // Email: update text + outer anchor href
      const emailEl = document.getElementById('contactEmail');
      if (emailEl && s.email) {
        emailEl.textContent = s.email;
        const emailAnchor = document.getElementById('contactEmailCard');
        if (emailAnchor) emailAnchor.href = `mailto:${s.email}`;
      }
      // Address: update text
      const addrEl = document.getElementById('contactAddress');
      if (addrEl && s.address) addrEl.textContent = s.address;

      // WhatsApp link in contact page
      if (s.whatsappNumber) {
        const waLink = document.getElementById('contactWhatsapp');
        if (waLink) {
          const msg = encodeURIComponent(s.whatsappMessage || "Hi CCC! I'd like to book a service.");
          waLink.href = `https://wa.me/${s.whatsappNumber.replace(/\D/g, '')}?text=${msg}`;
        }
      }
    }

    // ---- Business hours ----
    const hoursEl = document.getElementById('businessHoursContact');
    if (hoursEl && hours?.length) {
      hoursEl.innerHTML = hours.map(h => `
        <div class="hours-row">
          <span class="hours-day">${esc(h.dayLabel)}</span>
          <span class="hours-time">${h.isByAppointment ? 'By Appointment' : `${esc(h.openTime)} – ${esc(h.closeTime)}`}</span>
        </div>
      `).join('');
    }

    // ---- Success message ----
    if (page?.contactSuccessMessage) {
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        const successMsg = successEl.querySelector('p, .success-text');
        if (successMsg) successMsg.textContent = page.contactSuccessMessage;
      }
    }

  } catch (err) {
    console.error('[CMS] Failed to load contact page:', err);
  }
}
