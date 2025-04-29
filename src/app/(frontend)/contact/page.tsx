import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LocationMap from '../components/LocationMap'
import { Metadata } from 'next'
import ContactInfo from './ContactInfo'

export const metadata: Metadata = {
  title: 'Contact Us | PT. Wahana Jaya Dinamika',
  description: 'Get in touch with PT. Wahana Jaya Dinamika. Contact us for inquiries about our products and services.',
  openGraph: {
    title: 'Contact Us | PT. Wahana Jaya Dinamika',
    description: 'Get in touch with PT. Wahana Jaya Dinamika. Contact us for inquiries about our products and services.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | PT. Wahana Jaya Dinamika',
    description: 'Get in touch with PT. Wahana Jaya Dinamika. Contact us for inquiries about our products and services.',
  },
}

export default function ContactPage() {
  return (
    <main>
      <Header />
      <div className="py-8 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-600">
              Wed love to hear from you! Whether you have a question about our products, 
              need technical support, or want to discuss a potential partnership, 
              our team is ready to assist you.
            </p>
          </div>
          
          <ContactInfo />
          
          <div className="mt-16">
            <LocationMap />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
