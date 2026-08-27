'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-3xl font-light font-serif mb-4 text-black">Shopping Bag</h1>
        <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm mt-8">
          <p className="text-gray-600 text-base mb-6">Your shopping bag is currently empty.</p>
          <Link
            href="/collection"
            className="inline-block bg-black text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
