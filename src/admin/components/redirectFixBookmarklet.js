/**
 * Product Redirect Fix Bookmarklet
 * 
 * To use this:
 * 1. Create a new bookmark in your browser
 * 2. Give it a name like "Fix Payload Redirect"
 * 3. Paste the following code into the URL field:
 * 
 * javascript:(function(){if(window.location.pathname.includes('/undefined')){const lastID=localStorage.getItem('lastKnownProductID');if(lastID){window.location.href=window.location.pathname.replace('undefined',lastID);}}const origFetch=window.fetch;window.fetch=async function(url,opt){const resp=await origFetch(url,opt);try{if(typeof url==='string'&&url.includes('/api/products')&&opt?.method==='POST'){const clone=resp.clone();const data=await clone.json();if(data&&data.id){localStorage.setItem('lastKnownProductID',data.id);console.log('Saved ID:'+data.id);}}}catch(e){}return resp;};alert('Product redirect fix active. If you see a /undefined URL, click this bookmarklet again.');})();
 * 
 * 4. When you create a product, it will save the ID.
 * 5. If you end up at a /undefined URL, click the bookmark to fix it.
 */

// Expanded version of the bookmarklet code (for reference)
function fixProductRedirect() {
  // If we're on an undefined URL, try to fix it
  if (window.location.pathname.includes('/undefined')) {
    const lastID = localStorage.getItem('lastKnownProductID');
    if (lastID) {
      window.location.href = window.location.pathname.replace('undefined', lastID);
    }
  }
  
  // Hook into fetch to capture product IDs
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    const response = await originalFetch(url, options);
    
    try {
      if (typeof url === 'string' && url.includes('/api/products') && options?.method === 'POST') {
        const clone = response.clone();
        const data = await clone.json();
        
        if (data && data.id) {
          localStorage.setItem('lastKnownProductID', data.id.toString());
          console.log('Saved product ID: ' + data.id);
        }
      }
    } catch (e) {
      // Ignore errors
    }
    
    return response;
  };
  
  alert('Product redirect fix active. If you see a /undefined URL, click this bookmarklet again.');
}

// The bookmarklet code (minified)
// javascript:(function(){if(window.location.pathname.includes('/undefined')){const lastID=localStorage.getItem('lastKnownProductID');if(lastID){window.location.href=window.location.pathname.replace('undefined',lastID);}}const origFetch=window.fetch;window.fetch=async function(url,opt){const resp=await origFetch(url,opt);try{if(typeof url==='string'&&url.includes('/api/products')&&opt?.method==='POST'){const clone=resp.clone();const data=await clone.json();if(data&&data.id){localStorage.setItem('lastKnownProductID',data.id);console.log('Saved ID:'+data.id);}}}catch(e){}return resp;};alert('Product redirect fix active. If you see a /undefined URL, click this bookmarklet again.');})(); 