import { CollectionConfig } from 'payload'

export const AboutUs: CollectionConfig = {
  slug: 'about-us',
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
      defaultValue: 'About Us',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imageAlt',
      type: 'text',
      required: true,
      label: 'Image Alt Text',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: false,
    },
    {
      name: 'buttonUrl',
      type: 'text',
      required: false,
      admin: {
        condition: (data) => Boolean(data?.buttonText),
      },
    },
  ],

}
