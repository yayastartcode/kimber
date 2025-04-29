"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Client {
  id: string;
  name: string;
  logo: {
    url: string;
    alt?: string;
  };
  website?: string;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Fallback client data in case CMS data is not available
  const fallbackClients = [
    { id: '1', name: 'BCA', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png' } },
    { id: '2', name: 'Pertamina', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Pertamina_logo.svg/2560px-Pertamina_logo.svg.png' } },
    { id: '3', name: 'PLN', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.png' } },
    { id: '4', name: 'MNC Pictures', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/MNC_Pictures.svg/2560px-MNC_Pictures.svg.png' } },
    { id: '5', name: 'RCTI', logo: { url: 'https://upload.wikimedia.org/wikipedia/id/thumb/d/dd/RCTI_logo_2015.svg/1280px-RCTI_logo_2015.svg.png' } },
    { id: '6', name: 'Mitsubishi Motors', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_Motors_logo.svg/2560px-Mitsubishi_Motors_logo.svg.png' } },
    { id: '7', name: 'Telkomsel', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Telkomsel_2021_icon.svg/2048px-Telkomsel_2021_icon.svg.png' } },
    { id: '8', name: 'Shinhan Securities', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Shinhan_Financial_Group_logo.svg/1200px-Shinhan_Financial_Group_logo.svg.png' } },
    { id: '9', name: 'Grapelindo', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Grab_Logo.svg/2560px-Grab_Logo.svg.png' } },
    { id: '10', name: 'Nestle', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nestl%C3%A9.svg/2560px-Nestl%C3%A9.svg.png' } },
    { id: '11', name: 'Newmont', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Newmont_Corporation_Logo.svg/1200px-Newmont_Corporation_Logo.svg.png' } },
    { id: '12', name: 'NYK Group', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/NYK_Line_logo.svg/2560px-NYK_Line_logo.svg.png' } }
  ];

  // Use CMS data if available, otherwise use fallback
  const displayClients = clients.length > 0 ? clients : fallbackClients;

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block">
              Our <span className="text-red-600">Clients</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Loading clients...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error in ClientList component:', error);
    // Continue with fallback clients
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold inline-block">
            Our <span className="text-red-600">Clients</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayClients.map(client => (
            <div 
              key={client.id} 
              className="border border-gray-200 rounded-md p-4 flex items-center justify-center h-40 transition-all hover:shadow-md"
            >
              <div className="relative w-full h-full">
                <Image 
                  src={client.logo.url} 
                  alt={`${client.name} logo`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  style={{ objectFit: 'contain' }}
                  className="p-2"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientList
