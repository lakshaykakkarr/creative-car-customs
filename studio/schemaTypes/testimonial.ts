import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Review', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Discarded', value: 'discarded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      description: 'Only "Approved" testimonials are shown on the website.',
    }),
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
    defineField({ name: 'serviceReceived', title: 'Service Received', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      description: 'When the customer submitted this feedback.',
    }),
    defineField({
      name: 'email',
      title: 'Email (Private)',
      type: 'string',
      description: 'Internal only — not displayed on the website.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone (Private)',
      type: 'string',
      description: 'Internal only — not displayed on the website.',
    }),
    defineField({
      name: 'adminNote',
      title: 'Admin Note',
      type: 'text',
      rows: 2,
      description: 'Internal memo — not displayed on the website.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Submitted (Newest First)',
      name: 'submittedDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'reviewerName', subtitle: 'status', city: 'city' },
    prepare({ title, subtitle, city }) {
      const statusLabel = subtitle === 'approved' ? 'Approved' : subtitle === 'discarded' ? 'Discarded' : 'Pending';
      return { title: title || 'Unnamed', subtitle: `[${statusLabel}]${city ? ' — ' + city : ''}` };
    },
  },
})
