// This file is likely app/page.tsx or the default page for a route
import { redirect } from 'next/navigation';
import React from 'react';

// The other imports are commented out, so they are not currently needed for this page
// import { Tarangcourses } from '@/components/AppleCardsCarouselDemo';
// import Maindoor from '@/components/door';
// import HeroSection from '@/components/HeroSection';
// import TarangNavbar from '@/components/navbar';
// import Ourstars from '@/components/Ourstars';

const HomePage = () => {
  // Redirect to the login page
  redirect('/login');

  // This component will not render anything after the redirect
  // You can return null or a loading spinner if there's any client-side delay before redirect
  return null;
};

export default HomePage;