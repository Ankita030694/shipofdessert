'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
    <footer className="w-full bg-[#f5f5f5] text-[#1c1c1a] border-t border-[#dcd8cf]">
      {/* ---------------- MOBILE VIEW (< md) ---------------- */}
      <div className="block md:hidden px-6 pt-16 pb-12 text-center max-w-md mx-auto">
        {/* Choose Language Section */}
        <div className="mb-10">
          <span className="block text-xs uppercase tracking-widest font-bold text-black mb-1">
            CHOOSE LANGUAGE
          </span>
          <div className="relative inline-block">
            <select
              value={currentLanguage?.code || 'en'}
              onChange={(e) => setLanguageByCode(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-widest font-bold text-black py-1 px-4 border-none focus:outline-none cursor-pointer appearance-none text-center"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0 top 50%',
                backgroundSize: '8px auto'
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vertical Links List */}
        <div className="space-y-3.5 text-xs sm:text-[13px] text-black font-normal mb-16">
          <div>
            <Link href="/contact" className="hover:opacity-60 transition-opacity">
              Contact us
            </Link>
          </div>
          <div>
            <Link href="/shipping" className="hover:opacity-60 transition-opacity">
              Shipping
            </Link>
          </div>
          <div>
            <Link href="/faq" className="hover:opacity-60 transition-opacity">
              FAQ
            </Link>
          </div>
          <div>
            <Link href="/return-policy" className="hover:opacity-60 transition-opacity">
              Return &amp; refund
            </Link>
          </div>
          <div>
            <Link href="/care" className="hover:opacity-60 transition-opacity">
              Care for a Lifetime
            </Link>
          </div>
          <div>
            <Link href="/terms-and-conditions" className="hover:opacity-60 transition-opacity">
              Terms of use
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy#cookies" className="hover:opacity-60 transition-opacity">
              Cookies policies
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy" className="hover:opacity-60 transition-opacity">
              Privacy policies
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy#cookies" className="hover:opacity-60 transition-opacity">
              Cookie setting
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy#your-rights" className="hover:opacity-60 transition-opacity">
              Your privacy choices
            </Link>
          </div>
        </div>

        {/* Newsletter Inline Collapsible/Direct Subscription for Mobile if needed */}
        <div className="mb-12">
          <form onSubmit={handleSubscribe} className="max-w-xs mx-auto">
            <div className="relative border-b border-[#1c1c1a] pb-1 flex items-center justify-between">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe to our newsletter"
                required
                className="w-full bg-transparent text-xs text-[#1c1c1a] placeholder-[#1c1c1a] focus:outline-none pr-6 text-center"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-[#1c1c1a] hover:opacity-60 text-sm pl-2 cursor-pointer font-light"
              >
                &gt;
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <input
                type="checkbox"
                id="mobile-footer-privacy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="h-3 w-3 rounded-none border-[#1c1c1a] text-[#1c1c1a] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="mobile-footer-privacy" className="text-[10px] text-[#1c1c1a]/80">
                I agree to the{' '}
                <Link href="/privacy-policy" className="underline font-medium">
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

        {/* Bottom 3-Column Spaced Bar */}
        <div className="pt-8 border-t border-[#dcd8cf] flex items-center justify-between text-[11px] sm:text-xs text-black font-normal">
          <div className="text-left">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              Instagram
            </a>
          </div>
          <div className="text-center px-2">
            <span className="opacity-80">
              KSHAUM © 2026
            </span>
          </div>
          <div className="text-right">
            <span className="opacity-80">
              Crafted by 13
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- DESKTOP VIEW (md+) ---------------- */}
      <div className="hidden md:block max-w-7xl mx-auto pt-16 pb-20 px-6 sm:px-12 md:px-16 lg:px-24">
        {/* Main Grid: Newsletter + 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Newsletter Column (Left) */}
          <div className="md:col-span-5 lg:col-span-5 pr-0 md:pr-6">
            <form onSubmit={handleSubscribe} className="max-w-sm">
              <div className="relative border-b border-[#bdb2a1] pb-2 focus-within:border-[#1c1c1a] transition-colors flex items-center justify-between">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to our Newsletter"
                  required
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#1c1c1a] placeholder-[#1c1c1a]/70 focus:outline-none pr-6"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-[#1c1c1a] hover:text-[#bdb2a1] transition-colors text-sm font-light pl-2 cursor-pointer"
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
                  className="mt-0.5 h-3.5 w-3.5 rounded-none border-[#bdb2a1] text-[#1c1c1a] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="footer-privacy-consent"
                  className="text-[11px] sm:text-xs text-[#1c1c1a]/90 leading-snug cursor-pointer select-none"
                >
                  I have read and understood the{' '}
                  <Link href="/privacy-policy" className="hover:underline text-[#1c1c1a] font-medium">
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
                <Link href="/care" className="hover:opacity-70 transition-opacity">
                  Care for a Lifetime
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
                  Return &amp; Refund
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
        <div className="mt-24 sm:mt-32 flex items-center justify-between text-xs sm:text-[13px] text-black tracking-normal font-normal">
          <div>
            <p>KSHAUM © 2026</p>
          </div>
          <div>
            <p className="text-black/70">Crafted by 13</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;