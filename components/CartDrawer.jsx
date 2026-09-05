'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, totalCount, subtotal, isCartOpen, closeCart, updateQuantity, removeItem } =
    useCart();

  // Close drawer on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* Sliding Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[460px] md:w-[500px] bg-[#DBD8CF] text-[#1c1c1a] transform transition-transform duration-300 ease-in-out z-[70] shadow-2xl flex flex-col justify-between border-l border-[#dcd8cf] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 sm:p-8 border-b border-[#dcd8cf] flex justify-between items-center bg-[#DBD8CF]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-[0.2em] font-serif font-medium">
              Shopping Bag
            </span>
            <span className="text-[10px] bg-[#1c1c1a] text-white px-2 py-0.5 rounded-full font-bold">
              {totalCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close Shopping Bag"
            className="p-1 -mr-2 text-stone-500 hover:text-[#1c1c1a] transition-colors cursor-pointer text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body / Items List */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-full border border-[#1c1c1a]/20 flex items-center justify-center mb-4 text-[#1c1c1a]/60">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-sm font-serif uppercase tracking-wider mb-2">Your Bag is Empty</h3>
              <p className="text-xs text-[#1c1c1a]/60 max-w-xs mb-8">
                Explore the latest silhouettes and handcrafted natural fibers in our collection.
              </p>
              <Link
                href="/collection"
                onClick={closeCart}
                className="px-6 py-3 bg-[#1c1c1a] text-white text-xs uppercase tracking-widest hover:bg-[#333330] transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#dcd8cf]">
              {items.map((item) => (
                <div key={item.id} className="pt-6 first:pt-0 pb-6 flex gap-4">
                  {/* Item Image */}
                  <div className="relative w-20 h-24 bg-[#e8e4dc]/40 rounded-xs overflow-hidden flex-shrink-0 border border-[#1c1c1a]/10">
                    <Image
                      src={item.image || '/image1.jpg'}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('data:'))}
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-xs sm:text-sm text-[#1c1c1a] hover:underline leading-snug line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs font-medium whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Variant Specs */}
                      <div className="flex gap-2 text-[11px] text-[#1c1c1a]/60 mt-1">
                        <span>Size: <strong className="text-[#1c1c1a]">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#1c1c1a]">{item.color}</strong></span>
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex justify-between items-center mt-3 pt-2">
                      <div className="flex items-center border border-[#1c1c1a]/20 bg-[#DBD8CF]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2.5 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] uppercase tracking-wider text-red-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout CTAs */}
        {items.length > 0 && (
          <div className="p-6 sm:p-8 border-t border-[#dcd8cf] bg-[#e8e4dc]/20 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#1c1c1a]/70">
                <span>Shipping</span>
                <span className="uppercase text-[10px] tracking-wider text-emerald-800 font-semibold">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-[#dcd8cf]">
                <span className="font-serif uppercase tracking-wider text-xs font-semibold">
                  Subtotal
                </span>
                <span className="font-serif text-base font-semibold text-[#1c1c1a]">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] text-[#1c1c1a]/50">All applicable taxes included.</div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-center hover:bg-[#333330] transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full border border-[#1c1c1a]/30 text-[#1c1c1a] py-2.5 text-xs uppercase tracking-widest text-center hover:bg-[#1c1c1a] hover:text-white transition-colors"
              >
                View Full Bag ({totalCount})
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Dimmed Overlay Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}
    </>
  );
}
