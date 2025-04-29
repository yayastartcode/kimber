import { CollectionConfig } from 'payload'

export const Hero: CollectionConfig = {
  slug: 'hero',
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
      defaultValue: 'Hero Section',
    },
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Slides for the hero carousel',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Image Alt Text',
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
      ],
    },
    {
      name: 'autoPlaySpeed',
      type: 'number',
      required: true,
      defaultValue: 5000,
      admin: {
        description: 'Auto-play speed in milliseconds (e.g., 5000 = 5 seconds)',
      },
    },
  ],

}
