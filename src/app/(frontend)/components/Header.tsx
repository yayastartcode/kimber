"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

interface NavLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

interface Media {
  id: string;
  alt: string;
  url: string;
  filename: string;
}

interface HeaderData {
  title: string;
  logo: Media | number;
  navLinks: NavLink[];
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

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch('/api/header?limit=1&depth=1');
        if (!response.ok) {
          throw new Error('Failed to fetch header data');
        }
        const data: PayloadResponse<HeaderData> = await response.json();
        setHeaderData(data.docs[0] || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching header data:', err);
        setError('Failed to load header data');
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  return (
    <header className="bg-[#ef5a23] shadow-md sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {headerData?.logo && typeof headerData.logo !== 'number' ? (
                <Image 
                  src={headerData.logo.url} 
                  alt={headerData.logo.alt || ""} 
                  width={200} 
                  height={90}
                  className="h-20 w-auto"
                  priority
                />
              ) : (
                <div className="h-20 w-48 bg-gray-100 animate-pulse rounded"></div>
              )}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {headerData?.navLinks ? (
              headerData.navLinks.map((link, index) => (
                link.isExternal ? (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-200 hover:text-white font-medium hover:border-b-2 hover:border-white py-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    href={link.url} 
                    className={`text-zinc-200 hover:text-white font-medium hover:border-b-2 hover:border-white py-2 ${link.url === '/' ? 'text-white border-b-2 border-white' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              ))
            ) : (
              // Show loading placeholders instead of fallback links
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </>
            )}
          </nav>
          
          {/* Right side - Language & Search */}
          <div className="flex items-center space-x-4">
            
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {headerData?.navLinks ? (
              headerData.navLinks.map((link, index) => (
                link.isExternal ? (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    href={link.url} 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${link.url === '/' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                  >
                    {link.label}
                  </Link>
                )
              ))
            ) : (
              // Show loading placeholders instead of fallback links
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 my-2 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </>
            )}
            
           
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
