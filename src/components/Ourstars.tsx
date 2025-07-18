"use client";

import React from 'react';
import { Spotlight } from "./ui/spotlight-new";
import CircularGallery from './ui/CircularGallery'

const Ourstars = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white"></Spotlight>

      <div className="p-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Meet Our Shining Stars
        </h1>
        {/* <p className="mt-4 text-base md:text-lg text-neutral-300 max-w-xl mx-auto">
          Discover the talented individuals who make our community vibrant.
          From seasoned professionals to rising prodigies, their journeys inspire us all.
        </p> */}
      </div>

      {/* MODIFIED: Set width to 100% */}
      <div style={{ height: '600px', width: '100%', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
      </div>
    </div>
  );
}

export default Ourstars;