# Creative Car Customs (CCC) — Premium Car Detailing Website

A fully static, premium website for **Creative Car Customs** — a car detailing and customization shop headquartered in Delhi NCR with pan-India doorstep service.

**Live preview:** Run `python -m http.server 3000` from the project root and open `http://localhost:3000`

---

## Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Markup** | HTML5 | 6 static pages, semantic structure, `data-theme` attribute for theming |
| **Styling** | Tailwind CSS v3 (CDN) + Custom CSS | Utility-first via `cdn.tailwindcss.com` + ~2000-line custom design system |
| **Animations** | GSAP 3.12.5 + ScrollTrigger (CDN) | Scroll-triggered reveals, parallax, counters |
| **Typography** | Inter (Google Fonts) | Weights 400–900, tight tracking |
| **JavaScript** | Vanilla JS (ES6+) | No framework, 5 modular JS files |
| **Icons** | Inline SVGs | No icon library dependency |
| **Backend** | PHP + PHPMailer (optional deployment) | Contact form submits to server-side SMTP endpoint on Hostinger |

### CDN Dependencies (loaded in `<head>` or before `</body>`)

```
https://cdn.tailwindcss.com                              — Tailwind CSS v3
https://fonts.googleapis.com/css2?family=Inter           — Inter font
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js        — GSAP core
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js — ScrollTrigger plugin
```

---

## Project Structure

```
creative-car-customs/
├── index.html              # Home page (hero, services preview, stats, testimonials, CTA)
├── about.html              # About page (brand story, mission/vision, USPs, team)
├── services.html           # Services page (6 tabbed categories, 37 services, 3 packages, FAQ)
├── gallery.html            # Gallery page (filterable grid, before/after sliders, lightbox)
├── areas.html              # Service areas (Delhi NCR HQ, 4 regional cards, doorstep info)
├── contact.html            # Contact page (form, info cards, map embed)
├── api/
│   ├── send-contact.php    # Hostinger SMTP endpoint (server-side only)
│   ├── config.php.example  # SMTP config template (copy to config.php on server)
│   └── composer.json       # PHPMailer dependency
├── css/
│   └── style.css           # Complete design system (~2000 lines)
├── js/
│   ├── main.js             # Theme toggle, navbar, mobile menu, GSAP animations, counters, FAQ
│   ├── services.js         # Tab switching with sliding indicator animation
│   ├── slider.js           # Before/after comparison slider (clip-path based)
│   ├── gallery.js          # Gallery filtering + lightbox
│   └── form.js             # Contact form client-side validation
├── assets/
│   └── logo.svg            # Placeholder SVG logo (circle + "CCC" text)
└── README.md               # This file
```

---

## Pages Overview

### `index.html` — Home
- Hero section with Unsplash background, gradient overlay, tagline, 2 CTA buttons
- 6-category service preview grid (cards link to services page)
- Before/after comparison slider
- Stats counters: 15,000 cars | 50 cities | 8 years | 12,000 customers
- 5 testimonial cards with star ratings (SVG stars)
- CTA banner, full footer

### `about.html` — About Us
- Page hero with blur glow effect
- Brand story narrative section
- Mission & Vision two-column layout
- 6 USP cards (glass cards)
- 3 team member cards
- CTA, footer

### `services.html` — Services
- **6 tabbed categories** with sliding pill indicator animation:
  1. Detailing & Cleaning (8 services)
  2. Paint & Protection (7 services)
  3. Wrapping & Aesthetics (6 services)
  4. Performance (6 services)
  5. Tech & Accessories (5 services)
  6. Maintenance (5 services)
- **37 total service cards** across all categories
- **3 pricing packages:**
  - Essential — ₹4,999/session
  - Premium — ₹18,999/session (featured)
  - Ultimate — ₹49,999/session
- 5-step process timeline
- 8 FAQ accordion items
- Hash-based navigation (e.g., `services.html#protection`)

### `gallery.html` — Gallery
- 7 filter buttons (All, Detailing, Protection, Wrapping, Performance, etc.)
- 12 gallery items with hover overlays
- 2 before/after comparison sliders
- Full lightbox with keyboard (Escape) support

