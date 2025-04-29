import { CollectionConfig } from 'payload'

export const CompanyValues: CollectionConfig = {
  slug: 'company-values',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Company Values',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
    },
    {
      name: 'values',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Company values and advantages',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
  ],

}
