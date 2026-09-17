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
      <div className="bg-[#1F1D1A] p-8 sm:p-12 rounded-sm border border-[#F4F4F1]/15 shadow-xl text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-bold block mb-2">
            Order Confirmation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-[#F4F4F1]">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#F4F4F1]/70 mt-2 max-w-md mx-auto leading-relaxed">
            Your garment selection has been registered with our Rajasthan atelier.
          </p>
        </div>

        {/* Order Identifier Banner */}
        <div className="bg-[#1F1D1A]/80 border border-[#F4F4F1]/10 p-5 rounded-xs space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#F4F4F1]/60">
            Order Reference Number
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F1]">
            {orderNumber}
          </div>
          <div className="text-[11px] text-[#F4F4F1]/60">
            Payment Mode: <strong className="text-[#F4F4F1]">Cash on Delivery (COD)</strong>
          </div>
        </div>

        {/* Order Lifecycle Progress */}
        <div className="border-t border-b border-[#F4F4F1]/10 py-6 text-left space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F1]">
            Delivery Lifecycle
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#1F1D1A]/60 rounded-xs border border-emerald-300">
              <span className="text-emerald-300 font-bold block text-[11px]">1. Placed</span>
              <span className="text-[10px] text-[#F4F4F1]/60">Registered</span>
            </div>
            <div className="p-3 bg-[#1F1D1A]/60 rounded-xs border border-[#F4F4F1]/20">
              <span className="text-[#F4F4F1] font-semibold block text-[11px]">2. Atelier Pack</span>
              <span className="text-[10px] text-[#F4F4F1]/60">Handcrafted QC</span>
            </div>
            <div className="p-3 bg-[#1F1D1A]/60 rounded-xs border border-[#F4F4F1]/20">
              <span className="text-[#F4F4F1] font-semibold block text-[11px]">3. Courier Waybill</span>
              <span className="text-[10px] text-[#F4F4F1]/60">Blue Dart / Delhivery</span>
            </div>
            <div className="p-3 bg-[#1F1D1A]/60 rounded-xs border border-[#F4F4F1]/20">
              <span className="text-[#F4F4F1] font-semibold block text-[11px]">4. Doorstep</span>
              <span className="text-[10px] text-[#F4F4F1]/60">3–5 Business Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/collection"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#F4F4F1] text-[#1F1D1A] text-xs uppercase tracking-widest font-medium hover:bg-[#eaeae7] transition-colors shadow-xs"
          >
            Explore More Collections
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#F4F4F1]/20 text-xs uppercase tracking-widest font-medium hover:bg-[#F4F4F1] hover:text-[#1F1D1A] transition-colors"
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
    <div className="min-h-screen flex flex-col justify-between bg-[#1F1D1A] text-[#F4F4F1] font-sans">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs uppercase tracking-widest text-[#F4F4F1]/60">
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
