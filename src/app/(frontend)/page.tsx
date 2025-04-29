import React from 'react'

import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import AboutUs from './components/AboutUs'
import CompanyValues from './components/CompanyValues'
import RecommendedProducts from './components/RecommendedProducts'
import ClientList from './components/ClientList'
import LocationMap from './components/LocationMap'
import './styles.css'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <AboutUs />
      <CompanyValues />
      <RecommendedProducts />
      <ClientList />
      <LocationMap />
      
      {/* Main Content Section (You can add more sections here) */}
      <main className="flex-grow max-w-[1920px] mx-auto w-full">
        {/* Content goes here */}
      </main>

      <Footer />
    </div>
  )
}
