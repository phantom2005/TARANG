"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
// If you are using Next.js App Router for client-side navigation after login, uncomment the line below:
// import { useRouter } from 'next/navigation';

// --- Interfaces ---
export interface BentoProps {
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean; // If true, all animations are disabled
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean; // Inherited from MagicBento
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  enableBorderGlow?: boolean; // Inherited from MagicBento
}

interface AuthFormProps {
  disableAnimations?: boolean; // Inherited from MagicBento
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  enableBorderGlow?: boolean; // Inherited from MagicBento
}

interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionCardProps extends SubscriptionPlan {
  disableAnimations?: boolean; // Inherited from MagicBento
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  enableBorderGlow?: boolean; // Inherited from MagicBento
  showUpgradeButton?: boolean; // New prop for upgrade button
}

// --- Constants ---
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255"; // RGB for purple glow

// --- Utility Functions ---
const createParticleElement = (
  x: number,
  y: number,
  color: string
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  card.style.setProperty("--glow-x", `${mouseX}%`); // Use relative percentage for glow position
  card.style.setProperty("--glow-y", `${mouseY}%`); // Use relative percentage for glow position
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

// --- ParticleCard Component ---
const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  enableBorderGlow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill(); // Kill any active magnetism animation

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return; // Ensure element exists

    // If animations are disabled, clear and prevent any effects
    if (disableAnimations) {
      clearAllParticles();
      if (magnetismAnimationRef.current) {
        magnetismAnimationRef.current.kill();
        magnetismAnimationRef.current = null;
      }
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.1 });
      element.style.setProperty("--glow-intensity", "0"); // Reset glow
      return; // Exit early if animations are disabled
    }

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      if (enableBorderGlow) {
        element.style.setProperty("--glow-intensity", "0"); // Reset glow on leave
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableBorderGlow) {
        // Calculate relative position for the glow
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        const { proximity, fadeDistance } = calculateSpotlightValues(DEFAULT_SPOTLIGHT_RADIUS);
        const distance = Math.hypot(x - centerX, y - centerY);
        let glow = 0;
        if (distance < proximity) {
          glow = 1;
        } else if (distance < fadeDistance) {
          glow = 1 - (distance - proximity) / (fadeDistance - proximity);
        }
        updateCardGlowProperties(element, relativeX, relativeY, glow, DEFAULT_SPOTLIGHT_RADIUS);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    // Cleanup function for useEffect
    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
      if (magnetismAnimationRef.current) {
        magnetismAnimationRef.current.kill(); // Ensure magnetism animation is killed
        magnetismAnimationRef.current = null;
      }
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.1 }); // Reset card position/rotation
      element.style.setProperty("--glow-intensity", "0"); // Reset glow CSS variable
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
    enableBorderGlow, // Add to dependencies to re-run if this prop changes
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden transition-all duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-2xl ${
        enableBorderGlow ? "card--border-glow" : ""
      }`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

// --- GlobalSpotlight Component ---
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations: boolean;
  enabled: boolean;
  spotlightRadius: number;
  glowColor: string;
}> = ({
  gridRef,
  disableAnimations,
  enabled,
  spotlightRadius,
  glowColor,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    // If animations are disabled or spotlight is not enabled, ensure it's removed
    if (disableAnimations || !enabled) {
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      spotlightRef.current = null;
      return;
    }

    // Only create spotlight if it doesn't already exist
    if (!spotlightRef.current) {
      const spotlight = document.createElement("div");
      spotlight.className = "global-spotlight";
      spotlight.style.cssText = `
        position: fixed;
        width: ${spotlightRadius * 2}px; // Set width/height based on radius
        height: ${spotlightRadius * 2}px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle,
          rgba(${glowColor}, 0.15) 0%,
          rgba(${glowColor}, 0.08) 15%,
          rgba(${glowColor}, 0.04) 25%,
          rgba(${glowColor}, 0.02) 40%,
          rgba(${glowColor}, 0.01) 65%,
          transparent 70%
        );
        z-index: 200;
        opacity: 0;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-landing-section") || document.body;
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside;

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        return;
      }

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(spotlightRef.current, {
        opacity: 0.8, // Full opacity when inside the section
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      spotlightRef.current = null; // Clear ref on cleanup
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]); // Dependencies for useEffect
  return null;
};

