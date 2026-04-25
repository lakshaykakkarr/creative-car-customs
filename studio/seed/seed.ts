import 'dotenv/config'
import { createClient } from '@sanity/client'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('[ERROR] SANITY_TOKEN not found in .env')
  process.exit(1)
}

const client = createClient({
  projectId: 'w4fgl3xy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ─── helpers ──────────────────────────────────────────────────────────────────

async function upsert(doc: Record<string, unknown>) {
  const id = doc._id as string
  await client.createOrReplace(doc)
  console.log(`  ✓ ${doc._type} → ${id}`)
}

async function upsertMany(docs: Record<string, unknown>[]) {
  for (const doc of docs) await upsert(doc)
}

// ─── 1. Site Settings ─────────────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log('[config] Site Settings')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'Creative Car Customs',
    tagline: 'Where Every Detail Hits Different',
    footerBlurb:
      'Premium car detailing, protection, customization & accessories. Doorstep service across India since 2018.',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    whatsappMessage: "Hi CCC! I'd like to know more about your services.",
    email: 'hello@creativecarcustoms.in',
    address: 'Plot 42, Sector 18, Udyog Vihar, Gurgaon, Haryana 122015',
    foundedYear: 2018,
    copyrightYear: 2026,
    serviceCount: 51,
    socialLinks: {
      instagram: null,
      youtube: null,
      facebook: null,
    },
  })
}

// ─── 2. Business Hours ────────────────────────────────────────────────────────

async function seedBusinessHours() {
  console.log('[hours] Business Hours')
  await upsertMany([
    {
      _id: 'bh-mon-fri',
      _type: 'businessHours',
      dayLabel: 'Mon–Fri',
      openTime: '9:00 AM',
      closeTime: '7:00 PM',
      isByAppointment: false,
      order: 1,
    },
    {
      _id: 'bh-sat',
      _type: 'businessHours',
      dayLabel: 'Saturday',
      openTime: '9:00 AM',
      closeTime: '6:00 PM',
      isByAppointment: false,
      order: 2,
    },
    {
      _id: 'bh-sun',
      _type: 'businessHours',
      dayLabel: 'Sunday',
      openTime: null,
      closeTime: null,
      isByAppointment: true,
      order: 3,
    },
  ])
}

// ─── 3. Home Page ─────────────────────────────────────────────────────────────

async function seedHomePage() {
  console.log('[home] Home Page')
  await upsert({
    _id: 'homePage',
    _type: 'homePage',
    metaTitle:
      'Creative Car Customs — Premium Car Detailing & Customization | Delhi NCR & Pan-India',
    metaDescription:
      'Creative Car Customs (CCC) offers end-to-end car detailing, ceramic coating, PPF, wrapping, performance upgrades & accessories. Doorstep service across India. HQ Delhi NCR.',
    ogTitle: 'Creative Car Customs — Where Every Detail Hits Different',
    heroBadge: 'Delhi NCR • Pan-India Doorstep Service',
    heroTitle: 'Where Every Detail',
    heroTitleAccent: 'Hits Different',
    heroSubtitle:
      'Premium car detailing, protection, customization & performance upgrades — delivered to your doorstep, anywhere in India.',
    heroImageUrl: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1920&q=80',
    heroCta1Text: 'Book Now',
    heroCta1Url: 'contact.html',
    heroCta2Text: 'Explore Services',
    heroCta2Url: 'services.html',
    servicesSectionLabel: 'What We Do',
    servicesSectionTitle: 'End-to-End Car Care',
    servicesSectionDesc:
      'From a simple wash to full custom builds — we handle everything your car needs under one roof.',
    sliderSectionLabel: 'Transformations',
    sliderSectionTitle: 'See the Difference',
    sliderSectionDesc:
      'Drag the slider to reveal stunning before & after transformations by our expert team.',
    testimonialsSectionLabel: 'Testimonials',
    testimonialsSectionTitle: 'What Our Clients Say',
    testimonialsSectionDesc:
      'Join thousands of satisfied car owners who trust CCC with their prized possessions.',
    statsSectionLabel: 'By the Numbers',
    statsSectionTitle: 'Our Track Record',
    statsSectionDesc: 'Real numbers. Real trust. Built over years of premium service.',
    ogDescription:
      'Premium car detailing, ceramic coating, PPF, wrapping & performance upgrades. Doorstep service across India. HQ Delhi NCR.',
  })
}

// ─── 4. Page Content ──────────────────────────────────────────────────────────

