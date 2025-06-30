
import {Tarangcourses } from '@/components/AppleCardsCarouselDemo'
import HeroSection from '@/components/HeroSection'
import Ourstars from '@/components/Ourstars'
import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* <h1 className='text-2xl text-center'>TARANG</h1> */}
      <HeroSection/>
  <Tarangcourses/>
      <Ourstars/>
    </main>
    
  )
}

export default page