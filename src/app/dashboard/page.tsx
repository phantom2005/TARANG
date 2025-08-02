// src/app/dashboard/page.tsx
"use client"; // This page contains client-side components

import { Tarangcourses } from '@/components/AppleCardsCarouselDemo';
import Maindoor from '@/components/door'; // If Maindoor is your Hero Section
import HeroSection from '@/components/HeroSection';
import TarangNavbar from '@/components/navbar';
import Ourstars from '@/components/Ourstars';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// --- IMPORT useSession from NextAuth.js ---
import { useSession } from 'next-auth/react';
// ------------------------------------------

const DashboardPage = () => {
  const router = useRouter();
  // --- Use NextAuth.js's useSession hook ---
  const { data: session, status } = useSession();
  // 'status' can be 'loading', 'authenticated', or 'unauthenticated'
  // ------------------------------------------

  useEffect(() => {
    // If NextAuth.js determines the user is unauthenticated, redirect to login
    if (status === 'unauthenticated') {
      router.replace('/login'); // Use replace to prevent going back to dashboard via browser history
    }
  }, [status, router]); // Depend on 'status' and 'router'

  // --- Show loading state while NextAuth.js checks session ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black/[0.96] flex items-center justify-center text-white">
        <p>Loading user data...</p>
      </div>
    );
  }

  // --- Only render dashboard content if authenticated ---
  if (status === 'authenticated') {
    return (
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        {/* Your Home Page / Hero Section Content */}
        <TarangNavbar />
        <HeroSection />
        <Tarangcourses />
        <Ourstars />
        {/* If Maindoor is also part of your main layout, uncomment it */}
        {/* <Maindoor /> */}
      </main>
    );
  }

  // If status is 'unauthenticated', the useEffect will handle the redirect.
  // This return null ensures nothing is rendered briefly before the redirect.
  return null;
};

export default DashboardPage;