### `areas.html` — Service Areas
- Delhi NCR headquarters section
- 4 regional service area cards (North, South, East, West India)
- Doorstep service explainer

### `contact.html` — Contact
- Contact form (name, email, phone, service dropdown, date, message)
- Client-side validation with error states and success message
- Sends to server-side `/api/send-contact.php` endpoint (no SMTP credentials in browser)
- Minimum date enforcement (today's date)
- Info cards (phone, email, address)
- Embedded map placeholder

---

## Design System (`css/style.css`)

### Theme Architecture
- **Dark mode** (default): `<html data-theme="dark">`
- **Light mode**: `<html data-theme="light">`
- Toggle saved to `localStorage` key `ccc-theme`
- Smooth CSS transitions between themes on all elements

### CSS Custom Properties (Dark / Light)

| Token | Dark | Light |
|-------|------|-------|
| `--bg-primary` | `#050507` | `#f8f8fa` |
| `--bg-glass` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.45)` |
| `--accent` | `#e11d48` (rose-600) | `#e11d48` |
| `--accent-hover` | `#be123c` | `#be123c` |
| `--text-primary` | `#f5f5f5` | `#0f0f12` |
| `--text-secondary` | `#a3a3a3` | `#52525b` |
| `--border-glass` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.08)` |
| `--glass-blur` | `blur(20px) saturate(1.8)` | `blur(20px) saturate(1.6)` |

### Liquid Glass Design (Glassmorphism)
Every major component uses the "liquid glass" pattern:
- `background: var(--bg-glass)` (translucent)
- `backdrop-filter: var(--glass-blur)` + `-webkit-backdrop-filter`
- `border: 1px solid var(--border-glass)`
- `box-shadow: var(--shadow-glass)`
- `::before` pseudo-element for top-half glossy highlight (iPhone-style)

Applied to: navbar, buttons, cards, tabs, form inputs, testimonials, packages, footer, WhatsApp button.

### Button System (iPhone Liquid Glass Style)
All buttons use `border-radius: 50px` (pill shape) with:
- `.btn-primary` — Accent gradient fill + glossy `::before` highlight
- `.btn-outline` — Glass gradient + subtle shine
- `.nav-cta` — Accent glass pill (excluded from generic nav link styles via `:not(.nav-cta)`)
- `.filter-btn` — Glass with accent gradient on active
- `.tab-btn` — Transparent when active (sliding indicator provides visual)
- `.cta-banner .btn` — White glass pill on accent background
- `.theme-toggle` — Pill glass with `::before` shine

### Typography Utilities
- `.text-gradient` — White-to-gray gradient text
- `.text-gradient-accent` — Accent gradient text
- `.text-shimmer` — Animated shimmer effect via `@keyframes shimmer`
- Default tracking: `--tracking-tight: -0.04em` for headings, `--tracking-normal: -0.01em` for body

### Key CSS Sections (in order)
1. CSS Custom Properties (dark + light)
2. Reset & Base styles
3. Custom Scrollbar
4. Typography (gradient text, shimmer)
5. Navbar (glass, scroll effect `.scrolled`)
6. Theme Toggle
7. Hero section
8. Buttons (all liquid glass variants)
9. Section styles (`.section-label` with `::before` decorative line)
10. Cards (glass with `::before` top highlight)
11. Stats
12. Before/After Slider
13. Testimonials
14. CTA Banner
15. Footer
16. Service Tabs (`.tabs-nav`, `.tab-indicator`, `.tab-btn`)
17. Service Cards
18. Packages (glass with `::after` highlight)
19. Process Timeline
20. FAQ Accordion
21. Gallery (grid, filters, lightbox)
22. Contact Form (glass inputs)
23. Map
24. Page Hero (inner pages)
25. Animations & Utilities
26. Grain overlay
27. Glass Ambient Blobs (3 animated floating gradient circles)
28. Mobile nav glass overrides
29. WhatsApp floating button
30. Light mode specific overrides

---

## JavaScript Modules

### `js/main.js` — Core (loaded on all pages)
- **Theme toggle**: Reads `localStorage('ccc-theme')`, defaults `dark`, toggles `data-theme` on `<html>`
- **Navbar**: Adds `.scrolled` class at 50px scroll
- **Mobile menu**: Hamburger toggle with overlay
- **GSAP ScrollTrigger**: Reveal animation for `.gsap-reveal` elements
- **Hero parallax**: Background moves on scroll
- **Animated counters**: IntersectionObserver triggers number counting
- **FAQ accordion**: Click to expand/collapse, one-at-a-time

### `js/services.js` — Tab System
- Dynamically creates `.tab-indicator` element inside `#serviceTabs`
- `moveIndicator(btn, animate)`: Calculates button rect relative to nav container + scroll offset, sets indicator `width` and `translateX`
- Tab content show/hide on click
- Scroll active tab button into view (horizontal scroll)
- Recalculates indicator on `scroll` (passive) and `resize` (debounced 100ms)
- Supports URL hash navigation (`#protection`, `#wrapping`, etc.) and `hashchange` event

