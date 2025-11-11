'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only hide navbar on home page
    if (pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Always show navbar on non-home pages, or when scrolled on home page
  const showNavbar = pathname !== '/' || isScrolled;

  return (
    <nav 
      className={`bg-hiko-cream shadow-lg fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/favicon.png"
              alt="Hiko Logo"
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
              priority
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-hiko-green hover:text-hiko-green/80 transition-colors duration-300 font-source-sans"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-hiko-green hover:text-hiko-green/80 transition-colors duration-300 font-source-sans"
            >
              About
            </Link>
            <Link 
              href="/get-started" 
              className="bg-hiko-green text-hiko-cream px-6 py-2 rounded-full hover:bg-hiko-green/90 transition-colors duration-300 font-source-sans font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-hiko-green hover:text-hiko-green/80 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-hiko-cream border-t border-hiko-green/20">
              <Link 
                href="/" 
                className="block px-3 py-2 text-hiko-green hover:text-hiko-green/80 transition-colors duration-300 font-source-sans"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-hiko-green hover:text-hiko-green/80 transition-colors duration-300 font-source-sans"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/get-started" 
                className="block w-full text-left px-3 py-2 bg-hiko-green text-hiko-cream rounded-lg hover:bg-hiko-green/90 transition-colors duration-300 font-source-sans font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
