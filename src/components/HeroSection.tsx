// components/HeroSection.tsx
"use client"; // Important for client-side components in Next.js

import Link from "next/link";
// Removed: import { Spotlight } from "./ui/spotlight-new"; // Spotlight import is no longer needed
import { Button } from "./ui/moving-border";     // Assuming this path is correct
import { WavyBackground } from "./ui/wavy-background"; // Import the WavyBackground component

function HeroSection() {
  return (
    <WavyBackground
      // You can customize WavyBackground properties here:
      // colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      // waveOpacity={0.4} // Adjust for desired subtlety
      // blur={15} // Adjust blur intensity
      // speed="fast"
      // backgroundFill="hsl(222.2 84% 4.9%)" // Example dark background fill
    >
      {/* Removed: <Spotlight /> */}

      {/* This div contains your main hero text and buttons.
          It's correctly positioned with relative and z-10 for layering over the WavyBackground canvas. */}
      <div className="p-4 relative z-10 w-full text-center">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Your Stage Awaits. Learn Smarter.
        </h1>
        <p className="mt-8 font-normal text-base md:text-lg text-neutral-300 max-w-xl mx-auto">
          Step into the spotlight! Whether it's mastering an instrument or honing your vocals,
          our courses provide the foundation, and our AI refines your sound.
          The future of your music begins now.
        </p>
        <div className="mt-7 flex justify-center items-center flex-wrap">
          <Link href={"/courses"} className="mr-4 mb-4">
            <Button
              borderRadius="1rem"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              Explore courses
            </Button>
          </Link>

          <Link href={"/ai-sync/drecipyio-feature"} className="mb-4">
            <Button
              borderRadius="1rem"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              AI SYNC
            </Button>
          </Link>
        </div>
      </div>
    </WavyBackground>
  );
}

export default HeroSection;