'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, totalCount, subtotal, updateQuantity, removeItem, clearCart, loading } =
    useCart();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#635F58] text-[#F4F4F1]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="border-b border-[#F4F4F1]/20 pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-1">
              Your Selection
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-light tracking-wide uppercase">
              Shopping Bag
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#F4F4F1]/60">
                {totalCount} {totalCount === 1 ? 'Garment' : 'Garments'}
              </span>
              <button
                onClick={clearCart}
                className="underline text-[#F4F4F1]/60 hover:text-red-400 uppercase tracking-wider text-[11px] cursor-pointer"
              >
                Clear Bag
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && items.length === 0 ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#F4F4F1]/60">
            Loading your selection...
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag State */
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full border border-[#F4F4F1]/15 flex items-center justify-center mx-auto mb-6 text-[#F4F4F1]/60">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-serif uppercase tracking-wider mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-[#F4F4F1]/70 leading-relaxed mb-8">
              Explore our current collection of handcrafted garments and timeless silhouettes.
            </p>
            <Link
              href="/collection"
              className="inline-block bg-[#F4F4F1] text-[#635F58] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#eaeae7] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* 2-Column Bag Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 8 Cols: Line Items Table */}
            <div className="lg:col-span-8 bg-[#635F58] border border-[#F4F4F1]/10 rounded-sm divide-y divide-[#F4F4F1]/10 p-6 sm:p-8 shadow-xs">
              {items.map((item) => (
                <div key={item.id} className="pt-6 first:pt-0 pb-6 flex flex-col sm:flex-row gap-5">
                  {/* Garment Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative w-24 sm:w-28 aspect-[3/4] bg-[#58544e]/40 rounded-xs overflow-hidden flex-shrink-0 border border-[#F4F4F1]/10"
                  >
                    <Image
                      src={item.image || '/image1.jpg'}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('data:'))}
                      className="object-cover"
                      sizes="112px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-serif text-sm sm:text-base text-[#F4F4F1] hover:underline"
                          >
                            {item.name}
                          </Link>
                          <div className="flex flex-wrap gap-2 text-xs text-[#F4F4F1]/60 mt-1">
                            <span>Size: <strong className="text-[#F4F4F1]">{item.size}</strong></span>
                            <span>•</span>
                            <span>Color: <strong className="text-[#F4F4F1]">{item.color}</strong></span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-sm sm:text-base font-medium">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#F4F4F1]/50">
                              (₹{item.price.toLocaleString()} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Remove Action */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#F4F4F1]/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#F4F4F1]/60">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-[#F4F4F1]/20 bg-[#635F58]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-xs hover:bg-[#524E48] transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-xs hover:bg-[#524E48] transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] uppercase tracking-wider text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 4 Cols: Order Summary */}
            <div className="lg:col-span-4 bg-[#635F58] border border-[#F4F4F1]/10 rounded-sm p-6 sm:p-8 shadow-xs sticky top-28 space-y-6">
              <h2 className="font-serif text-base uppercase tracking-wider border-b border-[#F4F4F1]/10 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#F4F4F1]/70">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-medium text-[#F4F4F1]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-[#F4F4F1]/70">
                  <span>Shipping & Delivery</span>
                  <span className="uppercase text-[10px] tracking-wider text-emerald-300 font-semibold bg-emerald-900/30 px-2 py-0.5 border border-emerald-500/30">
                    Complimentary
                  </span>
                </div>

                <div className="flex justify-between text-[#F4F4F1]/70">
                  <span>Estimated Taxes</span>
                  <span className="text-[#F4F4F1]/50">Included in garment price</span>
                </div>

                <div className="border-t border-[#F4F4F1]/10 pt-3 flex justify-between items-baseline">
                  <span className="font-serif uppercase tracking-wider text-sm font-semibold">
                    Estimated Total
                  </span>
                  <span className="font-serif text-lg font-bold text-[#F4F4F1]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/checkout"
                  className="block w-full bg-[#F4F4F1] text-[#635F58] py-4 text-xs font-medium uppercase tracking-[0.2em] text-center hover:bg-[#eaeae7] transition-colors"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  href="/collection"
                  className="block w-full text-center text-xs text-[#F4F4F1]/70 hover:underline tracking-wider py-1"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust badges */}
              <div className="border-t border-[#F4F4F1]/10 pt-4 space-y-2 text-[11px] text-[#F4F4F1]/70">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Complimentary Shipping Across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>7-Day Complimentary Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
