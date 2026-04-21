import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'beforeAfterSlider',
  title: 'Before & After Slider',
  type: 'document',
  fields: [
    defineField({ name: 'caption', title: 'Caption / Title', type: 'string' }),
    defineField({
      name: 'placement',
      title: 'Page Placement',
      type: 'string',
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'Gallery Page', value: 'gallery' },
        ],
      },
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'beforeImageUrl',
      title: 'Before Image URL (External)',
      type: 'url',
    }),
    defineField({ name: 'beforeAlt', title: 'Before Image Alt Text', type: 'string' }),
    defineField({
      name: 'afterImage',
      title: 'After Image (Upload)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'afterImageUrl',
      title: 'After Image URL (External)',
      type: 'url',
    }),
    defineField({ name: 'afterAlt', title: 'After Image Alt Text', type: 'string' }),
    defineField({ name: 'order', title: 'Display Order (within placement)', type: 'number' }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'placement' },
  },
})
