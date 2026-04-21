import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'reviewerName', title: 'Reviewer Name', type: 'string' }),
    defineField({
      name: 'initials',
      title: 'Initials',
      type: 'string',
      description: 'Shown in avatar, e.g. "RK"',
    }),
    defineField({ name: 'carMake', title: 'Car Make', type: 'string' }),
    defineField({ name: 'carModel', title: 'Car Model', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
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
    select: { title: 'reviewerName', subtitle: 'city' },
  },
})
