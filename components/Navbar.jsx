'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const navigationLinks = [
  {
    title: 'Shop',
    href: '/shop',
    children: [
      { title: 'Dresses', href: '/women/dresses' },
      { title: 'Sets & Ensembles', href: '/shop?category=Sets' },
      { title: 'Vests & Tops', href: '/shop?category=Tops' },
      { title: 'Trousers', href: '/women/trousers' },
      { title: 'Skirts', href: '/women/skirts' },
      { title: 'All Garments', href: '/shop' },
    ],
  },
  {
    title: 'Collections',
    href: '/collection',
    children: [
      { title: 'The Complete Collection', href: '/collection' },
      { title: 'The Inheritance 01', href: '/collection/the-inheritance-01' },
      { title: 'Archives', href: '/archives' },
    ],
  },
  {
    title: 'The Quiet Choice',
    href: '/the-quiet-choice',
  },
  {
    title: 'Contact Us',
    href: '/contact',
  },
];

const Navbar = () => {
  const { data: session } = useSession();
  const { totalCount, isCartOpen, toggleCart, closeCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);
  const searchInputRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (searchOpen) setSearchOpen(false);
    if (isCartOpen) closeCart();
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isOpen) setIsOpen(false);
    if (isCartOpen) closeCart();
  };

  const handleCartToggle = () => {
    if (isOpen) setIsOpen(false);
    if (searchOpen) setSearchOpen(false);
    toggleCart();
  };

  const toggleMobileAccordion = (title) => {
    setExpandedMobileItem(expandedMobileItem === title ? null : title);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (searchOpen) setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchOpen]);

  const highlights = [
    'Sets',
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
      <nav className="fixed top-0 left-0 w-full h-14 md:h-16 bg-[#DBD8CF] border-b border-black/[0.04] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 z-40 transition-all">
        
        {/* Left Section: Desktop Links with Dropdown & Mobile Menu Toggle */}
        <div className="flex items-center">
          {/* Mobile Menu Toggle (< lg) */}
          <button 
            onClick={toggleMenu}
            aria-label="Open Navigation Menu"
            className="flex lg:hidden items-center gap-2 p-1.5 -ml-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="flex flex-col justify-center items-start gap-[5px]">
              <span className="w-5 h-[1.5px] bg-[#1c1c1a] transition-all"></span>
              <span className="w-5 h-[1.5px] bg-[#1c1c1a] transition-all"></span>
            </div>
            <span className="hidden sm:inline-block text-[12px] text-[#1c1c1a] font-normal tracking-wide">
              Menu
            </span>
          </button>

          {/* Desktop Navigation Links with Hover Dropdown (>= lg) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 text-[12px] xl:text-[13px] text-[#1c1c1a] font-normal">
            {navigationLinks.map((item) => (
              <div key={item.title} className="relative group">
                <Link 
                  href={item.href} 
                  className="inline-flex items-center gap-1 py-4 hover:opacity-50 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  <span>{item.title}</span>
                  {item.children && (
                    <svg 
                      className="w-2.5 h-2.5 opacity-40 group-hover:opacity-90 group-hover:rotate-180 transition-all duration-200" 
                      viewBox="0 0 10 6" 
                      fill="none"
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu on Hover */}
                {item.children && (
                  <div className="absolute top-[90%] left-0 pt-2 opacity-0 invisible translate-y-1.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="min-w-[190px] bg-[#DBD8CF] border border-[#bdb2a1]/60 py-3.5 px-5 shadow-2xl flex flex-col gap-2.5">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          className="text-[12px] tracking-wide text-[#1c1c1a]/80 hover:text-[#1c1c1a] hover:translate-x-1 transition-all whitespace-nowrap block"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Center: Brand Logo / Wordmark */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center hover:opacity-75 transition-opacity"
            aria-label="KSHAUM Home"
          >
            <Image 
              src="/KSHAUM.svg" 
              alt="KSHAUM" 
              width={220} 
              height={30} 
              priority
              className="h-3.5 sm:h-4 md:h-[18px] w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Right Section: Mobile (Search + Bag Icon) vs Desktop (Search, Login/Account, Bag) */}
        {/* Mobile View (< lg) */}
        <div className="flex lg:hidden items-center gap-3 sm:gap-4 text-[#1c1c1a]">
          <button 
            onClick={toggleSearch}
            aria-label="Search"
            className="p-1.5 hover:opacity-50 transition-opacity cursor-pointer focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <button 
            onClick={handleCartToggle}
            aria-label="Shopping Bag"
            className="p-1.5 hover:opacity-50 transition-opacity cursor-pointer focus:outline-none relative flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 sm:w-4.5 sm:h-4.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-[#1c1c1a] text-white text-[9px] leading-none rounded-full flex items-center justify-center font-medium">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop View (>= lg): Search, Login / Account, Bag */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] xl:text-[13px] text-[#1c1c1a] font-normal">
          <button 
            onClick={toggleSearch}
            className="hover:opacity-50 transition-opacity cursor-pointer focus:outline-none whitespace-nowrap py-4"
          >
            Search
          </button>

          {session?.user ? (
            <div className="relative group">
              <button
                className="hover:opacity-50 transition-opacity cursor-pointer focus:outline-none whitespace-nowrap flex items-center gap-1 py-4"
              >
                <span>Account</span>
                <svg 
                  className="w-2.5 h-2.5 opacity-40 group-hover:opacity-90 group-hover:rotate-180 transition-all duration-200" 
                  viewBox="0 0 10 6" 
                  fill="none" 
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="absolute top-[90%] right-0 pt-2 opacity-0 invisible translate-y-1.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="min-w-[180px] bg-[#DBD8CF] border border-[#bdb2a1]/60 py-3.5 px-5 shadow-2xl flex flex-col gap-2.5">
                  <span className="text-[11px] text-[#1c1c1a]/70 truncate pb-1.5 border-b border-[#bdb2a1]/60">
                    {session.user.name || session.user.email}
                  </span>
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="text-[12px] tracking-wide text-amber-900 hover:text-[#1c1c1a] hover:translate-x-1 transition-all">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-left text-[12px] tracking-wide text-[#1c1c1a]/80 hover:text-[#1c1c1a] hover:translate-x-1 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hover:opacity-50 transition-opacity whitespace-nowrap py-4"
            >
              Login
            </Link>
          )}

          <button 
            onClick={handleCartToggle}
            aria-label="Shopping Bag"
            className="hover:opacity-50 transition-opacity cursor-pointer focus:outline-none flex items-center gap-1 whitespace-nowrap py-4"
          >
            <span>Bag</span>
            <span>({totalCount})</span>
          </button>
        </div>
      </nav>

      {/* Shopping Bag Sliding Drawer */}
      <CartDrawer />

      {/* Right-Side Full-Height Search Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[480px] md:w-[540px] bg-[#DBD8CF] text-[#1c1c1a] transform transition-transform duration-300 ease-in-out z-[70] shadow-2xl flex flex-col justify-between border-l border-[#dcd8cf]
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
        className={`fixed top-0 left-0 h-screen w-[85%] sm:w-[50%] md:w-[380px] bg-[#DBD8CF] text-[#1c1c1a] transform transition-transform duration-300 ease-in-out z-[70] shadow-2xl flex flex-col justify-between border-r border-[#dcd8cf]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header & Close Button */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="flex justify-between items-center mb-8 border-b border-[#dcd8cf] pb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#bdb2a1] font-semibold">Navigation</span>
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

          {/* Main Navigation Links with Mobile Accordion */}
          <ul className="space-y-4 text-sm sm:text-base font-light text-[#1c1c1a]">
            {navigationLinks.map((item) => (
              <li key={item.title} className="border-b border-[#dcd8cf]/40 pb-3">
                <div className="flex items-center justify-between">
                  <Link 
                    href={item.href} 
                    onClick={toggleMenu} 
                    className="hover:opacity-60 transition-opacity font-normal"
                  >
                    {item.title}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => toggleMobileAccordion(item.title)}
                      className="p-2 text-stone-500 hover:text-black cursor-pointer"
                      aria-label={`Expand ${item.title}`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          expandedMobileItem === item.title ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 10 6"
                        fill="none"
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>

                {item.children && expandedMobileItem === item.title && (
                  <ul className="mt-2.5 pl-4 space-y-2 border-l border-[#dcd8cf]">
                    {item.children.map((sub) => (
                      <li key={sub.title}>
                        <Link
                          href={sub.href}
                          onClick={toggleMenu}
                          className="text-xs sm:text-sm text-stone-600 hover:text-black block py-1 transition-colors"
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="pt-2">
              <Link href="/innercircle" onClick={toggleMenu} className="hover:opacity-60 transition-opacity block py-1 text-xs uppercase tracking-widest text-stone-500">
                Saved / Inner Circle
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
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
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