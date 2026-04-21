import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'stat',
  title: 'Stat',
  type: 'document',
  fields: [
    defineField({ name: 'value', title: 'Value (number)', type: 'number' }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'e.g. "+" or "k". Leave empty for plain number.',
    }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
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
    select: { title: 'label', subtitle: 'value' },
  },
})
