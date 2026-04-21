import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceArea',
  title: 'Service Area',
  type: 'document',
  fields: [
    defineField({ name: 'cityName', title: 'City Name', type: 'string' }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'North India', value: 'north' },
          { title: 'West India', value: 'west' },
          { title: 'South India', value: 'south' },
          { title: 'East India', value: 'east' },
        ],
      },
    }),
    defineField({
      name: 'isHQ',
      title: 'Is Headquarters City',
      type: 'boolean',
    }),
    defineField({
      name: 'order',
      title: 'Display Order (within region)',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Region then Order',
      name: 'regionOrder',
      by: [
        { field: 'region', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'cityName', subtitle: 'region' },
  },
})
