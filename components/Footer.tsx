'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../src/context/LanguageContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
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
    <footer className="w-full bg-white text-black pt-16 pb-20 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Newsletter + 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Newsletter Column (Left) */}
          <div className="md:col-span-5 lg:col-span-5 pr-0 md:pr-6">
            <form onSubmit={handleSubscribe} className="max-w-sm">
              <div className="relative border-b border-gray-400 pb-2 focus-within:border-black transition-colors flex items-center justify-between">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to our Newsletter"
                  required
                  className="w-full bg-transparent text-xs sm:text-[13px] text-black placeholder-gray-800 focus:outline-none pr-6"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-gray-700 hover:text-black transition-colors text-sm font-light pl-2"
                >
                  &gt;
                </button>
              </div>

              {/* Checkbox Section */}
              <div className="flex items-start gap-2.5 mt-4">
                <input
                  type="checkbox"
                  id="footer-privacy-consent"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 h-3.5 w-3.5 rounded-none border-gray-400 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="footer-privacy-consent"
                  className="text-[11px] sm:text-xs text-gray-800 leading-snug cursor-pointer select-none"
                >
                  I have read and understood the{' '}
                  <Link href="/privacy-policy" className="hover:underline text-black">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {subscribed && (
                <p className="text-xs text-green-700 mt-2">
                  Thank you for subscribing to our newsletter.
                </p>
              )}
            </form>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 lg:col-span-2">
            <ul className="space-y-2 text-xs sm:text-[13px] text-black">
              <li>
                <Link href="/collection" className="hover:opacity-70 transition-opacity">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-70 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-70 transition-opacity">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:opacity-70 transition-opacity">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:opacity-70 transition-opacity">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:opacity-70 transition-opacity">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy#cookies" className="hover:opacity-70 transition-opacity">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 lg:col-span-3">
            <ul className="space-y-2 text-xs sm:text-[13px] text-black">
              <li>
                <Link href="/terms-and-conditions" className="hover:opacity-70 transition-opacity">
                  Legal Notices
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:opacity-70 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy#cookies" className="hover:opacity-70 transition-opacity">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-70 transition-opacity">
                  Career
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="http://www.thekshaum.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Official Website
                </a>
              </li>
              <li>
                <Link href="/privacy-policy#your-rights" className="hover:opacity-70 transition-opacity">
                  Your Privacy Choices
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Selector Column (Right) */}
          <div className="md:col-span-3 lg:col-span-2">
            <div className="space-y-1">
              <span className="block text-xs sm:text-[13px] text-black font-normal">
                Choose language:
              </span>
              <div className="relative inline-block w-full">
                <select
                  value={currentLanguage?.code || 'en'}
                  onChange={(e) => setLanguageByCode(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-black py-0.5 pl-0 pr-6 border-none focus:outline-none cursor-pointer appearance-none"
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
          </div>

        </div>

        {/* Centered Copyright Notice */}
        <div className="mt-24 sm:mt-32 text-center">
          <p className="text-xs sm:text-[13px] text-black tracking-normal font-normal">
            A.PRESSE © 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;