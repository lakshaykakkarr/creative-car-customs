import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Detailing & Cleaning', value: 'detailing' },
          { title: 'Paint & Protection', value: 'protection' },
          { title: 'Wrapping & Aesthetics', value: 'wrapping' },
          { title: 'Performance', value: 'performance' },
          { title: 'Tech & Accessories', value: 'tech' },
          { title: 'Maintenance & Value', value: 'maintenance' },
        ],
      },
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price (₹)',
      type: 'number',
      description: 'Leave empty if free / consultation-based',
    }),
    defineField({
      name: 'priceLabel',
      title: 'Price Suffix',
      type: 'string',
      description: 'e.g. "/year" or "/month". Leave empty for one-time price.',
    }),
    defineField({
      name: 'isFree',
      title: 'Free / Free Consultation',
      type: 'boolean',
    }),
    defineField({ name: 'isPopular', title: 'Mark as Popular', type: 'boolean' }),
    defineField({ name: 'order', title: 'Display Order (within category)', type: 'number' }),
  ],
  orderings: [
    {
      title: 'Category then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
