import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LocationMap from '../components/LocationMap'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | PT. Wahana Jaya Dharma',
  description: 'Learn more about PT. Wahana Jaya Dinamika, our history, mission, and values.',
  openGraph: {
    title: 'About Us | PT. Wahana Jaya Dinamika',
    description: 'Learn more about PT. Wahana Jaya Dinamika, our history, mission, and values.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | PT. Wahana Jaya Dinamika',
    description: 'Learn more about PT. Wahana Jaya Dinamika, our history, mission, and values.',
  },
}

const CompanyInfo = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Company</h2>
        <p className="text-center max-w-4xl mx-auto mb-12 text-gray-600">
          PT. Wahana Jaya Dinamika is a leading supplier of industrial equipment and solutions in Indonesia.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Content Box */}
          <div className="bg-white p-8 rounded-lg shadow-md md:w-1/2">
            <div className="prose prose-lg max-w-none">
              <p>
                Founded with a vision to provide high-quality industrial solutions, PT. Wahana Jaya Dinamika has grown to become a trusted partner for businesses across Indonesia.
              </p>
              <p>
                We specialize in motor and pneumatic vibrator equipment, providing reliable products that meet the highest industry standards. Our team of experts is dedicated to delivering exceptional service and support to all our clients.
              </p>
              <p>
                With years of experience in the industry, we understand the unique challenges faced by our customers and work tirelessly to provide customized solutions that address their specific needs.
              </p>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="md:w-1/2 relative h-[300px] md:h-[400px]">
            <Image 
              src="/placeholder-image.jpg"
              alt="PT. Wahana Jaya Dinamika office"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main>
      <Header />
      <div className="pt-4 pb-8">
        <h1 className="text-4xl font-bold text-center mb-8">About PT. Wahana Jaya Dinamika</h1>
        <CompanyInfo />
        <LocationMap />
      </div>
      <Footer />
    </main>
  )
}