async function seedPageContent() {
  console.log('[content] Page Content')
  await upsertMany([
    {
      _id: 'page-about',
      _type: 'pageContent',
      page: 'about',
      metaTitle: 'About Us — Creative Car Customs | Our Story & Mission',
      metaDescription:
        'Learn about Creative Car Customs — born in 2018 from a passion for cars, now serving 50+ cities across India with premium detailing, coating, and customization.',
      heroHeading: 'About',
      heroHeadingAccent: 'Creative Car Customs',
      heroSubtitle: 'Born from passion. Built on precision. Trusted by thousands.',
      storyLabel: 'Our Story',
      storyTitle: 'From a Garage Dream to',
      storyTitleAccent: "India's Premium Car Care Brand",
      storyImageUrl: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80',
      storyBody: [
        {
          _key: 'block-1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              text: 'Creative Car Customs wasn\'t born in a boardroom—it was born in the mind of a kid who fell in love with cars the moment they could walk. While other kids dreamed of becoming doctors or engineers, this young enthusiast spent garage hours studying every detail of automobiles, learning how a single tweak could transform not just a car\'s performance, but the entire experience of driving it.',
              marks: [],
            },
          ],
          style: 'normal',
        },
        {
          _key: 'block-2',
          _type: 'block',
          children: [
            {
              _key: 'span-2',
              _type: 'span',
              text: 'That passion never faded. Instead, it grew into an ambition—to build India\'s biggest car care brand. To create a place where every car owner, regardless of where they live or what they drive, could access ',
              marks: [],
            },
            {
              _key: 'span-3',
              _type: 'span',
              text: 'world-class car care',
              marks: ['strong'],
            },
            {
              _key: 'span-4',
              _type: 'span',
              text: ' without compromise. To turn that childhood passion into something that serves thousands.',
              marks: [],
            },
          ],
          style: 'normal',
        },
        {
          _key: 'block-3',
          _type: 'block',
          children: [
            {
              _key: 'span-5',
              _type: 'span',
              text: "Today, Creative Car Customs is that dream realized. With a team of experts who share the same passion, we've helped thousands of car owners protect, enhance, and customize their vehicles. But our journey doesn't stop here—it's just the beginning. We're building the future of automotive aftercare in India, one perfectly detailed car at a time.",
              marks: [],
            },
          ],
          style: 'normal',
        },
      ],
      missionText:
        'To deliver world-class car care experiences that are accessible, convenient, and uncompromising in quality — right at your doorstep, anywhere in India.',
      visionText:
        "To become India's #1 end-to-end car customization and care platform — setting the standard for quality, innovation, and customer experience in the automotive aftermarket.",
      ctaBannerHeading: 'Ready to Experience the CCC Difference?',
      ctaBannerSubtext:
        'Book a consultation and let us show you what true car care looks like.',
      ctaBannerBtnText: 'Get a Free Quote',
      ctaBannerBtnUrl: 'contact.html',
    },
    {
      _id: 'page-services',
      _type: 'pageContent',
      page: 'services',
      metaTitle: 'Services — Creative Car Customs | 51 End-to-End Car Services',
      metaDescription:
        'Browse all 51 car care services by Creative Car Customs — detailing, ceramic coating, PPF, car wrapping, ECU remapping, infotainment & more. Prices starting ₹999.',
      heroHeading: 'Our',
      heroHeadingAccent: 'Services',
      heroSubtitle:
        '51 end-to-end car services — from a basic wash to full custom builds. Everything your car needs, under one roof.',
      servicesHeroServiceCount: 51,
      servicesProcessLabel: 'How It Works',
      servicesProcessTitle: 'Our Service Process',
      servicesFaqTitle: 'Frequently Asked Questions',
      servicesProcessSteps: [
        { step: 1, title: 'Book Online', description: 'Fill the form or call us' },
        { step: 2, title: 'We Confirm', description: 'Slot & pricing confirmed within 2 hours' },
        { step: 3, title: 'We Arrive', description: 'Our team comes to your doorstep' },
        { step: 4, title: 'Service', description: 'Expert work done, zero shortcuts' },
        { step: 5, title: 'Handover', description: 'Inspect, approve, and enjoy your car' },
      ],
    },
    {
      _id: 'page-gallery',
      _type: 'pageContent',
      page: 'gallery',
      metaTitle: 'Gallery — Creative Car Customs | Before & After Transformations',
      metaDescription:
        'See real before & after car transformations by Creative Car Customs — ceramic coating, PPF, wrapping, detailing, performance mods & interior upgrades.',
      heroHeading: 'Our',
      heroHeadingAccent: 'Gallery',
      heroSubtitle:
        'Real work. Real results. Browse our portfolio of stunning car transformations.',
      ctaBannerHeading: 'Want Your Car Featured Here?',
      ctaBannerSubtext:
        'Book your transformation today and join our growing gallery of happy car owners.',
      ctaBannerBtnText: 'Book Your Transformation',
      ctaBannerBtnUrl: 'contact.html',
    },
    {
      _id: 'page-areas',
      _type: 'pageContent',
      page: 'areas',
      metaTitle: 'Service Areas — Creative Car Customs | Pan-India Doorstep Service',
      metaDescription:
        'Creative Car Customs serves 50+ cities across India with premium doorstep car care. Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad & more.',
      heroHeading: 'We Serve',
      heroHeadingAccent: 'All of India',
      heroSubtitle: '50+ cities. One promise — premium car care delivered to your doorstep.',
      ctaBannerHeading: 'Your City, Your Driveway, Our Service',
      ctaBannerSubtext:
        "Don't see your city? Get in touch — we're expanding every month.",
      ctaBannerBtnText: 'Book Doorstep Service',
      ctaBannerBtnUrl: 'contact.html',
      areasDooorstepLabel: 'Doorstep Service',
      areasDooorstepTitle: 'How It Works',
      areasDooorstepSteps: [
        { title: 'Book & Consult', description: "Fill our form, call, or WhatsApp us. We'll discuss your car's needs and confirm pricing before we arrive." },
        { title: 'We Come to You', description: 'Our fully-equipped mobile unit arrives at your home, office, or preferred location — on schedule.' },
        { title: 'Inspect & Enjoy', description: "We walk you through every detail once done. We don't leave until you're 100% satisfied." },
      ],
    },
    {
      _id: 'page-contact',
      _type: 'pageContent',
      page: 'contact',
      metaTitle: 'Contact — Creative Car Customs | Get a Free Quote',
      metaDescription:
        'Get a free quote from Creative Car Customs. Call, WhatsApp, or fill the form — we respond within 2 hours.',
      heroHeading: 'Get in',
      heroHeadingAccent: 'Touch',
      heroSubtitle:
        'Free consultation. No obligations. Let us discuss what your car needs.',
      contactSuccessMessage:
        "Inquiry Sent! We'll get back to you within 2 hours. Check your phone for a confirmation WhatsApp.",
    },
  ])
}

// ─── 5. Service Categories ────────────────────────────────────────────────────

async function seedServiceCategories() {
  console.log('[categories] Service Categories')
  await upsertMany([
    {
      _id: 'cat-detailing',
      _type: 'serviceCategory',
      title: 'Detailing & Cleaning',
      slug: { _type: 'slug', current: 'detailing' },
      tabLabel: 'Detailing & Cleaning',
      cardDescription: 'Exterior wash, interior deep clean, engine bay, headlight restoration, leather care & more',
      icon: 'droplets',
      order: 1,
    },
    {
      _id: 'cat-protection',
      _type: 'serviceCategory',
      title: 'Paint & Protection',
      slug: { _type: 'slug', current: 'protection' },
      tabLabel: 'Paint & Protection',
      cardDescription: 'Paint correction, ceramic coating, PPF, underbody coating, windshield coating & scratch removal',
      icon: 'shield',
      order: 2,
    },
    {
      _id: 'cat-wrapping',
      _type: 'serviceCategory',
      title: 'Wrapping & Aesthetics',
      slug: { _type: 'slug', current: 'wrapping' },
      tabLabel: 'Wrapping & Aesthetics',
      cardDescription: 'Full body wraps, partial wraps, custom paint, window tinting, custom lighting & more',
      icon: 'palette',
      order: 3,
    },
    {
      _id: 'cat-performance',
      _type: 'serviceCategory',
      title: 'Performance Upgrades',
      slug: { _type: 'slug', current: 'performance' },
      tabLabel: 'Performance',
      cardDescription: 'Body kits, custom exhaust, ECU remapping, suspension upgrades, brake upgrades & sunroof service',
      icon: 'zap',
      order: 4,
    },
    {
      _id: 'cat-tech',
      _type: 'serviceCategory',
      title: 'Tech & Accessories',
      slug: { _type: 'slug', current: 'tech' },
      tabLabel: 'Tech & Accessories',
      cardDescription: 'Infotainment, 360° cameras, dashcams, GPS trackers, seat covers, interior trim & fragrance systems',
      icon: 'cpu',
      order: 5,
    },
    {
      _id: 'cat-maintenance',
      _type: 'serviceCategory',
      title: 'Maintenance & Value',
      slug: { _type: 'slug', current: 'maintenance' },
      tabLabel: 'Maintenance',
      cardDescription: 'Annual maintenance packages, pre-purchase car inspection & insurance claim assistance',
      icon: 'wrench',
      order: 6,
    },
  ])
}

