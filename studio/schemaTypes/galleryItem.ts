import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (External)',
      type: 'url',
      description: 'Use this if you prefer to link to an external image (e.g. Unsplash)',
    }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'overlayTitle', title: 'Overlay Title', type: 'string' }),
    defineField({
      name: 'overlaySubtitle',
      title: 'Overlay Subtitle',
      type: 'string',
      description: 'e.g. "Ceramic Coating"',
    }),
    defineField({
      name: 'category',
      title: 'Filter Category',
      type: 'string',
      options: {
        list: [
          { title: 'Detailing', value: 'detailing' },
          { title: 'Ceramic Coating', value: 'ceramic' },
          { title: 'PPF', value: 'ppf' },
          { title: 'Wrapping', value: 'wrap' },
          { title: 'Performance', value: 'performance' },
          { title: 'Interior', value: 'interior' },
        ],
      },
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'overlayTitle', subtitle: 'category', media: 'image' },
  },
})
