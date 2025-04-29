"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string;
  title: string;
  slug: string;
  image: {
    url: string;
    alt?: string;
  };
  category?: string;
}

// Product card component
const ProductCard = ({ 
  image, 
  title,
  link = '#'
}: { 
  image: string, 
  title: string,
  link?: string
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
      <Link href={link} className="block">
        <div className="relative h-64 w-full">
          <Image 
            src={image} 
            alt={title}
            fill
            style={{ objectFit: 'contain' }}
            className="p-4"
          />
        </div>
        <div className="p-4 text-center border-t">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <div className="mt-2">
            <span className="inline-block bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

const ProductsGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Ensure data is an array and has the correct structure
        const productsArray = Array.isArray(data) ? data : [];
        

        
        setProducts(productsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error in ProductsGrid component:', error);
    return (
      <div className="text-center text-red-600 py-12">{error}</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-600 py-12">No products available at the moment.</div>
    );
  }

  return (
    <div>

      
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              image={product.image.url} 
              title={product.title}
              link={`/products/${product.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          No products available at the moment.
        </div>
      )}
    </div>
  )
}

export default ProductsGrid