// ─── 6. Services ──────────────────────────────────────────────────────────────

async function seedServices() {
  console.log('[services] Services')
  const services: Record<string, unknown>[] = [
    // ── Detailing & Cleaning
    {
      _id: 'svc-d-01', _type: 'service', category: 'detailing', order: 1,
      title: 'Exterior Wash & Detailing',
      slug: { _type: 'slug', current: 'exterior-wash-detailing' },
      description: 'Full exterior hand wash, clay bar decontamination, tyre dressing, window cleaning, and exterior trim restoration.',
      startingPrice: 1499,
    },
    {
      _id: 'svc-d-02', _type: 'service', category: 'detailing', order: 2,
      title: 'Interior Deep Cleaning',
      slug: { _type: 'slug', current: 'interior-deep-cleaning' },
      description: 'Thorough interior vacuum, dashboard and console wipe-down, carpet shampooing, and air vent cleaning.',
      startingPrice: 2499,
    },
    {
      _id: 'svc-d-03', _type: 'service', category: 'detailing', order: 3,
      title: 'Engine Bay Cleaning',
      slug: { _type: 'slug', current: 'engine-bay-cleaning' },
      description: 'Safe degreasing and pressure washing of engine bay components to remove oil, grease, and road grime.',
      startingPrice: 1999,
    },
    {
      _id: 'svc-d-04', _type: 'service', category: 'detailing', order: 4,
      title: 'Headlight Restoration',
      slug: { _type: 'slug', current: 'headlight-restoration' },
      description: 'Wet sanding and polishing to remove yellowing, oxidation, and hazing from plastic headlight lenses.',
      startingPrice: 1299,
    },
    {
      _id: 'svc-d-05', _type: 'service', category: 'detailing', order: 5,
      title: 'Alloy Wheel Repair & Detailing',
      slug: { _type: 'slug', current: 'alloy-wheel-repair-detailing' },
      description: 'Curb rash repair, deep cleaning, and polishing of alloy wheels to restore their showroom shine.',
      startingPrice: 2999,
    },
    {
      _id: 'svc-d-06', _type: 'service', category: 'detailing', order: 6,
      title: 'AC Vent Sanitization & Odor Removal',
      slug: { _type: 'slug', current: 'ac-vent-sanitization' },
      description: 'Anti-bacterial treatment and deodorizing of AC system and cabin to eliminate bad odors and germs.',
      startingPrice: 999,
    },
    {
      _id: 'svc-d-07', _type: 'service', category: 'detailing', order: 7,
      title: 'Leather Conditioning & Repair',
      slug: { _type: 'slug', current: 'leather-conditioning-repair' },
      description: 'Professional leather cleaning, conditioning, and minor crack/color repair to restore leather seats and panels.',
      startingPrice: 1799,
    },
    {
      _id: 'svc-d-08', _type: 'service', category: 'detailing', order: 8,
      title: 'Paint Decontamination & Iron Fallout Removal',
      slug: { _type: 'slug', current: 'paint-decontamination' },
      description: 'Iron fallout remover and clay bar treatment to extract embedded contaminants from paint before coating.',
      startingPrice: 1999,
    },
    {
      _id: 'svc-d-09', _type: 'service', category: 'detailing', order: 9,
      title: 'Ozone & Steam Sanitization',
      slug: { _type: 'slug', current: 'ozone-steam-sanitization' },
      description: 'High-temperature steam cleaning and ozone treatment to kill bacteria, viruses, and eliminate persistent odors.',
      startingPrice: 1499,
    },

    // ── Paint & Protection
    {
      _id: 'svc-p-01', _type: 'service', category: 'protection', order: 1,
      title: 'Paint Correction (Single-Stage)',
      slug: { _type: 'slug', current: 'paint-correction-single-stage' },
      description: 'Single-stage machine polish to remove light swirl marks, minor scratches, and water spots from paintwork.',
      startingPrice: 4999,
    },
    {
      _id: 'svc-p-02', _type: 'service', category: 'protection', order: 2,
      title: 'Paint Correction (Multi-Stage)',
      slug: { _type: 'slug', current: 'paint-correction-multi-stage' },
      description: 'Multi-stage compounding and polishing to remove deep scratches, heavy oxidation, and severe paint defects.',
      startingPrice: 8999,
    },
    {
      _id: 'svc-p-03', _type: 'service', category: 'protection', order: 3,
      title: 'Ceramic Coating (9H / Graphene)',
      slug: { _type: 'slug', current: 'ceramic-coating' },
      description: 'Professional-grade 9H or graphene ceramic coating application for hydrophobic protection, gloss enhancement, and scratch resistance lasting 3–7 years.',
      startingPrice: 15999,
      isPopular: true,
    },
    {
      _id: 'svc-p-04', _type: 'service', category: 'protection', order: 4,
      title: 'Paint Protection Film (PPF)',
      slug: { _type: 'slug', current: 'paint-protection-film' },
      description: 'XPEL Ultimate Plus self-healing TPU film installation to protect high-impact areas from stone chips, road debris, and minor abrasions. 10-year warranty.',
      startingPrice: 25000,
    },
    {
      _id: 'svc-p-05', _type: 'service', category: 'protection', order: 5,
      title: 'Windshield Hydrophobic Coating',
      slug: { _type: 'slug', current: 'windshield-hydrophobic-coating' },
      description: 'Water-repellent nano-coating applied to windshield and windows for improved rain visibility and easier cleaning.',
      startingPrice: 2499,
    },
    {
      _id: 'svc-p-06', _type: 'service', category: 'protection', order: 6,
      title: 'Underbody Coating / Anti-Rust',
      slug: { _type: 'slug', current: 'underbody-coating-anti-rust' },
      description: 'Rubberized underbody sealant to protect chassis and underpanels from rust, road noise, and moisture damage.',
      startingPrice: 3499,
    },
    {
      _id: 'svc-p-07', _type: 'service', category: 'protection', order: 7,
      title: 'Scratch Removal & Touch-Up Paint',
      slug: { _type: 'slug', current: 'scratch-removal-touch-up' },
      description: 'Targeted repair of surface scratches and stone chips using color-matched touch-up paint and polish blending.',
      startingPrice: 999,
    },
    {
      _id: 'svc-p-08', _type: 'service', category: 'protection', order: 8,
      title: 'Ceramic Alloy Wheel Coating',
      slug: { _type: 'slug', current: 'ceramic-alloy-wheel-coating' },
      description: 'Dedicated ceramic coating for alloy wheels to resist brake dust, road grime, and heat for easy cleaning.',
      startingPrice: 4999,
    },
    {
      _id: 'svc-p-09', _type: 'service', category: 'protection', order: 9,
      title: 'Chrome Delete / Vinyl Overlay',
      slug: { _type: 'slug', current: 'chrome-delete-vinyl-overlay' },
      description: 'Replace factory chrome trim with matte, gloss, or satin vinyl overlays for a blacked-out or custom look.',
      startingPrice: 6999,
    },

    // ── Wrapping & Aesthetics
    {
      _id: 'svc-w-01', _type: 'service', category: 'wrapping', order: 1,
      title: 'Full Body Car Wrapping',
      slug: { _type: 'slug', current: 'full-body-car-wrapping' },
      description: 'Complete vehicle wrap using premium Avery Dennison or 3M vinyl in any color or finish — matte, gloss, satin, chrome, or custom.',
      startingPrice: 45000,
    },
    {
      _id: 'svc-w-02', _type: 'service', category: 'wrapping', order: 2,
      title: 'Partial Wraps (Roof, Hood, Mirrors)',
      slug: { _type: 'slug', current: 'partial-wraps' },
      description: 'Accent wrapping for specific panels — roof, hood, boot lid, door mirrors — to create two-tone or contrast looks.',
      startingPrice: 8000,
    },
    {
      _id: 'svc-w-03', _type: 'service', category: 'wrapping', order: 3,
      title: 'Custom Paint Jobs & Airbrushing',
      slug: { _type: 'slug', current: 'custom-paint-airbrushing' },
      description: 'Bespoke custom paint and airbrushed artwork for full personalization — murals, gradients, patterns, and more.',
      startingPrice: 35000,
    },
    {
      _id: 'svc-w-04', _type: 'service', category: 'wrapping', order: 4,
      title: 'Window Tinting / Solar Films',
      slug: { _type: 'slug', current: 'window-tinting' },
      description: '3M or Llumar solar films applied to windows for heat rejection, UV protection, and privacy.',
      startingPrice: 4999,
    },
    {
      _id: 'svc-w-05', _type: 'service', category: 'wrapping', order: 5,
      title: 'Custom Lighting (DRLs, Underglow, Ambient)',
      slug: { _type: 'slug', current: 'custom-lighting' },
      description: 'LED DRL upgrades, underbody neon lighting, and interior ambient lighting installation for a premium look.',
      startingPrice: 3999,
    },
    {
      _id: 'svc-w-06', _type: 'service', category: 'wrapping', order: 6,
      title: 'Number Plate Frames & Accessories',
      slug: { _type: 'slug', current: 'number-plate-frames' },
      description: 'Premium custom number plate frames and exterior accessories installation.',
      startingPrice: 799,
    },
    {
      _id: 'svc-w-07', _type: 'service', category: 'wrapping', order: 7,
      title: 'Racing Stripes & Custom Decals',
      slug: { _type: 'slug', current: 'racing-stripes-decals' },
      description: 'Precision-cut racing stripes, sport decals, and custom graphics applied using high-quality vinyl.',
      startingPrice: 3999,
    },
    {
      _id: 'svc-w-08', _type: 'service', category: 'wrapping', order: 8,
      title: 'Door Sills & Kick Plate Wrapping',
      slug: { _type: 'slug', current: 'door-sills-kick-plate-wrapping' },
      description: 'Custom vinyl or carbon-fibre-look wrapping of door sill plates and kick panels for an elevated interior look.',
      startingPrice: 2499,
    },

    // ── Performance
    {
      _id: 'svc-perf-01', _type: 'service', category: 'performance', order: 1,
      title: 'Body Kits & Aero Mods',
      slug: { _type: 'slug', current: 'body-kits-aero-mods' },
      description: 'Front splitters, side skirts, rear diffusers, and complete body kit fitment for an aggressive stance and improved aerodynamics.',
      startingPrice: 15000,
    },
    {
      _id: 'svc-perf-02', _type: 'service', category: 'performance', order: 2,
      title: 'Custom Exhaust Systems',
      slug: { _type: 'slug', current: 'custom-exhaust-systems' },
      description: 'Cat-back or axle-back exhaust system installation and custom fabrication for improved flow, sound, and performance.',
      startingPrice: 12000,
    },
    {
      _id: 'svc-perf-03', _type: 'service', category: 'performance', order: 3,
      title: 'Performance Tuning / ECU Remapping',
      slug: { _type: 'slug', current: 'ecu-remapping' },
      description: 'Professional ECU software tuning (Stage 1/2) for increased horsepower, torque, and throttle response — safe and reversible.',
      startingPrice: 18000,
      isPopular: true,
    },
    {
      _id: 'svc-perf-04', _type: 'service', category: 'performance', order: 4,
      title: 'Suspension Upgrades',
      slug: { _type: 'slug', current: 'suspension-upgrades' },
      description: 'Coilover installation, lowering springs, strut bar upgrades, and alignment for improved handling and stance.',
      startingPrice: 20000,
    },
    {
      _id: 'svc-perf-05', _type: 'service', category: 'performance', order: 5,
      title: 'Ceramic Brake Pad Upgrades',
      slug: { _type: 'slug', current: 'ceramic-brake-pad-upgrades' },
      description: 'High-performance ceramic brake pad and rotor upgrades for better stopping power and reduced brake fade.',
      startingPrice: 5999,
    },
    {
      _id: 'svc-perf-06', _type: 'service', category: 'performance', order: 6,
      title: 'Sunroof Service & Maintenance',
      slug: { _type: 'slug', current: 'sunroof-service-maintenance' },
      description: 'Sunroof cleaning, seal inspection, drainage clearing, and mechanism lubrication to keep your panoramic or standard sunroof in top condition.',
      startingPrice: 2999,
    },
    {
      _id: 'svc-perf-07', _type: 'service', category: 'performance', order: 7,
      title: 'Cold Air Intake Upgrade',
      slug: { _type: 'slug', current: 'cold-air-intake-upgrade' },
      description: 'Aftermarket cold air intake installation for improved engine breathing, throttle response, and a sportier induction sound.',
      startingPrice: 8000,
    },
    {
      _id: 'svc-perf-08', _type: 'service', category: 'performance', order: 8,
      title: 'Intercooler Upgrade',
      slug: { _type: 'slug', current: 'intercooler-upgrade' },
      description: 'Front-mount or top-mount intercooler upgrade for turbocharged vehicles to reduce charge air temperature and support higher power levels.',
      startingPrice: 22000,
    },

    // ── Tech & Accessories
    {
      _id: 'svc-t-01', _type: 'service', category: 'tech', order: 1,
      title: 'Infotainment & Audio Upgrades',
      slug: { _type: 'slug', current: 'infotainment-audio-upgrades' },
      description: 'Android Auto / Apple CarPlay headunit installation, speaker upgrades, amplifier and subwoofer fitment for premium in-car audio.',
      startingPrice: 8999,
    },
    {
      _id: 'svc-t-02', _type: 'service', category: 'tech', order: 2,
      title: '360° Camera & Parking Sensors',
      slug: { _type: 'slug', current: '360-camera-parking-sensors' },
      description: '4-camera 360° surround view system and ultrasonic parking sensor installation for stress-free parking and maneuvering.',
      startingPrice: 12999,
    },
    {
      _id: 'svc-t-03', _type: 'service', category: 'tech', order: 3,
      title: 'Dashcam Installation',
      slug: { _type: 'slug', current: 'dashcam-installation' },
      description: 'Front and rear dashcam installation with hardwire kit for always-on parking mode recording.',
      startingPrice: 4999,
    },
    {
      _id: 'svc-t-04', _type: 'service', category: 'tech', order: 4,
      title: 'Car GPS / Tracker Installation',
      slug: { _type: 'slug', current: 'gps-tracker-installation' },
      description: 'Covert GPS vehicle tracker installation with real-time tracking, geofencing alerts, and theft notification.',
      startingPrice: 3999,
    },
    {
      _id: 'svc-t-05', _type: 'service', category: 'tech', order: 5,
      title: 'Electric / Automatic Tailgate',
      slug: { _type: 'slug', current: 'electric-automatic-tailgate' },
      description: 'Hands-free electric tailgate upgrade with kick sensor and remote control for SUVs and hatchbacks.',
      startingPrice: 18000,
    },
    {
      _id: 'svc-t-06', _type: 'service', category: 'tech', order: 6,
      title: 'Seat Covers & Upholstery',
      slug: { _type: 'slug', current: 'seat-covers-upholstery' },
      description: 'Custom Nappa leather, Leatherette, or fabric seat cover sets tailored to your car — with or without perforations and piping.',
      startingPrice: 6999,
    },
    {
      _id: 'svc-t-07', _type: 'service', category: 'tech', order: 7,
      title: 'Dashboard Trim & Interior Accessories',
      slug: { _type: 'slug', current: 'dashboard-trim-interior-accessories' },
      description: 'Carbon fibre, wood grain, or brushed aluminum interior trim overlays and premium accessory upgrades.',
      startingPrice: 4999,
    },
    {
      _id: 'svc-t-08', _type: 'service', category: 'tech', order: 8,
      title: 'Car Perfume / Fragrance Systems',
      slug: { _type: 'slug', current: 'car-perfume-fragrance-systems' },
      description: 'Premium in-cabin fragrance diffuser installation with long-lasting refillable scent cartridges.',
      startingPrice: 1499,
    },
    {
      _id: 'svc-t-09', _type: 'service', category: 'tech', order: 9,
      title: 'Wireless Charging Pad Installation',
      slug: { _type: 'slug', current: 'wireless-charging-pad' },
      description: 'OEM-style Qi wireless charging pad integration into centre console or armrest for compatible smartphones.',
      startingPrice: 3499,
    },
    {
      _id: 'svc-t-10', _type: 'service', category: 'tech', order: 10,
      title: 'Remote Engine Start System',
      slug: { _type: 'slug', current: 'remote-engine-start' },
      description: 'Aftermarket remote start module installation — pre-cool or pre-heat your cabin before you get in.',
      startingPrice: 7999,
    },
    {
      _id: 'svc-t-11', _type: 'service', category: 'tech', order: 11,
      title: 'Head-Up Display (HUD) Installation',
      slug: { _type: 'slug', current: 'head-up-display-installation' },
      description: 'OBD2 or GPS-based Head-Up Display installation projecting speed, navigation, and alerts onto the windshield.',
      startingPrice: 12999,
    },

    // ── Maintenance & Value
    {
      _id: 'svc-m-01', _type: 'service', category: 'maintenance', order: 1,
      title: 'Annual Maintenance Packages (AMC)',
      slug: { _type: 'slug', current: 'annual-maintenance-package' },
      description: 'Comprehensive yearly car care plan covering scheduled detailing, inspection, and priority service slots.',
      startingPrice: 24999,
      priceLabel: '/year',
    },
    {
      _id: 'svc-m-02', _type: 'service', category: 'maintenance', order: 2,
      title: 'Pre-Purchase Car Inspection',
      slug: { _type: 'slug', current: 'pre-purchase-inspection' },
      description: 'Thorough multi-point inspection of used vehicles covering paint, mechanicals, frame condition, and undercarriage before purchase.',
      startingPrice: 3499,
    },
    {
      _id: 'svc-m-03', _type: 'service', category: 'maintenance', order: 3,
      title: 'Insurance Claim Assistance',
      slug: { _type: 'slug', current: 'insurance-claim-assistance' },
      description: 'Expert guidance and documentation support for filing insurance claims after accidents or theft.',
      isFree: true,
    },
    {
      _id: 'svc-m-04', _type: 'service', category: 'maintenance', order: 4,
      title: 'Tyre Rotation, Balancing & Alignment',
      slug: { _type: 'slug', current: 'tyre-rotation-balancing-alignment' },
      description: 'Tyre rotation, dynamic wheel balancing, and four-wheel alignment for even wear and precise handling.',
      startingPrice: 999,
    },
    {
      _id: 'svc-m-05', _type: 'service', category: 'maintenance', order: 5,
      title: 'Battery Health Check & EV Servicing',
      slug: { _type: 'slug', current: 'battery-health-ev-servicing' },
      description: 'Comprehensive battery load testing and EV-specific servicing including thermal management system checks.',
      startingPrice: 1999,
    },
    {
      _id: 'svc-m-06', _type: 'service', category: 'maintenance', order: 6,
      title: 'CCC Monthly Detailing Subscription',
      slug: { _type: 'slug', current: 'monthly-detailing-subscription' },
      description: 'Monthly doorstep detailing plan — keep your car pristine all year with scheduled exterior and interior care.',
      startingPrice: 2499,
      priceLabel: '/month',
    },
  ]

  await upsertMany(services)
}

