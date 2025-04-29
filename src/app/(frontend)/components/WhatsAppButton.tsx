"use client";

import React from 'react';
import Image from 'next/image';
import waIcon from "../../../../public/wea.svg";

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch site settings');
        }
        const data = await response.json();
        if (data.contactInfo?.whatsapp) {
          setWhatsappNumber(data.contactInfo.whatsapp);
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      }
    };

    fetchSiteSettings();
  }, []);

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <Image
        priority
        src={waIcon}
        width={40}
        height={40}
        alt="Whatsapp kami"
      />
    </a>
  );
};

export default WhatsAppButton;