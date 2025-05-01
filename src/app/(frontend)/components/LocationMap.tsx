"use client";

import React, { useState, useEffect } from 'react'
import Wasap from './Wasap';

interface LocationData {
  title: string;
  description?: string;
  mapEmbedUrl: string;
  address: string;
  phone: string;
  email: string;
  whatsapp?: string;
}

interface SiteSettingsData {
  contactInfo: {
    whatsapp?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

const LocationMap = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationResponse, settingsResponse] = await Promise.all([
          fetch('/api/location?limit=1'),
          fetch('/api/site-settings?limit=1')
        ]);

        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location data');
        }
        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch site settings');
        }

        const [locationData, settingsData]: [PayloadResponse<LocationData>, PayloadResponse<SiteSettingsData>] = await Promise.all([
          locationResponse.json(),
          settingsResponse.json()
        ]);

        setLocationData(locationData.docs[0] || null);
        setSiteSettings(settingsData.docs[0] || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // No fallback data - we'll handle missing data gracefully
  const displayLocation = locationData;
  const whatsappNumber = siteSettings?.contactInfo?.whatsapp;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block">
              Our <span className="text-red-600">Location</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Loading location data...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !displayLocation) {
    console.error('Error in LocationMap component:', error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block">
              Our <span className="text-red-600">Location</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="text-gray-500">Location information is currently unavailable.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold inline-block">
            Our <span className="text-red-600">Location</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            {displayLocation.description}
          </p>
        </div>
        
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-md">
          <iframe 
            src={displayLocation.mapEmbedUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location Map"
            className="w-full h-full"
            aria-label="Google Maps showing our company location"
          />
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="mr-4 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">{displayLocation.address}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="mr-4 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">{displayLocation.phone}</p>
            </div>
          </div>
          
          {whatsappNumber && (
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="mr-4 text-red-600">
              <Wasap size={32} color="#4CAF50" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600"
                >
                  {whatsappNumber}
                </a>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="mr-4 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">{displayLocation.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationMap
