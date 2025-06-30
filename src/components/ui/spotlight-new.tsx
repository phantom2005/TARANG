"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string[];
  gradientSecond?: string[];
  gradientThird?: string[];
  translateY?: number; // Y position of the spotlight's top edge
  width?: number; // Base width of the main spotlight beam
  height?: number;
  smallWidth?: number; // Width of the inner gradient layers
  duration?: number; // Duration of one full horizontal sweep
  xOffset?: number; // Maximum horizontal sweep distance
  randomize?: boolean; // Enables/disables randomness
};

// Define gradient variations for each requested color
const redGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 100%, 70%, .25) 0, hsla(0, 100%, 50%, .15) 50%, hsla(0, 100%, 40%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(0, 100%, 70%, .18) 0, hsla(0, 100%, 50%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(0, 100%, 70%, .12) 0, hsla(0, 100%, 40%, .07) 80%, transparent 100%)",
};

const blueGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(220, 100%, 70%, .25) 0, hsla(220, 100%, 50%, .15) 50%, hsla(220, 100%, 40%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(220, 100%, 70%, .18) 0, hsla(220, 100%, 50%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(220, 100%, 70%, .12) 0, hsla(220, 100%, 40%, .07) 80%, transparent 100%)",
};

const whiteGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .25) 0, hsla(0, 0%, 85%, .15) 50%, hsla(0, 0%, 75%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .18) 0, hsla(0, 0%, 85%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .12) 0, hsla(0, 0%, 75%, .07) 80%, transparent 100%)",
};

const goldenGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(40, 100%, 70%, .25) 0, hsla(40, 100%, 50%, .15) 50%, hsla(40, 100%, 40%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(40, 100%, 70%, .18) 0, hsla(40, 100%, 50%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(40, 100%, 70%, .12) 0, hsla(40, 100%, 40%, .07) 80%, transparent 100%)",
};

const greenGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(120, 80%, 60%, .25) 0, hsla(120, 80%, 40%, .15) 50%, hsla(120, 80%, 30%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(120, 80%, 60%, .18) 0, hsla(120, 80%, 40%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(120, 80%, 60%, .12) 0, hsla(120, 80%, 30%, .07) 80%, transparent 100%)",
};

const magentaGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(300, 100%, 70%, .25) 0, hsla(300, 100%, 50%, .15) 50%, hsla(300, 100%, 40%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(300, 100%, 70%, .18) 0, hsla(300, 100%, 50%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(300, 100%, 70%, .12) 0, hsla(300, 100%, 40%, .07) 80%, transparent 100%)",
};

const pinkGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(330, 100%, 75%, .25) 0, hsla(330, 100%, 55%, .15) 50%, hsla(330, 100%, 45%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 75%, .18) 0, hsla(330, 100%, 55%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(330, 100%, 75%, .12) 0, hsla(330, 100%, 45%, .07) 80%, transparent 100%)",
};

const orangeGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(30, 100%, 70%, .25) 0, hsla(30, 100%, 50%, .15) 50%, hsla(30, 100%, 40%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(30, 100%, 70%, .18) 0, hsla(30, 100%, 50%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(30, 100%, 70%, .12) 0, hsla(30, 100%, 40%, .07) 80%, transparent 100%)",
};

// Darker/Muted tones for variety
const darkPurpleGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 50%, 40%, .25) 0, hsla(270, 50%, 25%, .15) 50%, hsla(270, 50%, 20%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(270, 50%, 40%, .18) 0, hsla(270, 50%, 25%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(270, 50%, 40%, .12) 0, hsla(270, 50%, 20%, .07) 80%, transparent 100%)",
};

const darkCyanGradient = {
  first: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(180, 70%, 35%, .25) 0, hsla(180, 70%, 20%, .15) 50%, hsla(180, 70%, 15%, 0) 80%)",
  second: "radial-gradient(50% 50% at 50% 50%, hsla(180, 70%, 35%, .18) 0, hsla(180, 70%, 20%, .1) 80%, transparent 100%)",
  third: "radial-gradient(50% 50% at 50% 50%, hsla(180, 70%, 35%, .12) 0, hsla(180, 70%, 15%, .07) 80%, transparent 100%)",
};


