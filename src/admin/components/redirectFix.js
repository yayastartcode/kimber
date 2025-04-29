// This script fixes redirect issues in Payload admin
// It's intended to be included in a script tag in your custom admin layout

// Function to initialize the redirect fix script
function initRedirectFix() {
  console.log('RedirectFix script initialized');
  
  // Handle the case where we're on an undefined route
  const path = window.location.pathname;
  
  if (path.includes('/undefined')) {
    console.log('Detected undefined in path, attempting to fix');
    // Check for any previous IDs in localStorage
    const lastKnownProductID = localStorage.getItem('lastKnownProductID');
    
    if (lastKnownProductID) {
      console.log(`Found ID ${lastKnownProductID}, redirecting`);
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
          console.log(`Storing product ID: ${data.id}`);
          localStorage.setItem('lastKnownProductID', data.id.toString());
        }
      }
    } catch (error) {
      // Ignore JSON parsing errors
    }
    
    return response;
  };
}

// Auto-initialize the script
if (typeof window !== 'undefined') {
  initRedirectFix();
}

export default initRedirectFix; 