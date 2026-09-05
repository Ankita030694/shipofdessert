'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'France',
  'Italy',
  'Germany',
  'Japan',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Switzerland',
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [country, setCountry] = useState('United States');
  const { currentLanguage, setLanguageByCode, languages } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Privacy Policy before subscribing.');
      return;
    }
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#DBD8CF] text-[#1c1c1a] border-t border-[#bdb2a1]/40">
      {/* ---------------- DESKTOP VIEW (md+) ---------------- */}
      <div className="hidden md:block max-w-7xl mx-auto pt-16 pb-12 px-6 sm:px-8 lg:px-12">
        {/* Main 5-Section Layout */}
        <div className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Section 1: Language & Country Selector (Left with Right Border) */}
          <div className="col-span-12 md:col-span-3 lg:col-span-3 pr-6 border-r border-[#dcd8cf]/80 space-y-6">
            {/* Language Selector */}
            <div>
              <span className="block text-xs sm:text-[13px] text-[#1c1c1a] font-normal mb-1">
                Choose language:
              </span>
              <div className="relative inline-block w-full">
                <select
                  value={currentLanguage?.code || 'en'}
                  onChange={(e) => setLanguageByCode(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#1c1c1a] py-0.5 pl-0 pr-6 border-none focus:outline-none cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0 top 50%',
                    backgroundSize: '8px auto'
                  }}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <span className="block text-xs sm:text-[13px] text-[#1c1c1a] font-normal mb-1">
                Select country:
              </span>
              <div className="relative inline-block w-full">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#1c1c1a] py-0.5 pl-0 pr-6 border-none focus:outline-none cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0 top 50%',
                    backgroundSize: '8px auto'
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Links Column 1 */}
          <div className="col-span-6 md:col-span-2 lg:col-span-2">
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#1c1c1a] font-normal">
              <li>
                <Link href="/care" className="hover:opacity-50 transition-opacity">
                  Care for a Lifetime
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-50 transition-opacity">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Links Column 2 */}
          <div className="col-span-6 md:col-span-2 lg:col-span-2">
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#1c1c1a] font-normal">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-50 transition-opacity"
                >
                  Instagram
                </a>
              </li>
              <li>
                <Link href="/shipping" className="hover:opacity-50 transition-opacity">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:opacity-50 transition-opacity">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/start-return" className="hover:opacity-50 transition-opacity">
                  Start a Return
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Links Column 3 */}
          <div className="col-span-6 md:col-span-2 lg:col-span-2">
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#1c1c1a] font-normal">
              <li>
                <Link href="/contact" className="hover:opacity-50 transition-opacity">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/legal-privacy" className="hover:opacity-50 transition-opacity">
                  Legal &amp; Privacy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:opacity-50 transition-opacity">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 5: Newsletter Subscription (Right) */}
          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <form onSubmit={handleSubscribe} className="max-w-sm">
              <span className="block text-xs sm:text-[13px] text-[#1c1c1a] font-normal mb-3">
                Subscribe to our Newsletter
              </span>

              <div className="relative border-b border-[#1c1c1a] pb-1.5 focus-within:border-black transition-colors flex items-center justify-between">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#1c1c1a] placeholder-[#1c1c1a]/60 focus:outline-none pr-6"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="text-[#1c1c1a] hover:opacity-50 transition-opacity text-sm font-light pl-2 cursor-pointer"
                >
                  &gt;
                </button>
              </div>

              {/* Checkbox Section */}
              <div className="flex items-start gap-2.5 mt-3.5">
                <input
                  type="checkbox"
                  id="footer-privacy-consent"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 h-3.5 w-3.5 rounded-none border-[#1c1c1a] text-[#1c1c1a] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="footer-privacy-consent"
                  className="text-[11px] sm:text-xs text-[#1c1c1a] leading-snug cursor-pointer select-none"
                >
                  I have read and understood the{' '}
                  <Link href="/privacy-policy" className="underline hover:opacity-60 text-[#1c1c1a]">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {subscribed && (
                <p className="text-xs text-green-700 mt-2">
                  Thank you for subscribing.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Centered Copyright Notice */}
        <div className="mt-20 pt-8 text-center text-xs sm:text-[13px] text-[#1c1c1a] font-normal">
          <p>KSHAUM © 2026</p>
        </div>
      </div>

      {/* ---------------- MOBILE VIEW (< md) ---------------- */}
      <div className="block md:hidden px-6 pt-12 pb-10 max-w-md mx-auto space-y-10">
        {/* Language & Country Selectors */}
        <div className="space-y-4 pb-6 border-b border-[#dcd8cf]">
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#1c1c1a] font-medium mb-1">
              Choose language:
            </span>
            <select
              value={currentLanguage?.code || 'en'}
              onChange={(e) => setLanguageByCode(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1c1c1a] py-1 border-b border-[#dcd8cf] focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wider text-[#1c1c1a] font-medium mb-1">
              Select country:
            </span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1c1c1a] py-1 border-b border-[#dcd8cf] focus:outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs sm:text-[13px] text-[#1c1c1a]">
          <div className="space-y-2.5">
            <div>
              <Link href="/care" className="hover:opacity-60 transition-opacity">
                Care for a Lifetime
              </Link>
            </div>
            <div>
              <Link href="/contact" className="hover:opacity-60 transition-opacity">
                Contact Us
              </Link>
            </div>
            <div>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                Instagram
              </a>
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <Link href="/shipping" className="hover:opacity-60 transition-opacity">
                Shipping
              </Link>
            </div>
            <div>
              <Link href="/return-policy" className="hover:opacity-60 transition-opacity">
                Return Policy
              </Link>
            </div>
            <div>
              <Link href="/start-return" className="hover:opacity-60 transition-opacity">
                Start a Return
              </Link>
            </div>
            <div>
              <Link href="/contact" className="hover:opacity-60 transition-opacity">
                FAQ
              </Link>
            </div>
            <div>
              <Link href="/legal-privacy" className="hover:opacity-60 transition-opacity">
                Legal &amp; Privacy
              </Link>
            </div>
            <div>
              <Link href="/privacy-policy" className="hover:opacity-60 transition-opacity">
                Accessibility
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Inline Subscription */}
        <div className="pt-4 border-t border-[#dcd8cf]">
          <form onSubmit={handleSubscribe} className="space-y-3">
            <span className="block text-xs uppercase tracking-wider text-[#1c1c1a] font-medium">
              Subscribe to our Newsletter
            </span>
            <div className="relative border-b border-[#1c1c1a] pb-1 flex items-center justify-between">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent text-xs text-[#1c1c1a] placeholder-[#1c1c1a]/60 focus:outline-none pr-6"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-[#1c1c1a] hover:opacity-60 text-sm pl-2 cursor-pointer font-light"
              >
                &gt;
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="mobile-footer-privacy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="h-3.5 w-3.5 rounded-none border-[#1c1c1a] text-[#1c1c1a] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="mobile-footer-privacy" className="text-[11px] text-[#1c1c1a]">
                I agree to the{' '}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {subscribed && (
              <p className="text-[11px] text-green-700 mt-2">
                Thank you for subscribing.
              </p>
            )}
          </form>
        </div>

        {/* Centered Copyright */}
        <div className="pt-6 border-t border-[#dcd8cf] text-center text-xs text-[#1c1c1a]">
          <p>KSHAUM © 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;