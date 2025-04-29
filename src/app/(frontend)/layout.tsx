import React from 'react';
import './styles.css';
import { Metadata } from 'next';
import WhatsAppButtonClient from './components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'PT Wahana Jaya Dinamika - Motor & Pneumatic Vibrator Specialist',
  description: 'PT Wahana Jaya Dinamika - Motor & Pneumatic Vibrator Specialist PT Wahjadi Concrete internal vibrator motor & gear box rubber suspension',
  keywords: 'motor, pneumatic, vibrator, industrial equipment, supplier, Indonesia, industrial solutions',
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
