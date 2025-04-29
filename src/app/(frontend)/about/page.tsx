import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AboutUs from '../components/AboutUs'
import LocationMap from '../components/LocationMap'
import { Metadata } from 'next'

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

export default function AboutPage() {
  return (
    <main>
      <Header />
      <div className="pt-4 pb-8">
        <h1 className="text-4xl font-bold text-center mb-8">About PT. Wahana Jaya Dinamika</h1>
        <AboutUs />
        <LocationMap />
      </div>
      <Footer />
    </main>
  )
}
