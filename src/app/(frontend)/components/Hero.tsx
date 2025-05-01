"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'

interface Media {
  id: string;
  alt: string;
  url: string;
  filename: string;
}

interface Slide {
  title: string;
  image: Media | number;
  alt: string;
  description?: string;
}

interface HeroData {
  title: string;
  slides: Slide[];
  autoPlaySpeed: number;
}

interface SiteSettings {
  contactInfo: {
    whatsapp: string;
  };
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

// No fallback images - we'll handle empty state gracefully

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  
  // Fetch hero data from the CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero data
        const heroResponse = await fetch('/api/hero?limit=1&depth=1');
        if (!heroResponse.ok) {
          throw new Error('Failed to fetch hero data');
        }
        const heroResponseData: PayloadResponse<HeroData> = await heroResponse.json();
        setHeroData(heroResponseData.docs[0] || null);
        
        // Fetch site settings
        const settingsResponse = await fetch('/api/site-settings?limit=1');
        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch site settings');
        }
        const settingsResponseData: PayloadResponse<SiteSettings> = await settingsResponse.json();
        setSiteSettings(settingsResponseData.docs[0] || null);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Use CMS data only, no fallbacks
  const slides = heroData?.slides
    ? heroData.slides
        .filter(slide => slide.image && typeof slide.image !== 'number')
        .map((slide, index) => {
          const imageData = slide.image as Media;
          return {
            id: index + 1,
            src: imageData.url,
            alt: slide.alt || imageData.alt || slide.title,
            title: slide.title,
            description: slide.description || ''
          };
        })
    : [];
    
  const slideCount = slides.length;
  
  // Function to go to next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);
  
  // Function to go to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);
  
  // Function to go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset auto-rotation timer when manually changing slides
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 100);
    }
  };
  
  // Format WhatsApp URL
  const getWhatsAppUrl = () => {
    if (!siteSettings?.contactInfo?.whatsapp) return '#';
    
    // Remove any non-digit characters from the WhatsApp number
    const whatsappNumber = siteSettings.contactInfo.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${whatsappNumber}`;
  };
  
  // Auto-rotation effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isAutoPlaying && slideCount > 0) {
      intervalId = setInterval(() => {
        nextSlide();
      }, heroData?.autoPlaySpeed || 5000); // Use CMS setting or default to 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, nextSlide, slideCount, heroData?.autoPlaySpeed]);
  
  // If no slides are available, return null or a minimal placeholder
  if (slides.length === 0) {
    if (loading) {
      return (
        <div className="relative w-full h-[300px] lg:h-[500px] max-w-[1920px] mx-auto overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse w-32 h-32 rounded-full bg-gray-200"></div>
        </div>
      );
    }
    return null; // Return null if no slides and not loading
  }

  return (
    <div className="relative w-full h-[300px] lg:h-[700px] max-w-[1920px] mx-auto overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-full w-full">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
              quality={90}
              style={{ objectFit: 'cover' }}
            />
            
            {/* Slide Content - Left Aligned */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full lg:w-1/2 text-white bg-transparent bg-opacity-30 p-6 rounded-lg backdrop-blur-sm">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  {slide.description && (
                    <p className="text-lg md:text-xl mb-6">
                      {slide.description}
                    </p>
                  )}
                  <Link 
                    href={getWhatsAppUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slider Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)}
              className={`h-1 transition-all duration-300 ${index === currentSlide ? 'w-8 bg-red-600' : 'w-5 bg-gray-300 hover:bg-red-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Arrow Navigation */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export default Hero
