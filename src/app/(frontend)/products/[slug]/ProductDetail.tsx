"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import RichText from '@/components/RichText';
import CountdownTimer from './CountdownTimer';
import Wasap from '@/app/(frontend)/components/Wasap';

interface GalleryImage {
  url: string;
  alt: string;
  isMain: boolean;
}

interface ProcessedProduct {
  id: string | number;
  title: string;
  slug: string;
  price: number;
  description: {
    root: {
      children: Array<{
        type?: string;
        text?: string;
        children?: Array<{
          text: string;
        }>;
      }>;
    };
  };
  brand?: string;
  mainImageUrl: string;
  galleryImages: GalleryImage[];
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  stock?: number;
  reference?: string;
}

interface ProductDetailProps {
  product: ProcessedProduct;
  formattedPrice: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, formattedPrice }) => {
  const [selectedImage, setSelectedImage] = useState(product.mainImageUrl);
  const [selectedAlt, setSelectedAlt] = useState(product.galleryImages[0]?.alt || product.title);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch site settings');
        }
        const data = await response.json();
        if (data.docs && data.docs[0]?.contactInfo?.whatsapp) {
          setWhatsappNumber(data.docs[0].contactInfo.whatsapp);
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      }
    };

    fetchSiteSettings();
  }, []);
  
  // Function to handle thumbnail click
  const handleThumbnailClick = (image: GalleryImage) => {
    setSelectedImage(image.url);
    setSelectedAlt(image.alt);
  };

  // Calculate stock percentage for progress bar
  const stockPercentage = product.stock ? Math.min(Math.max((product.stock / 200) * 100, 10), 100) : 40;
  const stockCount = product.stock || 125;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column - Thumbnails */}
      <div className="lg:w-1/6 order-2 lg:order-1">
        <div className="flex flex-row lg:flex-col gap-3 mt-4 lg:mt-0">
          {product.galleryImages.map((image, index) => (
            <div 
              key={index}
              className={`cursor-pointer border-2 rounded-md overflow-hidden ${selectedImage === image.url ? 'border-red-500' : 'border-gray-200'}`}
              onClick={() => handleThumbnailClick(image)}
            >
              <div className="relative h-20 w-20">
                <Image 
                  src={image.url} 
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column - Main Image */}
      <div className="lg:w-2/5 order-1 lg:order-2">
        <div className="relative h-[400px] lg:h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={selectedImage}
            alt={selectedAlt}
            fill
            style={{ objectFit: 'contain' }}
            priority
            className="p-4"
          />
        </div>
      </div>

      {/* Right Column - Product Info */}
      <div className="lg:w-3/6 order-3">
        {/* Review stars */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className="w-5 h-5 text-yellow-400 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-500">(3 Reviews)</span>
        </div>
        
        {/* Brand and title */}
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.brand || "Brand"}</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.title}
        </h1>
        
        {/* Price */}
        <p className="text-2xl font-semibold text-red-600 mb-4">{formattedPrice}</p>
        
        {/* Description */}
        <div className="prose prose-lg max-w-none mb-6 text-gray-600">
          <RichText content={product.description} />
        </div>
        
        {/* Availability */}
        <div className="mb-6">
          <p className="text-green-600 font-medium flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Available In Stock: {stockCount} Items
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Countdown Timer */}
        <div className="mb-6">
          <p className="font-medium text-gray-700">Hurry up! only {stockCount} items left in stock!</p>
          <CountdownTimer 
            initialDays={825} 
            initialHours={4} 
            initialMinutes={13} 
            initialSeconds={24} 
          />
        </div>
        
        {/* WhatsApp Button */}
        <a 
          href={whatsappNumber ? `https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan produk: ${product.title} (${formattedPrice})` : '#'}
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors mb-8 flex items-center justify-center gap-2 w-full lg:w-auto"
        >
          <Wasap color="#FFFFFF" size={24} />
          Beli via WhatsApp
        </a>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <dt className="font-medium text-gray-500">{spec.name}</dt>
                  <dd className="mt-1 text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Reference/SKU */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">Reference: {product.reference || "SDF-EWR-895"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 