// ─── 7. Service Packages ──────────────────────────────────────────────────────

async function seedServicePackages() {
  console.log('[packages] Service Packages')
  await upsertMany([
    {
      _id: 'pkg-essential',
      _type: 'servicePackage',
      name: 'Essential',
      price: 4999,
      priceUnit: '/session',
      description: 'Perfect for regular car owners who want their car clean and presentable.',
      features: [
        'Exterior wash & hand dry',
        'Interior deep vacuum & wipe-down',
        'Dashboard & trim polish',
        'Tyre & alloy cleaning',
        'AC vent sanitization',
      ],
      isFeatured: false,
      order: 1,
    },
    {
      _id: 'pkg-premium',
      _type: 'servicePackage',
      name: 'Premium',
      price: 18999,
      priceUnit: '/session',
      description: 'The most popular choice — protection + correction for car enthusiasts.',
      features: [
        'Everything in Essential',
        'Single-stage paint correction',
        '9H ceramic coating',
        'Windshield hydrophobic coating',
        'Engine bay cleaning',
        'Leather conditioning',
      ],
      isFeatured: true,
      order: 2,
    },
    {
      _id: 'pkg-ultimate',
      _type: 'servicePackage',
      name: 'Ultimate',
      price: 49999,
      priceUnit: '/session',
      description: 'The complete transformation — for those who demand the very best.',
      features: [
        'Everything in Premium',
        'Multi-stage paint correction',
        'Graphene ceramic coating',
        'Underbody anti-rust coating',
        'Headlight restoration',
        'Ceramic alloy wheel coating',
        '1-Year AMC included',
      ],
      isFeatured: false,
      order: 3,
    },
  ])
}

