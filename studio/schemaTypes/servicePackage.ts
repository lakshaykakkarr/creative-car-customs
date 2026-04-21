import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicePackage',
  title: 'Service Package',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Package Name', type: 'string' }),
    defineField({ name: 'price', title: 'Price (₹)', type: 'number' }),
    defineField({
      name: 'priceUnit',
      title: 'Price Unit',
      type: 'string',
      description: 'e.g. "/session" or "/year"',
    }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 2 }),
    defineField({
      name: 'features',
      title: 'Included Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured / Highlighted',
      type: 'boolean',
      description: 'Shows as the recommended/popular package',
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
    select: { title: 'name', subtitle: 'price' },
    prepare({ title, subtitle }: { title: string; subtitle: number }) {
      return { title, subtitle: subtitle ? `₹${subtitle.toLocaleString('en-IN')}` : '' }
    },
  },
})
