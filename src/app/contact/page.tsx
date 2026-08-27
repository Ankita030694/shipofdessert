'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted with:', { name, phone, email, message });
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#bdb2a1] block mb-2">
              Get in Touch
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-[#1c1c1a]">
              CONTACT US
            </h1>
            <p className="mt-3 text-sm text-[#1c1c1a]/80">
              Please leave your details and we will respond promptly:
            </p>
          </div>

          {submitted && (
            <div className="p-4 mb-6 text-xs sm:text-sm bg-green-50 text-green-800 border border-green-200 rounded">
              Thank you. Your message has been sent successfully.
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1">
                Name* :
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
                placeholder="Your Full Name"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1">
                Phone Number :
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
                placeholder="Phone Number"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1">
                Email Address* :
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
                placeholder="Email Address"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1">
                Message* :
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none resize-none"
                placeholder="Your Message"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#1c1c1a] text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#333330] transition-colors cursor-pointer"
              >
                Submit Message
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
