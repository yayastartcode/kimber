import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import RichText from '@/components/RichText';
import Header from '@/app/(frontend)/components/Header';
import Footer from '@/app/(frontend)/components/Footer';


interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  image: {
    url: string;
    alt?: string;
  };
  specifications?: {
    key: string;
    value: string;
  }[];
}

type Params = Promise<{ slug: string }>

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?where[slug][equals]=${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    // The API returns the product directly, not in a docs array
    if (!data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
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
    const descObj = product.description as any;
    if (descObj.type === 'paragraph' && Array.isArray(descObj.children)) {
      descriptionText = descObj.children
        .map((child: any) => child.text || '')
        .join(' ');
    }
    // Try to extract text from Slate/Payload format
    else if (descObj.root && Array.isArray(descObj.root.children)) {
      descriptionText = descObj.root.children
        .map((node: any) => {
          if (node.text) return node.text;
          if (node.children) {
            return node.children.map((child: any) => child.text || '').join(' ');
          }
          return '';
        })
        .join(' ');
    }
    // No fallback content - if we can't extract text, just use an empty string
  }

  // Limit description to a reasonable length
  const truncatedDescription = descriptionText.length > 160 
    ? `${descriptionText.substring(0, 157)}...` 
    : descriptionText;

  return {
    title: `${product.title} | PT. Wahana Jaya Dinamika`,
    description: truncatedDescription || `${product.title} - PT. Wahana Jaya Dinamika`,
    keywords: ['PT. Wahana Jaya Dinamika', product.title, 'industrial products'],
    robots: 'index, follow',
    openGraph: {
      title: product.title,
      description: truncatedDescription || `${product.title} - PT. Wahana Jaya Dinamika`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${slug}`,
      images: [{
        url: product.image.url,
        alt: product.image.alt || product.title,
        width: 1200,
        height: 630,
      }],
      siteName: 'PT. Wahana Jaya Dinamika',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: truncatedDescription || `${product.title} - PT. Wahana Jaya Dinamika`,
      images: [product.image.url],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }
  
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
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
              <Image
                src={product.image.url}
                alt={product.image.alt || product.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">SMARTSHOP</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            
            <p className="text-2xl font-semibold text-red-600 mb-6">{formattedPrice}</p>
            
            <div className="prose prose-lg max-w-none mb-8 text-gray-600">
              <RichText content={product.description} />
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <dt className="font-medium text-gray-500">{spec.key}</dt>
                      <dd className="mt-1 text-gray-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}