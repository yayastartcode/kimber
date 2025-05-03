import React from 'react';
import './styles.css';
import { Metadata } from 'next';
import WhatsAppButtonClient from './components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Kimsberlin - Opticals , Eyeglasses - Providing you the best eyeglasses solution Specialist',
  description: 'Kimsberlin - Opticals , Eyeglasses - Providing you the best eyeglasses solution Specialist',
  keywords: 'opticals, eyeglasses, glasses, sunglasses, contact lenses, eye care, eye health, eye care products, eye care solutions, eye care services, eye care products, eye care solutions, eye care services',
  robots: 'index, follow',
};

// Server component layout
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-sans overflow-x-hidden bg-white">
        {children}
        <WhatsAppButtonClient />
      </body>
    </html>
  );
};

export default Layout;
