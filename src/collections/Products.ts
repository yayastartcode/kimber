import { CollectionConfig } from 'payload'
import { slugifyField } from '../utilities/slugifyField';

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'price', 'featured', 'updatedAt'],
    group: 'Shop',
  },
  hooks: {
    beforeValidate: [
      // Generate slug from title
      slugifyField({
        source: 'title',
        target: 'slug',
      }),
    ],
  },
  // The versions functionality might be contributing to the redirect issue
  // Let's temporarily disable it to see if it resolves the problem
  // versions: {
  //   drafts: true,
  // },
  fields: [
    {
      name: 'id',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'brand',
              type: 'text',
              required: true,
              admin: {
                description: 'The brand or manufacturer of the product',
              },
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Product price in USD',
                step: 0.01,
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
            },
            {
              name: 'category',
              type: 'text',
              required: false,
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Main Product Image',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Product Gallery',
              minRows: 0,
              maxRows: 10,
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              fields: [
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
                  label: 'Alt Text',
                  admin: {
                    description: 'Alternative text for accessibility',
                  },
                },
                {
                  name: 'isFeature',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Feature in carousel',
                },
              ],
              admin: {
                description: 'Add additional product images to the gallery',
              },
            },
          ],
        },
        {
          label: 'Specifications',
          fields: [
            {
              name: 'specifications',
              type: 'array',
              required: false,
              admin: {
                description: 'Product specifications',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title. You can manually edit this if needed.',
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Product',
      admin: {
        description: 'Featured products will be displayed in the Recommended Products section',
        position: 'sidebar',
      },
    },
  ],
}

