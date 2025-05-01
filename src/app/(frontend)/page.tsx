import React from 'react'

import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import RecommendedProducts from './components/RecommendedProducts'
import LocationMap from './components/LocationMap'
import HowToSection from './components/HowToSection'
import './styles.css'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <HowToSection />
      <RecommendedProducts />
      <LocationMap />
      
      {/* Main Content Section (You can add more sections here) */}
      <main className="flex-grow max-w-[1920px] mx-auto w-full">
        {/* Content goes here */}
      </main>

      <Footer />
    </div>
  )
}
