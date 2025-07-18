"use client";
import MagicBento from "./ui/MagicBento"

import React from 'react'

const Maindoor = () => {
  return (
    <div>
    <MagicBento 
  
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={true}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={300}
  particleCount={12}
  glowColor="132, 0, 255"
/>  
    </div>
  )
}

export default Maindoor
