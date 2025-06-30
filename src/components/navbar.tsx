"use client";

import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  // NavbarLogo, // You can remove this line if NavbarLogo is no longer used
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // <--- Add this import

// Import your logo image using a relative path from this file
// Adjust this path based on where TarangNavbar.tsx is located relative to public/assets/logo.jpg
// For example, if TarangNavbar.tsx is in components/layout:
import TarangLogo from "../../public/assets/logo.jpg"; // <--- Adjust this relative path if needed

// If TarangNavbar.tsx is in components:
// import TarangLogo from "../public/assets/logo.jpg";

const TarangNavbar = ({ className }: { className?: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Courses",
      link: "/Courses",
    },
    {
      name: "Events",
      link: "/events",
    },
    {
      name: "Blogs",
      link: "/blogs", // Added link for consistency
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <ResizableNavbar>
        <NavBody>
          {/* Replace NavbarLogo with your logo image */}
          <Image
            src={TarangLogo}
            alt="Tarang Logo"
            width={120} // **IMPORTANT: Set the actual width of your logo in pixels**
            height={40} // **IMPORTANT: Set the actual height of your logo in pixels**
            className="h-auto w-auto" // Optional: Adjust Tailwind classes for visual sizing
          />
          <NavItems items={navItems} onItemClick={() => {}} />
          <div className="flex items-center gap-4">
            <Link href={"/ai-sync/drecipyio-feature"} passHref>
              <NavbarButton variant="primary" as="a">AI Sync </NavbarButton>
            </Link>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            {/* Replace NavbarLogo with your logo image */}
            <Image
              src={TarangLogo}
              alt="Tarang Logo"
              width={120} // **IMPORTANT: Set the actual width of your logo in pixels**
              height={40} // **IMPORTANT: Set the actual height of your logo in pixels**
              className="h-auto w-auto" // Optional: Adjust Tailwind classes for visual sizing
            />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative block px-4 py-2 text-neutral-600 dark:text-neutral-300 text-lg"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              <Link href={"/ai-sync/drecipyio-feature"} passHref>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  as="a"
                >
                  AI Sync
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
};

export default TarangNavbar;