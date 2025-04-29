"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface AboutUsData {
  title: string;
  subtitle?: string;
  content: any;
  image: {
    url: string;
    alt?: string;
  };
  imageAlt: string;
  buttonText?: string;
  buttonUrl?: string;
}

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const response = await fetch('/api/about-us');
        if (!response.ok) {
          throw new Error('Failed to fetch about us data');
        }
        const data = await response.json();
        setAboutUsData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching about us data:', err);
        setError('Failed to load about us data');
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
            <div className="h-4 bg-gray-200 rounded max-w-4xl mx-auto mb-12"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-gray-200 p-8 rounded-lg md:w-1/2 h-64"></div>
              <div className="md:w-1/2 h-[400px] bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{aboutUsData?.title}</h2>
        
        {aboutUsData?.subtitle && (
          <p className="text-center max-w-4xl mx-auto mb-12 text-gray-600">
            {aboutUsData.subtitle}
          </p>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Content Box */}
          <div className="bg-gray-200 p-8 rounded-lg md:w-1/2">
            <div className="prose prose-lg max-w-none">
              {aboutUsData?.content && aboutUsData.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index}>
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < paragraph.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
            
            {aboutUsData?.buttonText && aboutUsData?.buttonUrl && (
              <button 
                className="mt-6 bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
                onClick={() => window.location.href = aboutUsData.buttonUrl!}
              >
                {aboutUsData.buttonText}
              </button>
            )}
          </div>
          
          {/* Right Image */}
          {aboutUsData?.image && (
            <div className="md:w-1/2 relative h-[300px] md:h-[400px]">
              <Image 
                src={aboutUsData.image.url}
                alt={aboutUsData.imageAlt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutUs
