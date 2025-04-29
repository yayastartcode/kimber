import type { CollectionBeforeValidateHook } from 'payload';

type SlugifyFieldProps = {
  source: string;
  target: string;
};

/**
 * Converts a string to a URL-friendly slug
 * @param str The string to slugify
 * @returns A URL-friendly slug
 */
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * A hook that automatically generates a slug based on another field.
 * Used in the beforeValidate hook.
 */
export const slugifyField = ({ source, target }: SlugifyFieldProps): CollectionBeforeValidateHook => {
  return ({ data }) => {
    // Skip if no data is provided
    if (!data) return data;
    
    // Only set the slug when first creating the document (not on subsequent updates)
    // Or if the slug doesn't exist or is empty
    if (!data[target]) {
      if (data[source]) {
        data[target] = slugify(data[source]);
      }
    }

    // If the source field has changed and is not equal to the target
    // then update the slug
    if (data[source] && data[target] && slugify(data[source]) !== data[target]) {
      data[target] = slugify(data[source]);
    }

    return data;
  };
}; 