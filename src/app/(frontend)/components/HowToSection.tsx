"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Step {
  id: string;
  title: string;
  explanation: string;
  icon: {
    url: string;
    alt?: string;
  };
  order?: number;
}

interface HowToData {
  title: string;
  subtitle?: string;
  steps: Step[];
  backgroundColor?: string;
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

// Step card component for reusability
const StepCard = ({ 
  icon, 
  title, 
  explanation 
}: { 
  icon: string, 
  title: string, 
  explanation: string 
}) => {
  return (
    <div className="group flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg p-6">
      <div className="mb-6 w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all">
        <Image 
          src={icon} 
          alt={title}
          width={80}
          height={80}
          className="p-2"
        />
      </div>
      <h3 className="text-2xl font-semibold mb-3 group-hover:text-red-600 transition-colors">{title}</h3>
      <p className="text-gray-600 group-hover:text-gray-800 transition-colors">{explanation}</p>
    </div>
  )
}

const HowToSection = () => {
  const [howToData, setHowToData] = useState<HowToData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHowToData = async () => {
      try {
        const response = await fetch('/api/how-to?limit=1');
        if (!response.ok) {
          throw new Error('Failed to fetch how-to data');
        }
        const data: PayloadResponse<HowToData> = await response.json();
        setHowToData(data.docs[0] || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching how-to data:', err);
        setError('Failed to load how-to data');
        setLoading(false);
      }
    };

    fetchHowToData();
  }, []);

  // Sort steps by order if provided
  const sortedSteps = howToData?.steps ? 
    [...howToData.steps].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    }) : [];

  if (loading) {
    return (
      <section className="py-16 bg-pink-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !howToData) {
    return (
      <section className="py-16 bg-pink-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">
            {error || 'No how-to data available. Please configure the How To section in the CMS.'}
          </p>
        </div>
      </section>
    );
  }

  // Set background color from CMS or default to light pink
  const bgColorClass = howToData.backgroundColor || 'bg-pink-50';

  return (
    <section className={`py-16 ${bgColorClass}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{howToData.title}</h2>
          {howToData.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl">{howToData.subtitle}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedSteps.map((step, index) => (
            <StepCard 
              key={step.id || index}
              icon={step.icon.url} 
              title={step.title}
              explanation={step.explanation}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowToSection 