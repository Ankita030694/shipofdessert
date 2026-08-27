import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Concierge & Contact — KSHAUM',
  description: 'Connect with the KSHAUM concierge for inquiries regarding orders, sizing, bespoke textile requests, and appointments.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#bdb2a1] block mb-3">
            Atelier & Concierge
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-widest uppercase text-[#1c1c1a]">
            CONNECT WITH KSHAUM
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#1c1c1a]/70 max-w-md mx-auto leading-relaxed">
            Our concierge team is available to assist with styling consultations, bespoke requests, and order assistance.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Direct Concierge Inquiries */}
          <div className="bg-white p-8 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#bdb2a1] block mb-2">
              Customer Care & Concierge
            </span>
            <h2 className="text-lg font-serif text-[#1c1c1a] mb-3">Client Services</h2>
            <p className="text-xs text-[#1c1c1a]/70 leading-relaxed mb-6">
              For order inquiries, garment measurements, and textile consultations:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#1c1c1a]/50 uppercase tracking-wider text-[10px] block">Email</span>
                <a
                  href="mailto:concierge@thekshaum.com"
                  className="font-medium text-[#1c1c1a] hover:underline"
                >
                  concierge@thekshaum.com
                </a>
              </div>
              <div className="pt-2">
                <span className="text-[#1c1c1a]/50 uppercase tracking-wider text-[10px] block">Hours</span>
                <span className="text-[#1c1c1a]/80">Monday – Friday: 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Press, Wholesale & Partnerships */}
          <div className="bg-white p-8 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#bdb2a1] block mb-2">
              Editorial & Press
            </span>
            <h2 className="text-lg font-serif text-[#1c1c1a] mb-3">Press & Partnerships</h2>
            <p className="text-xs text-[#1c1c1a]/70 leading-relaxed mb-6">
              For editorial loans, press features, and curated stockist inquiries:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#1c1c1a]/50 uppercase tracking-wider text-[10px] block">Press Contact</span>
                <a
                  href="mailto:press@thekshaum.com"
                  className="font-medium text-[#1c1c1a] hover:underline"
                >
                  press@thekshaum.com
                </a>
              </div>
              <div className="pt-2">
                <span className="text-[#1c1c1a]/50 uppercase tracking-wider text-[10px] block">Atelier</span>
                <span className="text-[#1c1c1a]/80">By private appointment only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Invitation */}
        <div className="bg-[#e8e4dc]/30 border border-[#dcd8cf] p-8 text-center rounded-sm">
          <h3 className="text-base font-serif uppercase tracking-wider mb-2">
            Become a Registered Member
          </h3>
          <p className="text-xs text-[#1c1c1a]/70 max-w-md mx-auto mb-6">
            Join the KSHAUM Inner Circle for early collection previews, priority allocations, and personalized styling services.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-[#1c1c1a] text-white text-xs uppercase tracking-widest hover:bg-[#333330] transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/collection"
              className="px-6 py-2.5 border border-[#1c1c1a]/30 text-xs uppercase tracking-widest hover:bg-[#1c1c1a] hover:text-white transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