// ─── 8. Testimonials ──────────────────────────────────────────────────────────

async function seedTestimonials() {
  console.log('[testimonials] Testimonials')
  await upsertMany([
    {
      _id: 'testi-01',
      _type: 'testimonial',
      reviewerName: 'Rahul Kapoor',
      initials: 'RK',
      carMake: 'BMW',
      carModel: '530d',
      city: 'Delhi',
      rating: 5,
      quote:
        'Got the ceramic coating done on my BMW 5 Series. The team came to my office parking, finished in 6 hours, and the car looks absolutely stunning. The hydrophobic effect is unreal — water just beads off. Highly recommend CCC.',
      order: 1,
    },
    {
      _id: 'testi-02',
      _type: 'testimonial',
      reviewerName: 'Priya Sharma',
      initials: 'PS',
      carMake: 'Toyota',
      carModel: 'Fortuner',
      city: 'Jaipur',
      rating: 5,
      quote:
        'Full body PPF + matte wrap on my Fortuner — and they drove all the way to Jaipur! The finish is immaculate, not a single bubble or edge lift. The wrap completely transformed the look. Worth every rupee.',
      order: 2,
    },
    {
      _id: 'testi-03',
      _type: 'testimonial',
      reviewerName: 'Arjun Mehta',
      initials: 'AM',
      carMake: 'Volkswagen',
      carModel: 'Polo GT TSI',
      city: 'Gurgaon',
      rating: 5,
      quote:
        'ECU remap + custom exhaust on my Polo GT is an absolute game changer. The car pulls so much harder now and the exhaust note is addictive. CCC knows their stuff when it comes to performance mods.',
      order: 3,
    },
    {
      _id: 'testi-04',
      _type: 'testimonial',
      reviewerName: 'Neha Krishnan',
      initials: 'NK',
      carMake: 'Mahindra',
      carModel: 'XUV700',
      city: 'Noida',
      rating: 5,
      quote:
        'Interior deep clean + AC sanitization on the XUV700 — the cabin smells brand new and the seats look like they just came from the showroom. The team was professional and on time. Will book again!',
      order: 4,
    },
    {
      _id: 'testi-05',
      _type: 'testimonial',
      reviewerName: 'Vikram Singh',
      initials: 'VS',
      carMake: 'Mercedes',
      carModel: 'C300',
      city: 'Delhi',
      rating: 5,
      quote:
        'On the AMC plan for a year now. Monthly detailing keeps the C300 looking showroom-fresh. Best investment I made in my car — highly professional team and the attention to detail is outstanding.',
      order: 5,
    },
  ])
}

