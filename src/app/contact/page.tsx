'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1F1D1A] text-[#F4F4F1]">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-24 px-5 sm:px-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-[440px] mx-auto">
          
          {/* Title: CONTACT */}
          <h1 className="text-center font-bold text-sm sm:text-base tracking-[0.22em] uppercase text-[#F4F4F1] mb-12 sm:mb-14">
            CONTACT
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs sm:text-[13px] font-bold text-[#F4F4F1] mb-2">
                Name* :
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full bg-transparent border-b border-[#F4F4F1] pb-2 text-xs sm:text-[13px] text-[#F4F4F1] placeholder-[#F4F4F1]/50 focus:outline-none focus:border-black rounded-none transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="contact-email" className="block text-xs sm:text-[13px] font-bold text-[#F4F4F1] mb-2">
                Email Address* :
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-[#F4F4F1] pb-2 text-xs sm:text-[13px] text-[#F4F4F1] placeholder-[#F4F4F1]/50 focus:outline-none focus:border-black rounded-none transition-colors"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="block text-xs sm:text-[13px] font-bold text-[#F4F4F1] mb-2">
                Subject* :
              </label>
              <div className="relative">
                <select
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-[#F4F4F1] pb-2 pr-8 text-xs sm:text-[13px] text-[#F4F4F1] focus:outline-none focus:border-black appearance-none rounded-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-400">
                    Inquiry Item
                  </option>
                  <option value="Inquiry Item" className="text-[#F4F4F1]">
                    Inquiry Item
                  </option>
                  <option value="Product Details & Sizing" className="text-[#F4F4F1]">
                    Product Details & Sizing
                  </option>
                  <option value="Order & Shipping Support" className="text-[#F4F4F1]">
                    Order & Shipping Support
                  </option>
                  <option value="Care for a Lifetime & Repairs" className="text-[#F4F4F1]">
                    Care for a Lifetime & Repairs
                  </option>
                  <option value="Bespoke & Atelier Appointment" className="text-[#F4F4F1]">
                    Bespoke & Atelier Appointment
                  </option>
                  <option value="Press & Editorial" className="text-[#F4F4F1]">
                    Press & Editorial
                  </option>
                  <option value="General Inquiries" className="text-[#F4F4F1]">
                    General Inquiries
                  </option>
                </select>
                <div className="absolute right-0 bottom-2.5 pointer-events-none text-[#F4F4F1]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs sm:text-[13px] font-bold text-[#F4F4F1] mb-2.5">
                Message* :
              </label>
              <textarea
                id="contact-message"
                required
                rows={7}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message"
                className="w-full bg-transparent border border-[#F4F4F1]/50 p-3 sm:p-4 text-xs sm:text-[13px] text-[#F4F4F1] placeholder-[#F4F4F1]/50 focus:outline-none focus:border-[#F4F4F1] rounded-none resize-y min-h-[170px] transition-colors"
              ></textarea>
            </div>

            {/* Submit Notification */}
            {submitted && (
              <div className="p-3 bg-[#2a2723]/40 border border-[#F4F4F1]/20 text-center text-xs text-[#F4F4F1] tracking-wide">
                Thank you. Your message has been received by the KSHAUM concierge.
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#F4F4F1] hover:bg-[#e4e4e1] text-[#1F1D1A] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}

