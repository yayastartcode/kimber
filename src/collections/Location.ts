import { CollectionConfig } from 'payload'

export const Location: CollectionConfig = {
  slug: 'location',
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
      defaultValue: 'Our Location',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Google Maps embed URL (e.g., https://www.google.com/maps/embed?pb=...)',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
  ],

}
