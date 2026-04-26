import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featuredBuild',
  title: 'Featured Build',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'vehicle',
      title: 'Vehicle',
      description: 'e.g. BMW M4 Competition',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. Full PPF + Ceramic',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'specs',
      title: 'Specs / Description',
      description: 'Short spec line shown on the build card',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'vehicle', subtitle: 'category', media: 'image' },
  },
})
