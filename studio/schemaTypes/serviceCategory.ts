import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceCategory',
  title: 'Service Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug / Anchor ID',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Used as the #anchor hash on the services page',
    }),
    defineField({ name: 'tabLabel', title: 'Tab Label', type: 'string' }),
    defineField({
      name: 'cardDescription',
      title: 'Card Description (Home Page)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon Emoji',
      type: 'string',
      description: 'Lucide icon name, e.g. droplets, shield, palette, zap, cpu, wrench',
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
    select: { title: 'title', subtitle: 'tabLabel' },
  },
})
