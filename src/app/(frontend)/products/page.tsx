import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Metadata } from 'next'
import ProductsGrid from './ProductsGrid'

export const metadata: Metadata = {
  title: 'Our Products | PT. Wahana Jaya Dinamika',
  description: 'Explore our complete range of high-quality industrial products at PT. Wahana Jaya Dinamika.',
  openGraph: {
    title: 'Our Products | PT. Wahana Jaya Dinamika',
    description: 'Explore our complete range of high-quality industrial products at PT. Wahana Jaya Dinamika.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Products | PT. Wahana Jaya Dinamika',
    description: 'Explore our complete range of high-quality industrial products at PT. Wahana Jaya Dinamika.',
  },
}

export default function ProductsPage() {
  return (
    <main>
      <Header />
      <div className="py-8 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
          <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">
            Discover our complete range of high-quality industrial products designed to meet your specific needs.
            Browse our catalog and find the perfect solution for your requirements.
          </p>
          
          <ProductsGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}
