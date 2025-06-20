'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-24 bg-white opacity-100 flex justify-between items-center z-50">
        {/* Burger Menu Button */}
        <button 
          onClick={toggleMenu}
          className="flex flex-col justify-center items-center gap-1.5 z-30 mx-4"
        >
          <span className="w-6 h-0.5 bg-black block"></span>
          <span className="w-6 h-0.5 bg-black block"></span>
          <span className="w-6 h-0.5 bg-black block"></span>
        </button>
        
        {/* Logo in the center */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image src="/sodlogo.svg" alt="Ship of Dessert Logo" width={300} height={32} />
          </Link>
        </div>
        
        {/* Search and Language options */}
        <div className="flex items-center gap-4 mr-4">
          <button aria-label="Search" className="hover:opacity-70" onClick={toggleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="black">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="relative px-4">
            <button 
              onClick={toggleLanguageMenu} 
              className="flex items-center gap-1 hover:opacity-70 text-black"
            >
              <span className="text-black">EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="black">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {languageMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white shadow-md py-2 px-3 rounded z-50">
                <ul className="space-y-2">
                  <li><button className="w-full text-left hover:opacity-70 text-black">English</button></li>
                  <li><button className="w-full text-left hover:opacity-70 text-black">Français</button></li>
                  <li><button className="w-full text-left hover:opacity-70 text-black">Español</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Container */}
      {searchOpen && (
        <div className="fixed top-16 left-0 w-full bg-white py-4 z-30">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full px-0 border-b border-black focus:outline-none text-sm text-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Navigation (now opens from left) */}
      <div 
        className={`fixed top-0 left-0 h-screen w-[50%] bg-white transform transition-transform duration-300 ease-in-out z-50 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button (X) - now on the right side */}
        <button 
          onClick={toggleMenu}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="black">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="pt-16 px-6">
          {/* Main Navigation */}
          <ul className="space-y-4">
            <li><a href="/collection" className="text-black hover:underline">The Lady</a></li>
            <li><a href="/collection" className="text-black hover:underline">The Gentleman</a></li>
            <li><a href="/accessories" className="text-black hover:underline">Accessories</a></li>
            <li><a href="/philosophy" className="text-black hover:underline">Our Philosophy</a></li>
            <li><a href="/our-origin" className="text-black hover:underline">Our Origin</a></li>
            <li><a href="/innercircle" className="text-black hover:underline">The Inner Circle</a></li>
            <li><a href="/journal" className="text-black hover:underline">Journal</a></li>
            <li><a href="/contact" className="text-black hover:underline">Contact</a></li>
          </ul> 
  
          {/* Services Section */} 
          {/* <div className="mt-8 pt-8 border-t border-gray-200">
            <ul className="space-y-4">
              <li><a href="/services" className="text-black hover:underline">Gucci Services</a></li>
              <li><a href="/world" className="text-black hover:underline">World of Gucci</a></li>
              <li><a href="/stores" className="text-black hover:underline">Store Locator</a></li>
            </ul>
          </div> */}

          {/* Account Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <ul className="space-y-4">
              <li><a href="/signin" className="text-black underline">Sign In</a></li>
              <li><a href="/orders" className="text-black underline">My Orders</a></li>
              <li><a href="/contact" className="text-black underline">Contact Us</a></li>
              <li><a href="tel:+91010101010" className="text-black underline">+91 010101010</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay with stronger blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar; 