// --- AuthForm Component ---
const AuthForm: React.FC<AuthFormProps> = ({
  disableAnimations,
  enableTilt,
  enableMagnetism,
  enableBorderGlow,
}) => {
  // --- NEW STATE ADDITIONS FOR LOGIN FORM ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If you want to use Next.js useRouter for client-side navigation (recommended for Next.js App Router)
  // const router = useRouter();

  const title = "Welcome Back, Musician!";
  const buttonText = "Login to Jam";
  const toggleText = "New to the academy?";
  const toggleLinkText = "Enroll Now";

  // --- UPDATED handleSubmit FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true); // Set loading state to true

    console.log(`Attempting login for: ${email}`); // For debugging

    try {
      // **IMPORTANT**: Replace '/api/login' with your actual backend login endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        // Login successful!
        console.log('Login successful!', data);
        // You might receive a token or session information here.
        // If your backend sends a JWT, store it (e.g., in localStorage):
        // if (data.token) {
        //   localStorage.setItem('authToken', data.token);
        // }

        // Redirect to the dashboard or a protected page
        // Option 1: Simple full page reload (less ideal for SPA)
        window.location.href = '/dashboard';
        // Option 2: Next.js App Router client-side navigation (uncomment useRouter import above)
        // router.push('/dashboard');

      } else {
        // Login failed (e.g., invalid credentials)
        // Display the error message from the backend, or a generic one
        setError(data.message || 'Login failed. Please check your credentials.');
        console.error('Login failed:', data.message);
      }
    } catch (err) {
      // Network error or other unexpected issues
      console.error('An error occurred during login:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false); // Always set loading to false after the attempt
    }
  };

  return (
    <ParticleCard
      className="bg-[#060010] p-8 rounded-2xl border border-solid border-[#392e4e] text-white flex flex-col items-center justify-center shadow-lg"
      style={{
        width: "min(90%, 400px)",
        minHeight: "400px",
        position: "relative",
        zIndex: 10,
      }}
      disableAnimations={disableAnimations}
      enableTilt={enableTilt}
      enableMagnetism={enableMagnetism}
      glowColor={DEFAULT_GLOW_COLOR}
      enableBorderGlow={enableBorderGlow}
      particleCount={DEFAULT_PARTICLE_COUNT}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          placeholder="Academy Email"
          className="p-3 rounded-lg bg-[#1a0a2e] border border-[#523d6b] focus:outline-none focus:ring-2 focus:ring-[#8400ff] text-white placeholder-gray-400"
          required
          value={email} // Bind email state
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <input
          type="password"
          placeholder="Secure Your Melody"
          className="p-3 rounded-lg bg-[#1a0a2e] border border-[#523d6b] focus:outline-none focus:ring-2 focus:ring-[#8400ff] focus:border-transparent text-white placeholder-gray-400"
          required
          value={password} // Bind password state
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
        {/* Display error message if any */}
        {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        <button
          type="submit"
          className="bg-[#8400ff] text-white font-bold py-3 rounded-lg hover:bg-[#6a00cc] transition duration-200 ease-in-out"
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Logging In...' : buttonText} {/* Show loading text */}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        {toggleText}{" "}
        <a href="/register" className="text-[#8400ff] hover:underline font-medium">
          {toggleLinkText}
        </a>
      </p>
    </ParticleCard>
  );
};

// --- SubscriptionCard Component ---
const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Enthusiast",
    price: "$0/month",
    features: [
      "Introductory AI Practice Buddy",
      "Access to basic scales & chords",
      "Community forum access",
      "Limited daily practice time",
    ],
  },
  {
    name: "Performer",
    price: "$29/month",
    features: [
      "Enhanced AI Practice Buddy",
      "Personalized learning paths",
      "Real-time AI feedback on playing",
      "Access to full song library",
      "Monthly virtual workshops",
    ],
    isPopular: true,
  },
  {
    name: "Virtuoso",
    price: "Custom",
    features: [
      "Advanced AI Composition Assistant",
      "Dedicated AI tutor support",
      "Unlimited real-time feedback",
      "Exclusive masterclasses",
      "Performance analytics & coaching",
    ],
  },
];

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  price,
  features,
  isPopular,
  disableAnimations,
  enableTilt,
  enableMagnetism,
  enableBorderGlow,
  showUpgradeButton = false, // Default to false if not provided
}) => {
  const buttonText = name === "Virtuoso" ? "Contact Sales" : showUpgradeButton ? "Upgrade Plan" : "Choose Plan";

  return (
    <ParticleCard
      className={`bg-[#060010] p-8 rounded-2xl border border-solid flex flex-col justify-between text-white shadow-lg
        ${isPopular ? "border-[#8400ff] ring-2 ring-[#8400ff]" : "border-[#392e4e]"}`}
      style={{
        width: "min(90%, 320px)",
        minHeight: "450px",
        position: "relative",
        zIndex: 10,
      }}
      disableAnimations={disableAnimations}
      enableTilt={enableTilt}
      enableMagnetism={enableMagnetism}
      glowColor={DEFAULT_GLOW_COLOR}
      enableBorderGlow={enableBorderGlow}
      particleCount={DEFAULT_PARTICLE_COUNT}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-[#8400ff] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          Most Popular
        </div>
      )}
      <div>
        <h3 className="text-3xl font-bold mb-2">{name}</h3>
        <p className="text-4xl font-extrabold mb-6 text-[#8400ff]">
          {price}
        </p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 mr-2 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button className={`w-full py-3 rounded-lg font-semibold
        ${isPopular ? "bg-white text-[#8400ff] hover:bg-gray-200" : "bg-[#8400ff] text-white hover:bg-[#6a00cc]"}
        transition duration-200 ease-in-out`}>
        {buttonText}
      </button>
    </ParticleCard>
  );
};