// ─── 9. Gallery Items ─────────────────────────────────────────────────────────

async function seedGalleryItems() {
  console.log('[gallery] Gallery Items')
  const base = 'https://images.unsplash.com/'
  await upsertMany([
    {
      _id: 'gallery-01', _type: 'galleryItem', category: 'ceramic', order: 1,
      imageUrl: `${base}photo-1503376780353-7e6692767b70?w=800&q=80`,
      altText: 'BMW 7 Series after Graphene Ceramic Coating',
      overlayTitle: 'BMW 7 Series',
      overlaySubtitle: 'Graphene Ceramic Coating',
    },
    {
      _id: 'gallery-02', _type: 'galleryItem', category: 'detailing', order: 2,
      imageUrl: `${base}photo-1552519507-da3b142c6e3d?w=800&q=80`,
      altText: 'Corvette C7 after Full Exterior Detailing',
      overlayTitle: 'Corvette C7',
      overlaySubtitle: 'Full Exterior Detailing',
    },
    {
      _id: 'gallery-03', _type: 'galleryItem', category: 'wrap', order: 3,
      imageUrl: `${base}photo-1544636331-e26879cd4d9b?w=800&q=80`,
      altText: 'Porsche 911 with Satin Black Full Wrap',
      overlayTitle: 'Porsche 911',
      overlaySubtitle: 'Satin Black Full Wrap',
    },
    {
      _id: 'gallery-04', _type: 'galleryItem', category: 'ppf', order: 4,
      imageUrl: `${base}photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
      altText: 'Mercedes AMG GT with Full Body PPF',
      overlayTitle: 'Mercedes AMG GT',
      overlaySubtitle: 'Full Body PPF',
    },
    {
      _id: 'gallery-05', _type: 'galleryItem', category: 'interior', order: 5,
      imageUrl: `${base}photo-1503736334956-4c8f8e92946d?w=800&q=80`,
      altText: 'Audi A6 interior after deep clean and leather care',
      overlayTitle: 'Audi A6',
      overlaySubtitle: 'Interior Deep Clean & Leather Care',
    },
    {
      _id: 'gallery-06', _type: 'galleryItem', category: 'performance', order: 6,
      imageUrl: `${base}photo-1494976388531-d1058494cdd8?w=800&q=80`,
      altText: 'Ford Mustang with Body Kit and Custom Exhaust',
      overlayTitle: 'Ford Mustang',
      overlaySubtitle: 'Body Kit + Custom Exhaust',
    },
    {
      _id: 'gallery-07', _type: 'galleryItem', category: 'ceramic', order: 7,
      imageUrl: `${base}photo-1542362567-b07e54358753?w=800&q=80`,
      altText: 'Audi RS5 after 9H Ceramic Coating',
      overlayTitle: 'Audi RS5',
      overlaySubtitle: '9H Ceramic Coating',
    },
    {
      _id: 'gallery-08', _type: 'galleryItem', category: 'wrap', order: 8,
      imageUrl: `${base}photo-1583121274602-3e2820c69888?w=800&q=80`,
      altText: 'Range Rover with Matte Grey Full Wrap and Chrome Delete',
      overlayTitle: 'Range Rover',
      overlaySubtitle: 'Matte Grey Full Wrap + Chrome Delete',
    },
    {
      _id: 'gallery-09', _type: 'galleryItem', category: 'detailing', order: 9,
      imageUrl: `${base}photo-1619405399517-d7fce0f13302?w=800&q=80`,
      altText: 'BMW M4 after Multi-Stage Paint Correction',
      overlayTitle: 'BMW M4',
      overlaySubtitle: 'Multi-Stage Paint Correction',
    },
    {
      _id: 'gallery-10', _type: 'galleryItem', category: 'ppf', order: 10,
      imageUrl: `${base}photo-1580273916550-e323be2ae537?w=800&q=80`,
      altText: 'Tesla Model 3 with Full Front PPF',
      overlayTitle: 'Tesla Model 3',
      overlaySubtitle: 'Full Front PPF',
    },
    {
      _id: 'gallery-11', _type: 'galleryItem', category: 'interior', order: 11,
      imageUrl: `${base}photo-1605559424843-9e4c228bf1c2?w=800&q=80`,
      altText: 'Hyundai Creta with Custom Nappa Leather Seat Covers',
      overlayTitle: 'Hyundai Creta',
      overlaySubtitle: 'Custom Nappa Leather Seat Covers',
    },
    {
      _id: 'gallery-12', _type: 'galleryItem', category: 'performance', order: 12,
      imageUrl: `${base}photo-1568605117036-5fe5e7bab0b7?w=800&q=80`,
      altText: 'VW Polo GT with ECU Stage 2 and Custom Exhaust',
      overlayTitle: 'VW Polo GT',
      overlaySubtitle: 'ECU Stage 2 + Custom Exhaust',
    },
  ])
}

// ─── 10. Before & After Sliders ───────────────────────────────────────────────

async function seedBeforeAfterSliders() {
  console.log('[sliders] Before & After Sliders')
  const base = 'https://images.unsplash.com/'
  await upsertMany([
    {
      _id: 'slider-home-01',
      _type: 'beforeAfterSlider',
      caption: 'Paint Correction & Detailing',
      placement: 'home',
      beforeImageUrl: `${base}photo-1520340356584-f9917d1eea6f?w=900&q=80`,
      beforeAlt: 'Car before detailing',
      afterImageUrl: `${base}photo-1503376780353-7e6692767b70?w=900&q=80`,
      afterAlt: 'Car after detailing',
      order: 1,
    },
    {
      _id: 'slider-gallery-01',
      _type: 'beforeAfterSlider',
      caption: 'BMW 7 Series — Full Detail + Graphene Ceramic Coating',
      placement: 'gallery',
      beforeImageUrl: `${base}photo-1520340356584-f9917d1eea6f?w=900&q=80`,
      beforeAlt: 'BMW 7 Series before detailing',
      afterImageUrl: `${base}photo-1503376780353-7e6692767b70?w=900&q=80`,
      afterAlt: 'BMW 7 Series after graphene ceramic coating',
      order: 1,
    },
    {
      _id: 'slider-gallery-02',
      _type: 'beforeAfterSlider',
      caption: 'Porsche 911 — Satin Black Full Body Wrap',
      placement: 'gallery',
      beforeImageUrl: `${base}photo-1619405399517-d7fce0f13302?w=900&q=80`,
      beforeAlt: 'Porsche 911 before wrapping',
      afterImageUrl: `${base}photo-1544636331-e26879cd4d9b?w=900&q=80`,
      afterAlt: 'Porsche 911 after satin black wrap',
      order: 2,
    },
  ])
}

// ─── 11. Team Members ─────────────────────────────────────────────────────────

async function seedTeamMembers() {
  console.log('[team] Team Members')
  await upsertMany([
    {
      _id: 'team-01',
      _type: 'teamMember',
      name: 'Amit Verma',
      initials: 'AV',
      role: 'Founder & CEO',
      bio: 'A car nut since age 10, Amit has 12+ years of experience in the automotive aftermarket. He founded CCC with a vision to make world-class car care accessible across India.',
      order: 1,
    },
    {
      _id: 'team-02',
      _type: 'teamMember',
      name: 'Sneha Reddy',
      initials: 'SR',
      role: 'Head of Operations',
      bio: 'The logistics wizard behind CCC\'s pan-India doorstep network. Sneha ensures every booking runs on time, every team is equipped, and every customer is delighted.',
      order: 2,
    },
    {
      _id: 'team-03',
      _type: 'teamMember',
      name: 'Rajesh Joshi',
      initials: 'RJ',
      role: 'Lead Detailer & Trainer',
      bio: 'Gtechniq & XPEL certified with 5,000+ cars detailed. Rajesh leads CCC\'s quality standards and trains every technician to deliver flawless finishes.',
      order: 3,
    },
  ])
}

// ─── 12. Stats ────────────────────────────────────────────────────────────────

async function seedStats() {
  console.log('[stats] Stats')
  await upsertMany([
    { _id: 'stat-01', _type: 'stat', value: 15000, suffix: '+', label: 'Cars Detailed', order: 1 },
    { _id: 'stat-02', _type: 'stat', value: 50, suffix: '+', label: 'Cities Served', order: 2 },
    { _id: 'stat-03', _type: 'stat', value: 8, suffix: '+', label: 'Years Experience', order: 3 },
    { _id: 'stat-04', _type: 'stat', value: 12000, suffix: '+', label: 'Happy Customers', order: 4 },
  ])
}

// ─── 13. FAQ ──────────────────────────────────────────────────────────────────

async function seedFaqs() {
  console.log('[faqs] FAQs')
  await upsertMany([
    {
      _id: 'faq-01',
      _type: 'faqItem',
      question: 'How long does ceramic coating last?',
      answer:
        'Our 9H ceramic coating lasts 3–5 years with proper maintenance. The premium graphene variant lasts up to 7 years. Both come with a service warranty.',
      order: 1,
    },
    {
      _id: 'faq-02',
      _type: 'faqItem',
      question: 'Do you really come to my city?',
      answer:
        'Yes! We serve 50+ cities across India with our mobile doorstep service. Travel charges may apply for locations outside Delhi NCR. Call us to confirm availability in your area.',
      order: 2,
    },
    {
      _id: 'faq-03',
      _type: 'faqItem',
      question: 'What products do you use?',
      answer:
        'We only use certified premium brands: Gtechniq, XPEL, 3M, Avery Dennison, Gyeon, and Rupes. No cheap substitutes — ever.',
      order: 3,
    },
    {
      _id: 'faq-04',
      _type: 'faqItem',
      question: 'How much does full detail + ceramic coating cost?',
      answer:
        'Our Premium Package starts at ₹18,999 for a sedan and ₹24,999 for an SUV. This includes single-stage paint correction + 9H ceramic coating + more.',
      order: 4,
    },
    {
      _id: 'faq-05',
      _type: 'faqItem',
      question: 'Is PPF worth it?',
      answer:
        'Absolutely. We use XPEL Ultimate Plus — a self-healing, optically clear film that protects against stone chips, scratches, and UV damage. It comes with a 10-year manufacturer warranty.',
      order: 5,
    },
  ])
}

// ─── 14. Service Areas ────────────────────────────────────────────────────────

async function seedServiceAreas() {
  console.log('[areas] Service Areas')
  const areas: Record<string, unknown>[] = [
    // North
    { _id: 'area-n-01', region: 'north', cityName: 'Delhi NCR', isHQ: true, order: 1 },
    { _id: 'area-n-02', region: 'north', cityName: 'Gurgaon', isHQ: false, order: 2 },
    { _id: 'area-n-03', region: 'north', cityName: 'Noida', isHQ: false, order: 3 },
    { _id: 'area-n-04', region: 'north', cityName: 'Chandigarh', isHQ: false, order: 4 },
    { _id: 'area-n-05', region: 'north', cityName: 'Jaipur', isHQ: false, order: 5 },
    { _id: 'area-n-06', region: 'north', cityName: 'Lucknow', isHQ: false, order: 6 },
    { _id: 'area-n-07', region: 'north', cityName: 'Dehradun', isHQ: false, order: 7 },
    // West
    { _id: 'area-w-01', region: 'west', cityName: 'Mumbai', isHQ: false, order: 1 },
    { _id: 'area-w-02', region: 'west', cityName: 'Pune', isHQ: false, order: 2 },
    { _id: 'area-w-03', region: 'west', cityName: 'Ahmedabad', isHQ: false, order: 3 },
    { _id: 'area-w-04', region: 'west', cityName: 'Surat', isHQ: false, order: 4 },
    { _id: 'area-w-05', region: 'west', cityName: 'Goa', isHQ: false, order: 5 },
    { _id: 'area-w-06', region: 'west', cityName: 'Nagpur', isHQ: false, order: 6 },
    { _id: 'area-w-07', region: 'west', cityName: 'Indore', isHQ: false, order: 7 },
    // South
    { _id: 'area-s-01', region: 'south', cityName: 'Bangalore', isHQ: false, order: 1 },
    { _id: 'area-s-02', region: 'south', cityName: 'Hyderabad', isHQ: false, order: 2 },
    { _id: 'area-s-03', region: 'south', cityName: 'Chennai', isHQ: false, order: 3 },
    { _id: 'area-s-04', region: 'south', cityName: 'Kochi', isHQ: false, order: 4 },
    { _id: 'area-s-05', region: 'south', cityName: 'Coimbatore', isHQ: false, order: 5 },
    { _id: 'area-s-06', region: 'south', cityName: 'Visakhapatnam', isHQ: false, order: 6 },
    // East
    { _id: 'area-e-01', region: 'east', cityName: 'Kolkata', isHQ: false, order: 1 },
    { _id: 'area-e-02', region: 'east', cityName: 'Patna', isHQ: false, order: 2 },
    { _id: 'area-e-03', region: 'east', cityName: 'Bhubaneswar', isHQ: false, order: 3 },
    { _id: 'area-e-04', region: 'east', cityName: 'Ranchi', isHQ: false, order: 4 },
    { _id: 'area-e-05', region: 'east', cityName: 'Guwahati', isHQ: false, order: 5 },
  ]
  await upsertMany(areas.map((a) => ({ ...a, _type: 'serviceArea' })))
}

// ─── 15. Why Choose Us ────────────────────────────────────────────────────────

async function seedWhyChooseUs() {
  console.log('[why] Why Choose Us')
  await upsertMany([
    {
      _id: 'why-01',
      _type: 'whyChooseUs',
      icon: 'award',
      title: 'Certified Experts',
      description: 'Our technicians are certified and trained in the latest detailing and coating techniques.',
      order: 1,
    },
    {
      _id: 'why-02',
      _type: 'whyChooseUs',
      icon: 'map-pin',
      title: 'Doorstep Service',
      description: 'We come to you — home, office, or anywhere across 50+ cities in India.',
      order: 2,
    },
    {
      _id: 'why-03',
      _type: 'whyChooseUs',
      icon: 'shield',
      title: 'Premium Products',
      description: 'We use only globally trusted brands — XPEL, 3M, Gtechniq, and more.',
      order: 3,
    },
    {
      _id: 'why-04',
      _type: 'whyChooseUs',
      icon: 'clock',
      title: 'On-Time Delivery',
      description: 'We respect your schedule. Confirmed slots, no delays, no surprises.',
      order: 4,
    },
    {
      _id: 'why-05',
      _type: 'whyChooseUs',
      icon: 'star',
      title: '5,000+ Happy Clients',
      description: 'A track record built on referrals, reviews, and repeat customers.',
      order: 5,
    },
    {
      _id: 'why-06',
      _type: 'whyChooseUs',
      icon: 'check-circle',
      title: 'Satisfaction Guarantee',
      description: "We don't leave until you're 100% satisfied with the work done.",
      order: 6,
    },
  ])
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[start] Starting CCC seed — project w4fgl3xy / production\n')
  try {
    await seedSiteSettings()
    await seedBusinessHours()
    await seedHomePage()
    await seedPageContent()
    await seedServiceCategories()
    await seedServices()
    await seedServicePackages()
    await seedTestimonials()
    await seedGalleryItems()
    await seedBeforeAfterSliders()
    await seedTeamMembers()
    await seedStats()
    await seedFaqs()
    await seedServiceAreas()
    await seedWhyChooseUs()
    console.log('\n[done] Seed complete! All documents created/updated in Sanity.')
  } catch (err) {
    console.error('\n[ERROR] Seed failed:', err)
    process.exit(1)
  }
}

main()
