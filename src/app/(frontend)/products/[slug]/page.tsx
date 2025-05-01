import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import Header from '@/app/(frontend)/components/Header';
import Footer from '@/app/(frontend)/components/Footer';

interface Product {
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
  mainImage?: {
    id: string | number;
    alt?: string;
    url: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
  };
  gallery?: Array<{
    image: {
      url: string;
      alt: string;
    };
    isFeature: boolean;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
}

type Params = Promise<{ slug: string }>

async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Explicitly construct the URL to ensure it's correct
    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/products?where[slug][equals]=${encodeURIComponent(slug)}`;
    
    console.log(`Fetching product with URL: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error(`API returned status: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    console.log('API response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Check if data is a valid product
    if (!data) {
      console.log('No product data returned from API');
      return null;
    }
    
    // Handle both array and single object responses
    let product: Product | null = null;
    
    if (Array.isArray(data)) {
      // If it's an array, take the first item if available
      if (data.length > 0) {
        product = data[0];
      } else {
        console.log('Empty array returned from API for slug:', slug);
        return null;
      }
    } else if (typeof data === 'object' && data !== null) {
      // If it's already a single object, use it directly
      product = data;
    } else {
      console.log('Unexpected API response format for slug:', slug);
      return null;
    }
    
    // Verify we have a product with the correct slug
    if (product && product.slug === slug) {
      console.log('Product found:', product.title);
      return product;
    } else {
      console.log('Product slug mismatch or invalid product');
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Helper function to construct proper image URL
function getImageUrl(url: string): string {
  if (!url) return '/placeholder-product.jpg';
  
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  
  // If the URL is already absolute, use it directly
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, construct the proper URL based on the API format
  return `${baseUrl}${url}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // Extract plain text from description if it's an object
  let descriptionText = '';
  if (typeof product.description === 'string') {
    descriptionText = product.description;
  } else if (product.description && typeof product.description === 'object') {
    // Try to extract text from Lexical format
    const descObj = product.description as {
      root: {
        children: Array<{
          text?: string;
          children?: Array<{
            text?: string;
          }>;
        }>;
      };
    };
    if (descObj.root && Array.isArray(descObj.root.children)) {
      descriptionText = descObj.root.children
        .map((node) => {
          if (node.text) return node.text;
          if (node.children) {
            return node.children.map((child) => child.text || '').join(' ');
          }
          return '';
        })
        .join(' ');
    }
  }

  // Limit description to a reasonable length
  const truncatedDescription = descriptionText.length > 160 
    ? `${descriptionText.substring(0, 157)}...` 
    : descriptionText;

  // Get proper image URL
  const imageUrl = product.mainImage ? getImageUrl(product.mainImage.url) : '/placeholder-product.jpg';

  return {
    title: `${product.title} | Kimsberlin`,
    description: truncatedDescription || `${product.title} - Kimsberlin`,
    keywords: ['Kimsberlin', product.title, 'eyewear , opticals , eyeglasses'],
    robots: 'index, follow',
    openGraph: product.mainImage ? {
      title: product.title,
      description: truncatedDescription || `${product.title} - Kimsberlin`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${slug}`,
      images: [{
        url: imageUrl,
        alt: product.mainImage.alt || product.title,
        width: product.mainImage.width || 1200,
        height: product.mainImage.height || 630,
      }],
      siteName: 'Kimsberlin',
    } : undefined,
    twitter: product.mainImage ? {
      card: 'summary_large_image',
      title: product.title,
      description: truncatedDescription || `${product.title} - Kimsberlin`,
      images: [imageUrl],
    } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }
  
  // Process images for gallery
  const processedProduct = {
    ...product,
    mainImageUrl: product.mainImage ? getImageUrl(product.mainImage.url) : '/placeholder-product.jpg',
    galleryImages: [
      // Include main image in gallery
      {
        url: product.mainImage ? getImageUrl(product.mainImage.url) : '/placeholder-product.jpg',
        alt: product.mainImage?.alt || product.title,
        isMain: true
      },
      // Add gallery images if they exist
      ...(product.gallery?.map(item => ({
        url: getImageUrl(item.image.url),
        alt: item.image.alt,
        isMain: false
      })) || [])
    ]
  };
  
  // Format price in Indonesian Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price || 0);

  return (
    <>
      <Header />
      <main className="py-16 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetail 
            product={processedProduct} 
            formattedPrice={formattedPrice} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}