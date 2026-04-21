import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'businessHours',
  title: 'Business Hours',
  type: 'document',
  fields: [
    defineField({
      name: 'dayLabel',
      title: 'Day / Day Range',
      type: 'string',
      description: 'e.g. "Mon–Fri" or "Sunday"',
    }),
    defineField({
      name: 'openTime',
      title: 'Open Time',
      type: 'string',
      description: 'e.g. "9:00 AM"',
    }),
    defineField({
      name: 'closeTime',
      title: 'Close Time',
      type: 'string',
      description: 'e.g. "7:00 PM"',
    }),
    defineField({
      name: 'isByAppointment',
      title: 'By Appointment Only',
      type: 'boolean',
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
    select: { title: 'dayLabel', subtitle: 'openTime' },
  },
})
