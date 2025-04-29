"use client";

import Image from 'next/image'
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use CMS data only, no fallbacks
  const sliderImages = heroData?.slides
    ? heroData.slides
        .filter(slide => slide.image && typeof slide.image !== 'number')
        .map((slide, index) => {
          const imageData = slide.image as Media;
          return {
            id: index + 1,
            src: imageData.url,
            alt: slide.alt || imageData.alt || slide.title,
            title: slide.title
          };
        })
    : [];
    
  const slideCount = sliderImages.length;
  
  // Fetch hero data from the CMS
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero?limit=1&depth=1');
        if (!response.ok) {
          throw new Error('Failed to fetch hero data');
        }
        const data: PayloadResponse<HeroData> = await response.json();
        setHeroData(data.docs[0] || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError('Failed to load hero data');
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);
  
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
  if (sliderImages.length === 0) {
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
    <div className="relative w-full h-[300px] lg:h-[900px] max-w-[1920px] mx-auto overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-full w-full">
        {/* Slides */}
        {sliderImages.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto"
              priority={index === 0}
              quality={90}
              
            />
          </div>
        ))}
        

      </div>
      
      {/* Slider Navigation Dots */}
      {sliderImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {sliderImages.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)}
              className={`h-1 transition-all duration-300 ${index === currentSlide ? 'w-8 bg-red-600' : 'w-5 bg-gray-300 hover:bg-red-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Hero
