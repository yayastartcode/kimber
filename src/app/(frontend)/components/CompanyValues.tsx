"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface ValueItem {
  title: string;
  description: string;
  icon?: {
    url: string;
    alt?: string;
  };
}

interface CompanyValuesData {
  title: string;
  subtitle?: string;
  values: ValueItem[];
}

// Value card component for reusability
const ValueCard = ({ 
  icon, 
  bgColor = 'bg-white', 
  textColor = 'text-gray-800',
  title, 
  description 
}: { 
  icon: React.ReactNode, 
  bgColor?: string, 
  textColor?: string,
  title: string, 
  description: string 
}) => {
  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-md flex flex-col items-center h-full`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-center mb-2">{title}</h3>
      <p className="text-center text-sm">{description}</p>
    </div>
  )
}

const CompanyValues = () => {
  const [companyValuesData, setCompanyValuesData] = useState<CompanyValuesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyValuesData = async () => {
      try {
        const response = await fetch('/api/company-values');
        if (!response.ok) {
          throw new Error('Failed to fetch company values data');
        }
        const data = await response.json();
        setCompanyValuesData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company values data:', err);
        setError('Failed to load company values data');
        setLoading(false);
      }
    };

    fetchCompanyValuesData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 p-6 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  // Default background colors for cards if not specified in CMS data
  const bgColors = ['bg-blue-50', 'bg-red-600', 'bg-red-600', 'bg-gray-100'];
  const textColors = ['text-gray-800', 'text-white', 'text-white', 'text-gray-800'];

  // Default icons if not provided in CMS data
  const defaultIcons = [
    <svg key="icon1" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>,
    <svg key="icon2" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>,
    <svg key="icon3" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>,
    <svg key="icon4" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center mb-12">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">{companyValuesData?.title || 'Our advantages'}</h2>
            {companyValuesData?.subtitle && (
              <p className="text-red-600 font-semibold mt-2">{companyValuesData.subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValuesData?.values ? (
            companyValuesData.values.map((value, index) => {
              // Use custom icon from CMS if available, otherwise use default icon
              const iconElement = value.icon ? (
                <Image 
                  src={value.icon.url} 
                  alt={value.icon.alt || value.title} 
                  width={48} 
                  height={48} 
                  className="h-12 w-12"
                />
              ) : defaultIcons[index % defaultIcons.length];
              
              return (
                <ValueCard 
                  key={index}
                  icon={iconElement}
                  bgColor={bgColors[index % bgColors.length]}
                  textColor={textColors[index % textColors.length]}
                  title={value.title}
                  description={value.description}
                />
              );
            })
          ) : (
            // Fallback values if no CMS data is available
            <>
              <ValueCard 
                icon={defaultIcons[0]}
                bgColor="bg-blue-50"
                textColor="text-gray-800"
                title="Multiple solutions to meet diverse needs"
                description="We provide customized solutions for various industrial applications."
              />
              
              <ValueCard 
                icon={defaultIcons[1]}
                bgColor="bg-red-600"
                textColor="text-white"
                title="Possess high technical development design"
                description="OEM processing capabilities with advanced technical expertise."
              />
              
              <ValueCard 
                icon={defaultIcons[2]}
                bgColor="bg-red-600"
                textColor="text-white"
                title="Professional and timely pre-sales and after-sales service"
                description="Dedicated support throughout the entire customer journey."
              />
              
              <ValueCard 
                icon={defaultIcons[3]}
                bgColor="bg-gray-100"
                textColor="text-gray-800"
                title="Our company always focus on technology improvement"
                description="Continuous innovation and advancement in our technical capabilities."
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default CompanyValues
