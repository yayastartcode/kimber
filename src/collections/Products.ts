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
    // Add afterChange hook to handle proper redirection
    afterChange: [
      ({ doc }) => {
        // Ensure we're returning the document as is
        // Let Payload handle the redirection based on its internal ID
        return doc;
      },
    ],
  },
  // The versions functionality might be contributing to the redirect issue
  // Let's temporarily disable it to see if it resolves the problem
  // versions: {
  //   drafts: true,
  // },
  fields: [
    {
      name: 'productId',
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
              name: 'discountedPrice',
              type: 'number',
              required: false,
              min: 0,
              admin: {
                description: 'Optional: discounted price (leave empty if no discount)',
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
              admin: {
                description: 'This will be the primary image shown in product listings and at the top of the product detail page',
              }
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
                  admin: {
                    description: 'Additional product images for the gallery - will be shown as thumbnails',
                  }
                },
                {
                  name: 'alt',
                  type: 'text',
                  required: true,
                  label: 'Alt Text',
                  admin: {
                    description: 'Alternative text for accessibility (required)',
                  },
                },
                {
                  name: 'isFeature',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Feature in carousel',
                  admin: {
                    description: 'Check this to highlight this image in product carousels',
                  }
                },
              ],
              admin: {
                description: 'Add additional product images to display in the gallery on the product detail page. Upload multiple angles and closeups for best user experience.',
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
                description: 'Product specifications (e.g., dimensions, materials, etc.)',
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
    {
      name: 'stock',
      type: 'number',
      defaultValue: 100,
      min: 0,
      admin: {
        description: 'Number of items in stock',
        position: 'sidebar',
      },
    },
    {
      name: 'reference',
      type: 'text',
      admin: {
        description: 'Product reference or SKU',
        position: 'sidebar',
      },
    },
  ],
}

