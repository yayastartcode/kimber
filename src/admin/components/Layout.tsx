'use client';

import { ReactNode } from 'react';
// Import as any to avoid type errors
// @ts-ignore
import { DefaultTemplate } from 'payload/components/templates';
import RedirectFix from './RedirectFix';

/**
 * Custom admin layout that includes the RedirectFix component to handle
 * the redirect issue with newly created products.
 */
const AdminLayout = (props: { children: ReactNode }) => {
  return (
    <DefaultTemplate>
      <RedirectFix />
      {props.children}
    </DefaultTemplate>
  );
};

export default AdminLayout; 