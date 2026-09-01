'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { data: session } = useSession();
  const { totalCount, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      <nav className="fixed top-0 left-0 w-full h-16 sm:h-20 bg-[#f5f5f5]/95 backdrop-blur-sm border-b border-[#dcd8cf] flex justify-between items-center px-4 sm:px-8 lg:px-16 z-40 transition-all">
        
        {/* Left: Hamburger Button (2-line on mobile, 3-line on desktop) */}
        <div className="flex items-center">
          {/* Mobile 2-line hamburger */}
          <button 
            onClick={toggleMenu}
            aria-label="Open Navigation Menu"
            className="flex md:hidden flex-col justify-center items-start gap-[6px] p-2 -ml-2 group cursor-pointer focus:outline-none"
          >
            <span className="w-5 sm:w-6 h-[1.5px] bg-[#1c1c1a] transition-all"></span>
            <span className="w-5 sm:w-6 h-[1.5px] bg-[#1c1c1a] transition-all"></span>
          </button>

          {/* Desktop 3-line hamburger */}
          <button 
            onClick={toggleMenu}
            aria-label="Open Navigation Menu"
            className="hidden md:flex flex-col justify-center items-center gap-1.5 p-1 group cursor-pointer focus:outline-none"
          >
            <span className="w-5 sm:w-6 h-0.5 bg-[#1c1c1a] transition-transform duration-200"></span>
            <span className="w-5 sm:w-6 h-0.5 bg-[#1c1c1a] transition-transform duration-200"></span>
            <span className="w-5 sm:w-6 h-0.5 bg-[#1c1c1a] transition-transform duration-200"></span>
          </button>
        </div>
        
        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="inline-flex items-center justify-center hover:opacity-85 transition-opacity">
            <Image 
              src="/KSHAUM.svg" 
              alt="KSHAUM" 
              width={260} 
              height={36} 
              priority
              className="h-4 sm:h-5 md:h-7 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Right Section: Mobile (Icons) vs Desktop (Text Links) */}
        {/* Mobile: Search Icon + Bag Icon */}
        <div className="flex md:hidden items-center gap-3 sm:gap-4 text-[#1c1c1a]">
          <button 
            onClick={toggleSearch}
            aria-label="Search"
            className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <button 
            onClick={openCart}
            aria-label="Shopping Bag"
            className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer focus:outline-none relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 bg-[#1c1c1a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop: Search, Login / Sign Out, Cart (Text Links) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-[13px] text-black font-normal">
          <button 
            onClick={toggleSearch}
            className="text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-none whitespace-nowrap"
          >
            Search
          </button>

          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-none whitespace-nowrap"
            >
              Sign Out
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-black hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              Login
            </Link>
          )}

          <button 
            onClick={openCart}
            className="text-black hover:opacity-60 transition-opacity cursor-pointer focus:outline-none flex items-center gap-1 whitespace-nowrap"
          >
            <span>Cart</span>
            <span>({totalCount})</span>
          </button>
        </div>
      </nav>

      {/* Shopping Bag Sliding Drawer */}
      <CartDrawer />

      {/* Right-Side Full-Height Search Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[480px] md:w-[540px] bg-[#f5f5f5] text-[#1c1c1a] transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col justify-between border-l border-[#dcd8cf]
        ${searchOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 sm:p-12 h-full flex flex-col">
          {/* Top Close Button */}
          <div className="flex justify-end items-center mb-12">
            <button 
              onClick={toggleSearch}
              aria-label="Close search"
              className="p-2 -mr-2 text-[#1c1c1a] hover:opacity-60 transition-opacity cursor-pointer"
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
              className="w-full text-base sm:text-lg text-[#1c1c1a] placeholder-[#1c1c1a] font-normal uppercase tracking-wider bg-transparent border-b border-[#1c1c1a] pb-3 focus:outline-none"
            />
          </div>

          {/* Highlights Section */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1a] mb-6">
              HIGHLIGHTS
            </h3>
            <ul className="space-y-3.5">
              {highlights.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleHighlightClick(item)}
                    className="text-sm sm:text-base text-[#1c1c1a]/85 hover:text-[#1c1c1a] hover:translate-x-1 transition-all text-left font-normal cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search Results Preview */}
          {searchQuery.trim() && (
            <div className="mt-8 pt-6 border-t border-[#dcd8cf] flex-1 overflow-y-auto">
              <span className="text-xs text-gray-500 uppercase tracking-widest block mb-3">
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
        className={`fixed top-0 left-0 h-screen w-[85%] sm:w-[50%] md:w-[380px] bg-[#f5f5f5] text-[#1c1c1a] transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col justify-between border-r border-[#dcd8cf]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header & Close Button */}
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-[#dcd8cf] pb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#bdb2a1] font-semibold">Categories</span>
            <button 
              onClick={toggleMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#dcd8cf]/50 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#1c1c1a">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Main Navigation Links */}
          <ul className="space-y-3.5 text-sm sm:text-base font-light text-[#1c1c1a]">
            <li>
              <Link href="/" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1 font-normal">
                The Quiet Choice
              </Link>
            </li>
            <li>
              <Link href="/the-quiet-choice/philosophy" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Philosophy
              </Link>
            </li>
            <li>
              <Link href="/the-quiet-choice/journals" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Journals
              </Link>
            </li>
            <li>
              <Link href="/shop" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/women" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1 pl-3 text-xs sm:text-sm text-gray-700">
                — Women&apos;s
              </Link>
            </li>
            <li>
              <Link href="/collection" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                The Collection
              </Link>
            </li>
            <li>
              <Link href="/collection/the-inheritance-01" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1 pl-3 text-xs sm:text-sm text-gray-700">
                — The Inheritance 01
              </Link>
            </li>
            <li>
              <Link href="/archives" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1">
                Archives
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
        <div className="p-6 sm:p-8 border-t border-[#dcd8cf] bg-[#dcd8cf]/30">
          <ul className="space-y-2 text-xs sm:text-[13px] text-gray-700">
            {session?.user ? (
              <>
                <li className="text-[#1c1c1a] font-medium text-xs">
                  Signed in as: <span className="font-semibold">{session.user.name || session.user.email}</span>
                </li>
                {session.user.role === 'admin' && (
                  <li>
                    <Link href="/admin" onClick={toggleMenu} className="text-amber-800 hover:underline font-medium block">
                      ⚙ Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      toggleMenu();
                      signOut({ callbackUrl: '/' });
                    }}
                    className="text-[#1c1c1a] underline hover:opacity-75 font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={toggleMenu} className="text-[#1c1c1a] underline hover:opacity-75 font-medium">
                  Sign In / Register
                </Link>
              </li>
            )}
            <li>
              <Link href="/contact" onClick={toggleMenu} className="text-[#1c1c1a] hover:opacity-75">
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