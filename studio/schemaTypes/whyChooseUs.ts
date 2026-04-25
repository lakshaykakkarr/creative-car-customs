import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us',
  type: 'document',
  fields: [
    defineField({ name: 'icon', title: 'Lucide Icon Name (e.g. shield, award, clock)', type: 'string' }),
    defineField({ name: 'title', title: 'Card Title', type: 'string' }),
    defineField({ name: 'description', title: 'Card Description', type: 'text', rows: 3 }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title, subtitle }
    },
  },
})
