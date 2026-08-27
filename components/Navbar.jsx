'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const searchInputRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const highlights = [
    'Leather',
    'Denim',
    'Sweatshirt',
    'Linen',
    'Silk',
    'Accessories'
  ];

  const handleHighlightClick = (term) => {
    setSearchQuery(term);
  };

  return (
    <>
      {/* Navbar Header */}
      <nav className="fixed top-0 left-0 w-full h-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center px-6 sm:px-10 lg:px-16 z-40 transition-all">
        
        {/* Left: Hamburger Menu Only */}
        <div className="flex items-center">
          <button 
            onClick={toggleMenu}
            aria-label="Open Navigation Menu"
            className="flex flex-col justify-center items-center gap-1.5 p-1 group cursor-pointer focus:outline-none"
          >
            <span className="w-5 sm:w-6 h-0.5 bg-black transition-transform duration-200"></span>
            <span className="w-5 sm:w-6 h-0.5 bg-black transition-transform duration-200"></span>
            <span className="w-5 sm:w-6 h-0.5 bg-black transition-transform duration-200"></span>
          </button>
        </div>
        
        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <Link href="/" className="inline-flex items-center justify-center hover:opacity-85 transition-opacity">
            <Image 
              src="/sodlogo.svg" 
              alt="Ship of Desert" 
              width={260} 
              height={28} 
              priority
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Right: Only Search, Login, Cart */}
        <div className="flex items-center gap-5 sm:gap-8 text-xs sm:text-[13px] text-black font-normal">
          <button 
            onClick={toggleSearch}
            className="text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
          >
            Search
          </button>

          <Link 
            href="/login" 
            className="text-black hover:opacity-60 transition-opacity"
          >
            Login
          </Link>

          <Link 
            href="/cart" 
            className="text-black hover:opacity-60 transition-opacity"
          >
            Cart ({cartCount})
          </Link>
        </div>
      </nav>

      {/* Right-Side Full-Height Search Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[480px] md:w-[540px] bg-white transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col justify-between
        ${searchOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 sm:p-12 h-full flex flex-col">
          {/* Top Close Button */}
          <div className="flex justify-end items-center mb-12">
            <button 
              onClick={toggleSearch}
              aria-label="Close search"
              className="p-2 -mr-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input Line */}
          <div className="relative mb-12">
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH"
              className="w-full text-base sm:text-lg text-black placeholder-black font-normal uppercase tracking-wider bg-transparent border-b border-black pb-3 focus:outline-none"
            />
          </div>

          {/* Highlights Section */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-black mb-6">
              HIGHLIGHTS
            </h3>
            <ul className="space-y-3.5">
              {highlights.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleHighlightClick(item)}
                    className="text-sm sm:text-base text-gray-800 hover:text-black hover:translate-x-1 transition-all text-left font-normal cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search Results Preview (When User Types) */}
          {searchQuery.trim() && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex-1 overflow-y-auto">
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-3">
                Results for &quot;{searchQuery}&quot;
              </span>
              <p className="text-sm text-gray-600">
                Press enter to explore full collection results for &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Side Navigation Drawer (Left) */}
      <div 
        className={`fixed top-0 left-0 h-screen w-[85%] sm:w-[50%] md:w-[380px] bg-white transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header & Close Button */}
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Menu</span>
            <button 
              onClick={toggleMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="black">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Main Navigation Links */}
          <ul className="space-y-4 text-base sm:text-lg font-light text-black">
            <li>
              <Link href="/collection" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                The Lady
              </Link>
            </li>
            <li>
              <Link href="/collection" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                The Gentleman
              </Link>
            </li>
            <li>
              <Link href="/collection" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/philosophy" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Our Philosophy
              </Link>
            </li>
            <li>
              <Link href="/innercircle" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                The Inner Circle
              </Link>
            </li>
            <li>
              <Link href="/journal" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Drawer Footer / Account section */}
        <div className="p-6 sm:p-8 border-t border-gray-100 bg-gray-50/50">
          <ul className="space-y-2 text-xs sm:text-[13px] text-gray-600">
            <li>
              <Link href="/login" onClick={toggleMenu} className="text-black underline hover:opacity-75">
                Sign In / Register
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMenu} className="text-black hover:opacity-75">
                Customer Care
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Dimmed Overlay Backdrop for Menu or Search */}
      {(isOpen || searchOpen) && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 transition-opacity"
          onClick={() => {
            if (isOpen) setIsOpen(false);
            if (searchOpen) setSearchOpen(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Navbar;