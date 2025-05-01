import { CollectionConfig } from 'payload'

export const HowTo: CollectionConfig = {
  slug: 'how-to',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
      defaultValue: 'How To Section',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Steps for the How To section',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'explanation',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: false,
          admin: {
            description: 'Order in which this step appears (lower numbers appear first)',
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      required: false,
      defaultValue: 'bg-white',
      options: [
        {
          label: 'White',
          value: 'bg-white',
        },
        {
          label: 'Light Gray',
          value: 'bg-gray-50',
        },
        {
          label: 'Light Pink',
          value: 'bg-pink-50',
        },
      ],
    },
  ],
} 