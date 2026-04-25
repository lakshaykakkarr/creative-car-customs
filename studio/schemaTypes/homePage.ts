import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // Meta
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
    defineField({ name: 'ogTitle', title: 'OG / Social Share Title', type: 'string' }),
    defineField({ name: 'ogDescription', title: 'OG / Social Share Description', type: 'text', rows: 2 }),

    // Hero
    defineField({ name: 'heroBadge', title: 'Hero Badge Text', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Hero Title (plain part)', type: 'string' }),
    defineField({ name: 'heroTitleAccent', title: 'Hero Title Accent (bold part)', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageUrl',
      title: 'Hero Image URL (External)',
      type: 'url',
    }),
    defineField({ name: 'heroCta1Text', title: 'CTA Button 1 Text', type: 'string' }),
    defineField({ name: 'heroCta1Url', title: 'CTA Button 1 URL (e.g. contact.html)', type: 'string' }),
    defineField({ name: 'heroCta2Text', title: 'CTA Button 2 Text', type: 'string' }),
    defineField({ name: 'heroCta2Url', title: 'CTA Button 2 URL (e.g. services.html)', type: 'string' }),

    // Services Section
    defineField({ name: 'servicesSectionLabel', title: 'Services Section Label', type: 'string' }),
    defineField({ name: 'servicesSectionTitle', title: 'Services Section Title', type: 'string' }),
    defineField({
      name: 'servicesSectionDesc',
      title: 'Services Section Description',
      type: 'text',
      rows: 2,
    }),

    // Before/After Section
    defineField({ name: 'sliderSectionLabel', title: 'Slider Section Label', type: 'string' }),
    defineField({ name: 'sliderSectionTitle', title: 'Slider Section Title', type: 'string' }),
    defineField({ name: 'sliderSectionDesc', title: 'Slider Section Description', type: 'text', rows: 2 }),

    // Stats Section
    defineField({ name: 'statsSectionLabel', title: 'Stats Section Label', type: 'string' }),
    defineField({ name: 'statsSectionTitle', title: 'Stats Section Title', type: 'string' }),
    defineField({ name: 'statsSectionDesc', title: 'Stats Section Description', type: 'text', rows: 2 }),

    // Testimonials Section
    defineField({
      name: 'testimonialsSectionLabel',
      title: 'Testimonials Section Label',
      type: 'string',
    }),
    defineField({
      name: 'testimonialsSectionTitle',
      title: 'Testimonials Section Title',
      type: 'string',
    }),
    defineField({
      name: 'testimonialsSectionDesc',
      title: 'Testimonials Section Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
