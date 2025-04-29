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
          <p className="text-gray-400">© {new Date().getFullYear()} PT. Wahana Jaya Dharma. All rights reserved.</p>
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
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.88 5.83L2.2 22l4.17-1.68C7.71 21.38 9.82 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-2.03 0-3.93-.61-5.5-1.65l-.39-.23-2.62 1.05.91-2.72-.25-.4C3.39 15.03 3 13.57 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9zm5.18-12.24c-.12-.18-.44-.33-.92-.57-.48-.24-2.82-1.39-3.26-1.55-.43-.16-.74-.24-1.05.24-.31.48-1.2 1.55-1.47 1.87-.27.31-.54.35-1 .11-.46-.24-1.95-.72-3.72-2.29-1.37-1.22-2.3-2.57-2.57-3.19-.27-.46-.03-.71.2-.94.21-.21.46-.55.69-.82.23-.28.3-.48.46-.8.15-.31.07-.58-.04-.82-.11-.24-.99-2.39-1.36-3.27-.36-.87-.72-.75-.99-.76-.25-.02-.55-.02-.84-.02-.29 0-.77.11-1.17.55-.4.44-1.54 1.5-1.54 3.67 0 2.17 1.58 4.27 1.8 4.56.22.3 3.17 4.85 7.69 6.8 1.07.46 1.91.74 2.56.95.93.29 1.77.25 2.44.15.74-.11 2.28-.93 2.6-1.83.32-.9.32-1.67.22-1.83z" />
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
