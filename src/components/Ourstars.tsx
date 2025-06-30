"use client";

import React from 'react';
import { Spotlight } from "./ui/spotlight-new";

const Ourstars = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="p-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Meet Our Shining Stars
        </h1>
        <p className="mt-4 text-base md:text-lg text-neutral-300 max-w-xl mx-auto">
          Discover the talented individuals who make our community vibrant.
          From seasoned professionals to rising prodigies, their journeys inspire us all.
        </p>
      </div>
    </div>
  );
}

export default Ourstars;