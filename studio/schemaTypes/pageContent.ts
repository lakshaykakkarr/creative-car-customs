import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Services', value: 'services' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Service Areas', value: 'areas' },
          { title: 'Contact', value: 'contact' },
        ],
      },
    }),

    // SEO
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),

    // Page Hero
    defineField({ name: 'heroHeading', title: 'Hero Heading (plain part)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading Accent (bold part)', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 2 }),

    // About page — Brand Story
    defineField({ name: 'storyLabel', title: '[About] Story Label', type: 'string' }),
    defineField({ name: 'storyTitle', title: '[About] Story Title', type: 'string' }),
    defineField({ name: 'storyTitleAccent', title: '[About] Story Title Accent', type: 'string' }),
    defineField({
      name: 'storyBody',
      title: '[About] Story Body (Rich Text)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'storyImage',
      title: '[About] Story Image (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'storyImageUrl',
      title: '[About] Story Image URL (External)',
      type: 'url',
    }),
    defineField({ name: 'missionText', title: '[About] Mission Text', type: 'text', rows: 3 }),
    defineField({ name: 'visionText', title: '[About] Vision Text', type: 'text', rows: 3 }),

    // CTA Banner (About / Gallery / Areas)
    defineField({ name: 'ctaBannerTitle', title: 'CTA Banner Title', type: 'string' }),
    defineField({ name: 'ctaBannerDesc', title: 'CTA Banner Description', type: 'text', rows: 2 }),
    defineField({ name: 'ctaBannerButtonText', title: 'CTA Banner Button Text', type: 'string' }),

    // Services page
    defineField({
      name: 'servicesHeroServiceCount',
      title: '[Services] Service Count in Hero',
      type: 'number',
    }),
    defineField({
      name: 'servicesFaqTitle',
      title: '[Services] FAQ Section Title',
      type: 'string',
    }),
    defineField({
      name: 'servicesProcessSteps',
      title: '[Services] Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', title: 'Step Number', type: 'number' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
        },
      ],
    }),

    // Areas page
    defineField({
      name: 'areasMapEmbedUrl',
      title: '[Areas] Google Maps Embed URL',
      type: 'url',
    }),

    // Contact page
    defineField({
      name: 'contactSuccessMessage',
      title: '[Contact] Form Success Message',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'page', subtitle: 'metaTitle' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title: `Page: ${title}`, subtitle }
    },
  },
})
