'use client';

import { useEffect } from 'react';

/**
 * This component fixes redirect issues in Payload admin where newly created
 * documents redirect to /undefined URLs.
 * 
 * Use it in your custom admin layout.
 */
const RedirectFix = () => {
  useEffect(() => {
    // Handle the case where we're on an undefined route
    const path = window.location.pathname;
    
    if (path.includes('/undefined')) {
      // Check for any previous IDs in localStorage
      const lastKnownProductID = localStorage.getItem('lastKnownProductID');
      
      if (lastKnownProductID) {
        // Clear the storage
        localStorage.removeItem('lastKnownProductID');
        
        // Replace 'undefined' with the real ID in the URL
        const newPath = path.replace('undefined', lastKnownProductID);
        window.location.href = newPath;
      }
    }
    
    // Listen for API responses to catch the created product IDs
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
      const response = await originalFetch(url, options);
      
      // Clone the response to read it without consuming it
      const clone = response.clone();
      
      try {
        // Check if this is a product creation API call
        if (typeof url === 'string' && url.includes('/api/products') && options?.method === 'POST') {
          const data = await clone.json();
          
          // If we got a successful response with an ID, store it
          if (data && data.id) {
            localStorage.setItem('lastKnownProductID', data.id.toString());
          }
        }
      } catch (error) {
        // Ignore JSON parsing errors
      }
      
      return response;
    };
    
    // Cleanup function to restore the original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default RedirectFix; 