### `js/slider.js` — Before/After Slider
- Mouse + touch drag support
- Uses `clip-path: inset()` for reveal effect
- Draggable handle with visual feedback

### `js/gallery.js` — Gallery & Lightbox
- Filter by `data-category` attribute
- Fade transition between filter states
- Lightbox: opens on click, close on X button, overlay click, or Escape key
- Navigation between images in lightbox

### `js/form.js` — Contact Form Validation + Submit
- Client-side validation for all fields (name, email, phone, service, date, message)
- Visual error states with messages
- Phone: Indian format validation
- Date: Enforces minimum date (today)
- Async submit to `/api/send-contact.php` (or `VITE_CONTACT_API_URL`)
- Success/error state handling for backend responses

---

## WhatsApp Support Button

A floating WhatsApp button appears on all pages (bottom-right corner):
- **Desktop**: Green liquid glass pill with icon + "Chat with us" label + pulse animation
- **Mobile** (< 640px): Collapses to circular icon-only button
- Links to `wa.me/919999999999` — **REPLACE `919999999999` with your actual WhatsApp Business number** in all 6 HTML files

### WhatsApp AI Agent (not yet integrated)
Recommended platforms for AI-powered WhatsApp chatbot:
- **BotPress + WhatsApp Cloud API** — Free platform, cheapest long-term (~₹0.30/conversation)
- **AiSensy** — Indian platform, starts ~₹999/mo, no-code setup
- **Interakt (Jio)** — starts ~₹799/mo, deep India integrations

---

## Ambient Visual Effects

### Glass Blobs (background)
3 animated floating gradient circles (`blob-1`, `blob-2`, `blob-3`) create ambient light:
- Blob 1: Accent (rose) color, top-left area
- Blob 2: Indigo/purple, bottom-right area
- Blob 3: Fuchsia, center area
- CSS `@keyframes blobFloat` with different durations per blob

### Grain Overlay
`body.grain::after` applies a subtle noise texture via CSS for analog feel.

---

## Images

All images currently use **Unsplash CDN URLs** (`images.unsplash.com`). For production:
1. Download and self-host images in an `assets/images/` folder
2. Optimize with tools like Squoosh or ImageOptim
3. Convert to WebP format for faster loading
4. Add proper `alt` text for accessibility
5. Consider lazy loading (`loading="lazy"` is recommended)

---

## Responsive Breakpoints

| Breakpoint | Usage |
|-----------|-------|
| `768px` | Navbar collapse, grid adjustments, typography scale |
| `640px` | WhatsApp button icon-only, gallery grid, form layout |
| `480px` | Fine-tuned spacing, font sizes |

Mobile-first considerations:
- Horizontal scrollable tabs on mobile
- Hamburger menu with glass overlay
- Touch-friendly tap targets (min 44px)

---

## Local Development

```bash
# Clone the repo
git clone <repo-url>
cd creative-car-customs

# Start local server (any of these work)
python -m http.server 3000
# or
npx serve -l 3000
# or just open index.html directly in browser (some features may not work due to CORS)

# Open in browser
http://localhost:3000
```

