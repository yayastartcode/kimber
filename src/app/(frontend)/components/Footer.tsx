"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface SocialMedia {
  platform: string;
  url: string;
}

interface SiteSettingsData {
  companyName: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
  socialMedia?: SocialMedia[];
  footerText?: {
    root: {
      children: Array<{
        text?: string;
        type?: string;
        children?: Array<{
          text: string;
        }>;
      }>;
    };
  };
  copyright?: string;
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

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/site-settings?limit=1');
        if (!response.ok) {
          throw new Error('Failed to fetch site settings');
        }
        const data: PayloadResponse<SiteSettingsData> = await response.json();
        setSiteSettings(data.docs[0] || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        setError('Failed to load site settings');
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  // Render rich text content
  const renderContent = (content: SiteSettingsData['footerText']) => {
    if (!content || !content.root || !content.root.children) {
      return null;
    }

    return content.root.children.map((block, blockIndex) => {
      if (block.type === 'paragraph') {
        return (
          <p key={blockIndex} className="mb-4">
            {block.children?.map((child, childIndex) => (
              <React.Fragment key={childIndex}>
                {child.text}
              </React.Fragment>
            ))}
          </p>
        );
      }
      return null;
    });
  };

  // If no data is available, return minimal footer
  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-[1920px] mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (error || !siteSettings) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-[1920px] mx-auto px-4 py-12 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Kimsberlin. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1920px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Footer Column 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{siteSettings.companyName}</h3>
            <div className="text-gray-400">
              {siteSettings.footerText && renderContent(siteSettings.footerText)}
            </div>
            {siteSettings.socialMedia && siteSettings.socialMedia.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {siteSettings.socialMedia.map((social, index) => (
                  <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    {/* Add social media icons based on platform */}
                    {social.platform === 'facebook' && (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    )}
                    {/* Add more social media icons as needed */}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer Column 2 */}
          <div>
            {/* Add any additional content for column 2 */}
          </div>
          
          {/* Footer Column 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
            </ul>
          </div>
          
          {/* Footer Column 4 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              {siteSettings.contactInfo?.address && (
                <li className="flex items-start">
                  <svg className="h-10 w-10 mr-2 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{siteSettings.contactInfo.address}</span>
                </li>
              )}
              {siteSettings.contactInfo?.phone && (
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{siteSettings.contactInfo.phone}</span>
                </li>
              )}
              {siteSettings.contactInfo?.whatsapp && (
                <li className="flex items-start">
                 <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-5 w-5 mr-2 mt-0.5 text-gray-500"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.37 0 0 5.37 0 12a11.87 11.87 0 001.72 6.02L0 24l5.98-1.7A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zm-8.52 17.3a9.3 9.3 0 01-4.9-1.44l-.35-.21-3.55 1.01 1.01-3.47-.23-.36a9.3 9.3 0 01-1.44-4.9c0-5.14 4.18-9.3 9.3-9.3 2.48 0 4.8.97 6.54 2.72a9.24 9.24 0 012.72 6.54c0 5.14-4.18 9.3-9.3 9.3zm5.1-6.97c-.28-.14-1.64-.81-1.89-.9-.25-.1-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.47.1-.18.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.02-.22-.53-.44-.46-.6-.47-.15-.01-.33-.01-.5-.01-.17 0-.44.06-.67.28-.23.22-.88.86-.88 2.07 0 1.21.9 2.38 1.03 2.54.13.16 1.77 2.7 4.3 3.78.6.26 1.07.42 1.44.54.61.2 1.16.17 1.6.1.49-.08 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2z" />
</svg>

                  <a href={`https://wa.me/${siteSettings.contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {siteSettings.contactInfo.whatsapp}
                  </a>
                </li>
              )}
              {siteSettings.contactInfo?.email && (
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{siteSettings.contactInfo.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>{siteSettings.copyright || `© ${new Date().getFullYear()} ${siteSettings.companyName}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
