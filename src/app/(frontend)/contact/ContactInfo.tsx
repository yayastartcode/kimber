"use client";

import React, { useState, useEffect } from 'react'
import Wasap from '../components/Wasap'

interface ContactData {
  companyName: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

const ContactInfo = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        const data = await response.json();
        setContactData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact data');
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="text-center text-red-600 py-8">
        Unable to load contact information. Please try again later.
      </div>
    );
  }

  const { contactInfo } = contactData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Address Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start">
          <div className="mr-6 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Address</h3>
            <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
          </div>
        </div>
      </div>

      {/* Phone Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start">
          <div className="mr-6 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h3>
            <p className="text-gray-600">
              <a href={`tel:${contactInfo.phone}`} className="hover:text-red-600 transition-colors">
                {contactInfo.phone}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Email Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start">
          <div className="mr-6 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Address</h3>
            <p className="text-gray-600">
              <a href={`mailto:${contactInfo.email}`} className="hover:text-red-600 transition-colors">
                {contactInfo.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Card */}
      {contactInfo.whatsapp && (
        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start">
            <div className="mr-6 text-green-500">
              <Wasap size={48} color="#4CAF50" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-3">{contactInfo.whatsapp}</p>
              <a 
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Chat with Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactInfo
