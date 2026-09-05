'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '#1025';

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Thank you card */}
      <div className="bg-[#DBD8CF] p-8 sm:p-12 rounded-sm border border-[#1c1c1a]/15 shadow-xl text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-bold block mb-2">
            Order Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-[#1c1c1a]">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#1c1c1a]/70 mt-2 max-w-md mx-auto leading-relaxed">
            Your garment selection has been registered with our Rajasthan atelier.
          </p>
        </div>

        {/* Order Identifier Banner */}
        <div className="bg-[#DBD8CF]/80 border border-[#1c1c1a]/10 p-5 rounded-xs space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#1c1c1a]/60">
            Order Reference Number
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#1c1c1a]">
            {orderNumber}
          </div>
          <div className="text-[11px] text-stone-500">
            Payment Mode: <strong className="text-[#1c1c1a]">Cash on Delivery (COD)</strong>
          </div>
        </div>

        {/* Order Lifecycle Progress */}
        <div className="border-t border-b border-[#1c1c1a]/10 py-6 text-left space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1a]">
            Delivery Lifecycle
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#DBD8CF]/60 rounded-xs border border-emerald-300">
              <span className="text-emerald-700 font-bold block text-[11px]">1. Placed</span>
              <span className="text-[10px] text-stone-500">Registered</span>
            </div>
            <div className="p-3 bg-[#DBD8CF]/60 rounded-xs border border-stone-200">
              <span className="text-[#1c1c1a] font-semibold block text-[11px]">2. Atelier Pack</span>
              <span className="text-[10px] text-stone-500">Handcrafted QC</span>
            </div>
            <div className="p-3 bg-[#DBD8CF]/60 rounded-xs border border-stone-200">
              <span className="text-[#1c1c1a] font-semibold block text-[11px]">3. Courier Waybill</span>
              <span className="text-[10px] text-stone-500">Blue Dart / Delhivery</span>
            </div>
            <div className="p-3 bg-[#DBD8CF]/60 rounded-xs border border-stone-200">
              <span className="text-[#1c1c1a] font-semibold block text-[11px]">4. Doorstep</span>
              <span className="text-[10px] text-stone-500">3–5 Business Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/collection"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1c1c1a] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors shadow-xs"
          >
            Explore More Collections
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#1c1c1a]/20 text-xs uppercase tracking-widest font-medium hover:bg-stone-100 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#DBD8CF] text-[#1c1c1a] font-sans">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
              Loading confirmation...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