Run `npm install` if you want to use Vite (`npm run dev`, `npm run build`).

For the PHP contact API:

```bash
cd api
composer install --no-dev --optimize-autoloader
```

Then copy `api/config.php.example` to `api/config.php` on server and set mailbox credentials there or via server environment variables.

---

## Deployment

### Recommended Setup
- **Domain**: Cloudflare Registrar (at-cost pricing) or Namecheap
- **Hosting**: Cloudflare Pages or Netlify (both free for static sites)

### Deploy to Netlify
1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Build command: (leave empty — no build step)
4. Publish directory: `/` (root)
5. Add custom domain

### Deploy to Cloudflare Pages
1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Framework preset: None
4. Build command: (leave empty)
5. Build output directory: `/`

### Performance Notes
- Tailwind CDN is convenient for development but generates unused CSS. For production, consider installing Tailwind locally and purging unused styles for a smaller CSS bundle.
- Self-host Google Fonts and GSAP for better performance (fewer DNS lookups).
- Add `<link rel="preload">` for critical assets.

### Hostinger SMTP Contact Setup

1. Create mailbox in Hostinger, e.g. `support@creativecarcustoms.com`.
2. Set SMTP config server-side only:
  - Host: `smtp.hostinger.com`
  - Port: `465` with SSL (preferred) or `587` with STARTTLS
  - Username: full mailbox address
  - Password: mailbox password
3. Deploy `api/send-contact.php` and `api/vendor/` to your server.
4. Keep `api/config.php` private and never expose credentials in frontend code.
5. Receiving mail is handled in Hostinger Webmail/email app; website only sends outbound form email.

---

## TODO / Future Enhancements

- [ ] Replace placeholder WhatsApp number (`919999999999`) with real number
- [ ] Replace Unsplash URLs with self-hosted optimized images
- [ ] Replace placeholder logo SVG with actual brand logo
- [x] Integrate contact form with backend (Hostinger SMTP via server-side PHP)
- [ ] Integrate WhatsApp AI agent (BotPress, AiSensy, or Interakt)
- [ ] Add Google Analytics / Plausible analytics
- [ ] Add structured data (JSON-LD) for local business SEO
- [ ] Add sitemap.xml and robots.txt
- [ ] Replace Tailwind CDN with local build + purge for production
- [ ] Add loading="lazy" to all images
- [ ] Add Open Graph images for social sharing
- [ ] Consider adding a booking/appointment scheduling system
- [ ] Add testimonial data from real customers
- [ ] Update team section with real team photos and bios

---

## Key Selectors Reference (for Copilot context)

| Selector | Purpose |
|----------|---------|
| `[data-theme="dark"]` / `[data-theme="light"]` | Theme switch |
| `.nav-links a:not(.nav-cta)` | Generic nav links (excludes CTA button) |
| `.nav-cta` | "Get a Quote" nav button |
| `.btn-primary`, `.btn-outline` | Main button variants |
| `.tab-btn`, `.tab-indicator` | Service page tab system |
| `.whatsapp-float` | WhatsApp floating button |
| `.glass-ambient .blob` | Background glow blobs |
| `.gsap-reveal` | Elements animated by GSAP on scroll |
| `.grain` | Body class for noise overlay |
| `#themeToggle` | Theme toggle button ID |
| `#serviceTabs` | Tabs container ID |
| `#navbar` | Navbar ID |

---

## Brand Details

| | |
|---|---|
| **Business Name** | Creative Car Customs (CCC) |
| **Tagline** | "Where Every Detail Hits Different" |
| **HQ** | Delhi NCR, India |
| **Service Area** | Pan-India (doorstep service) |
| **Accent Color** | Rose/Red `#e11d48` |
| **Services** | 37 services across 6 categories |
| **Packages** | Essential ₹4,999 / Premium ₹18,999 / Ultimate ₹49,999 |

---

*Built with Tailwind CSS, GSAP, and vanilla JavaScript. No build tools required.*