export const Spotlight = ({
  gradientFirst = [
    redGradient.first, blueGradient.first, whiteGradient.first, goldenGradient.first,
    greenGradient.first, magentaGradient.first, pinkGradient.first, orangeGradient.first,
    darkPurpleGradient.first, darkCyanGradient.first,
  ],
  gradientSecond = [
    blueGradient.second, whiteGradient.second, goldenGradient.second, redGradient.second,
    magentaGradient.second, pinkGradient.second, orangeGradient.second, darkPurpleGradient.second,
    darkCyanGradient.second, greenGradient.second,
  ],
  gradientThird = [
    whiteGradient.third, goldenGradient.third, redGradient.third, blueGradient.third,
    pinkGradient.third, orangeGradient.third, darkPurpleGradient.third, darkCyanGradient.third,
    greenGradient.third, magentaGradient.third,
  ],
  
  // Position top of spotlight at the top of the viewport or slightly above
  translateY: propTranslateY = -150, // Adjusted for a stage light feel
  width = 300, 
  height = 1380, 
  smallWidth = 120, 
  duration = 5, // Back to a faster duration for sweeping
  xOffset = 250, // Wider sweep
  randomize = true, 
}: SpotlightProps = {}) => {

  const computedTranslateY = useMemo(() => 
    randomize ? propTranslateY + (Math.random() - 0.5) * 50 : propTranslateY, // Small random vertical offset for source
  [randomize, propTranslateY]);

  const computedXOffset = useMemo(() => 
    randomize ? xOffset * (0.6 + Math.random() * 0.4) : xOffset, 
  [randomize, xOffset]);

  const computedDuration = useMemo(() => 
    randomize ? duration * (0.8 + Math.random() * 0.4) : duration, 
  [randomize, duration]);

  const computedInitialXDirectionLeft = useMemo(() => 
    randomize && Math.random() > 0.5 ? -1 : 1, 
  [randomize]);

  const computedInitialXDirectionRight = useMemo(() => 
    randomize && Math.random() > 0.5 ? 1 : -1, 
  [randomize]);

  const shuffleArray = (array: string[]) => {
    if (!array || array.length <= 1) return array;
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const randomizedGradientFirst = useMemo(() => 
    randomize ? shuffleArray(gradientFirst) : gradientFirst,
  [randomize, gradientFirst]);

  const randomizedGradientSecond = useMemo(() => 
    randomize ? shuffleArray(gradientSecond) : gradientSecond,
  [randomize, gradientSecond]);

  const randomizedGradientThird = useMemo(() => 
    randomize ? shuffleArray(gradientThird) : gradientThird,
  [randomize, gradientThird]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Left-sweeping spotlight container (fixed at Y, sweeps X) */}
      <motion.div
        animate={{
          x: [0, computedInitialXDirectionLeft * computedXOffset, 0], // Horizontal sweep
        }}
        transition={{
          duration: computedDuration, 
          repeat: Infinity,
          repeatType: "reverse", // Sweeps back and forth
          ease: "easeInOut",
          // Background color transition for smooth changes across sweeps
          background: {
            duration: computedDuration / randomizedGradientFirst.length / 2, // Faster color change within sweep
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }
        }}
        style={{ transform: `translateY(${computedTranslateY}px)` }} 
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
      >
        {/* Main beam - always visible, only color changes */}
        <motion.div
          style={{
            transform: `rotate(-45deg)`, 
            width: `${width}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed as scaleY is no longer used
          }}
          // No scaleY/opacity animations here
          animate={{ background: randomizedGradientFirst }} // Animate background directly
          transition={{
            duration: computedDuration, // Match parent duration for color sync
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 left-0`}
        />

        {/* Second beam (inner) */}
        <motion.div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            width: `${smallWidth}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed
          }}
          animate={{ background: randomizedGradientSecond }}
          transition={{
            duration: computedDuration, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />

        {/* Third beam (outer) */}
        <motion.div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            width: `${smallWidth}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed
          }}
          animate={{ background: randomizedGradientThird }}
          transition={{
            duration: computedDuration, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
      </motion.div>

      {/* Right-sweeping spotlight container (fixed at Y, sweeps X) */}
      <motion.div
        animate={{
          x: [0, computedInitialXDirectionRight * computedXOffset, 0], 
        }}
        transition={{
          duration: computedDuration, 
          repeat: Infinity,
          repeatType: "reverse", 
          ease: "easeInOut",
          // Background color transition for smooth changes across sweeps
          background: {
            duration: computedDuration / randomizedGradientFirst.length / 2, // Faster color change within sweep
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }
        }}
        style={{ transform: `translateY(${computedTranslateY}px)` }}
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
      >
        {/* Main beam */}
        <motion.div
          style={{
            transform: `rotate(45deg)`,
            width: `${width}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed
          }}
          animate={{ background: randomizedGradientFirst }}
          transition={{
            duration: computedDuration, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 right-0`}
        />

        {/* Second beam (inner) */}
        <motion.div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            width: `${smallWidth}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed
          }}
          animate={{ background: randomizedGradientSecond }}
          transition={{
            duration: computedDuration, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />

        {/* Third beam (outer) */}
        <motion.div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            width: `${smallWidth}px`,
            height: `${height}px`,
            // transformOrigin: 'top center', // Removed
          }}
          animate={{ background: randomizedGradientThird }}
          transition={{
            duration: computedDuration, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
      </motion.div>
    </motion.div>
  );
};