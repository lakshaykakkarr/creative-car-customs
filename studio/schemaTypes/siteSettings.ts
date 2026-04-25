import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload a logo to replace the default SVG icon in the navbar. Recommended: transparent PNG or SVG, min 80px tall.',
      options: { hotspot: false },
    }),
    defineField({ name: 'brandName', title: 'Brand Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'footerBlurb',
      title: 'Footer Blurb',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number (with country code, no +)',
      type: 'string',
      description: 'e.g. 919876543210',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Default Message',
      type: 'string',
    }),
    defineField({ name: 'email', title: 'Email Address', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
    defineField({ name: 'foundedYear', title: 'Founded Year', type: 'number' }),
    defineField({ name: 'copyrightYear', title: 'Copyright Year', type: 'number' }),
    defineField({ name: 'serviceCount', title: 'Total Service Count', type: 'number' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'brandName' },
  },
})