// --- Main MagicBento Component ---
const MagicBento: React.FC<BentoProps> = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false, // Set to true to disable all animations
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const landingPageRef = useRef<HTMLDivElement>(null);
  const shouldDisableAnimations = disableAnimations;

  // State to simulate a user's current plan for the "Upgrade Plan" button
  // You would replace this with actual user data from your backend
  const [userCurrentPlan, setUserCurrentPlan] = useState<string | null>("Enthusiast"); // Example: User is on "Enthusiast"

  // Function to determine if an "Upgrade Plan" button should be shown
  const getShowUpgradeButton = useCallback((planName: string) => {
    if (!userCurrentPlan) return false;

    const planOrder = ["Enthusiast", "Performer", "Virtuoso"];
    const currentIndex = planOrder.indexOf(userCurrentPlan);
    const targetIndex = planOrder.indexOf(planName);

    return targetIndex > currentIndex;
  }, [userCurrentPlan]);

  return (
    <>
      <style>
        {`
          body {
            background-color: #0d011f; /* Darker background for the whole page */
            margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .bento-landing-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }
          
          /* These styles are for the ParticleCard's glow effect from its original design */
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease; /* Ensure smooth opacity transition for glow */
            z-index: 1;
            opacity: 0; /* Initially hidden */
          }
          
          .card--border-glow:hover::after {
            opacity: 1; /* Shows on hover */
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={landingPageRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div
        ref={landingPageRef}
        className="bento-landing-section min-h-screen flex flex-col items-center justify-center p-4 md:p-8 gap-12 relative"
        style={{
          background: "linear-gradient(135deg, #0d011f 0%, #1a0a2e 100%)",
        }}
      >
        {/* Main Greeting Section */}
        <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-6 z-10 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight">
            Welcome Back, Maestro! 🎶
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
            Pick up where you left off and let our AI guide your continued journey to musical mastery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/dashboard" // Assuming this is your user's dashboard or main app page after login
              className="px-8 py-4 bg-[#8400ff] text-white text-xl font-bold rounded-lg hover:bg-[#6a00cc] transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
            >
              Continue Your Journey
            </a>
            <a
              href="/register" // Direct link to your register page for new users
              className="px-8 py-4 bg-transparent border-2 border-[#8400ff] text-[#8400ff] text-xl font-bold rounded-lg hover:bg-[#8400ff] hover:text-white transition duration-300 ease-in-out shadow-lg"
            >
              New to the Academy? Enroll Now
            </a>
          </div>
        </div>

        {/* Auth Forms and Subscription Cards Section */}
        <div className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl z-10 mt-12">
          {/* Auth Form (now only Login) */}
          <div className="w-full flex justify-center">
            <AuthForm
              disableAnimations={shouldDisableAnimations}
              enableTilt={enableTilt}
              enableMagnetism={enableMagnetism}
              enableBorderGlow={enableBorderGlow}
            />
          </div>

          {/* Subscription Cards with Upgrade Logic */}
          <div className="w-full text-center mt-12">
            <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-8">
              Choose Your Harmony
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
                Select a plan that fits your musical aspirations, from casual practice to professional mastery.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {subscriptionPlans.map((plan, index) => (
                <SubscriptionCard
                  key={index}
                  {...plan}
                  disableAnimations={shouldDisableAnimations}
                  enableTilt={enableTilt}
                  enableMagnetism={enableMagnetism}
                  enableBorderGlow={enableBorderGlow}
                  showUpgradeButton={getShowUpgradeButton(plan.name)} // Pass the prop based on user's current plan
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MagicBento;