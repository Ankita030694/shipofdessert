'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, totalCount, clearCart, loading: cartLoading } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    customerNotes: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto fill name & email if logged in
  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name || '';
      const parts = fullName.split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lName,
        email: prev.email || session.user?.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your contact name, email, and phone number.');
      return;
    }

    if (!formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please enter your complete shipping address (House/Street, City, State, PIN code).');
      return;
    }

    try {
      setIsSubmitting(true);
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

      const payload = {
        customer: {
          name: fullName,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          fullName,
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          country: formData.country,
          phone: formData.phone.trim(),
        },
        items,
        subtotal,
        shippingFee: 0,
        taxAmount: 0,
        discount: 0,
        totalAmount: subtotal,
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order. Please try again.');
      }

      // Clear Cart in local state & storage
      await clearCart();

      // Redirect to Order Success Page
      const orderNum = encodeURIComponent(data.data?.orderNumber || '#1025');
      router.push(`/checkout/success?orderNumber=${orderNum}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1F1D1A] text-[#F4F4F1] font-sans">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="border-b border-[#F4F4F1]/15 pb-6 mb-8 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-bold block mb-1">
            Atelier Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-[#F4F4F1]">
            Shipping & Order Confirmation
          </h1>
        </div>

        {cartLoading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#F4F4F1]/60">
            Preparing your luxury selection...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#1F1D1A] p-12 rounded-sm border border-[#F4F4F1]/10 max-w-xl mx-auto text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-full border border-[#F4F4F1]/15 bg-[#1F1D1A] flex items-center justify-center mx-auto text-[#F4F4F1]/60">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-serif uppercase tracking-wider text-[#F4F4F1]">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs text-[#F4F4F1]/60 mt-2">
                Explore our handcrafted garments, organic textiles, and relaxed silhouettes.
              </p>
            </div>
            <Link
              href="/collection"
              className="inline-block bg-[#F4F4F1] text-[#1F1D1A] px-8 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#eaeae7] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            {/* LEFT COLUMN: Shipping & Customer Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <form onSubmit={handleSubmitOrder} className="space-y-8">
                {/* 1. Contact Information */}
                <div className="bg-[#1F1D1A] p-6 sm:p-8 rounded-sm border border-[#F4F4F1]/10 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F4F4F1]/10 pb-3">
                    <h2 className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#F4F4F1]">
                      1. Contact Information
                    </h2>
                    {session?.user ? (
                      <span className="text-[11px] text-emerald-300 font-medium">
                        ✓ Signed in as {session.user.name || session.user.email}
                      </span>
                    ) : (
                      <Link
                        href="/login?callbackUrl=/checkout"
                        className="text-[11px] text-[#F4F4F1]/80 hover:text-[#F4F4F1] underline"
                      >
                        Sign in for faster checkout
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                        Mobile Phone* (For courier tracking updates)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-[#1F1D1A] p-6 sm:p-8 rounded-sm border border-[#F4F4F1]/10 shadow-xs space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#F4F4F1] border-b border-[#F4F4F1]/10 pb-3">
                    2. Shipping Address
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Arjun"
                          className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Sodhi"
                          className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                        Street Address / Flat / Building*
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        required
                        value={formData.addressLine1}
                        onChange={handleChange}
                        placeholder="Flat 402, Lodha Bellissimo, NM Joshi Marg"
                        className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                        Apartment, Suite, Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Near Mahalaxmi Station"
                        className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                          State*
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1]"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                          PIN Code*
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="400011"
                          className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs focus:outline-none focus:border-[#F4F4F1] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method Selection */}
                <div className="bg-[#1F1D1A] p-6 sm:p-8 rounded-sm border border-[#F4F4F1]/10 shadow-xs space-y-4">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#F4F4F1] border-b border-[#F4F4F1]/10 pb-3">
                    3. Payment Method
                  </h2>

                  <div className="space-y-3">
                    {/* COD Option (Active) */}
                    <label
                      className={`block p-4 rounded-xs border cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#F4F4F1] bg-[#1F1D1A]/80 shadow-xs'
                          : 'border-[#F4F4F1]/20 hover:border-[#F4F4F1]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleChange}
                            className="text-[#F4F4F1] focus:ring-0"
                          />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#F4F4F1] block">
                              💵 Cash on Delivery (COD)
                            </span>
                            <span className="text-[11px] text-[#F4F4F1]/60 block mt-0.5">
                              Pay in cash or UPI QR to the courier agent upon doorstep delivery.
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Instant Placement
                        </span>
                      </div>
                    </label>

                    {/* Online Gateway Option (Placeholder badge) */}
                    <div className="p-4 rounded-xs border border-[#F4F4F1]/20 bg-[#1F1D1A]/40 opacity-60 flex justify-between items-center cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <input type="radio" disabled />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#F4F4F1]/80 block">
                            💳 Online Payment (UPI / Cards / NetBanking)
                          </span>
                          <span className="text-[11px] text-[#F4F4F1]/60 block mt-0.5">
                            Razorpay / PayU Gateway
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-[#F4F4F1]/60 bg-[#2e2a25] px-2 py-0.5 rounded-full">
                        Gateway Setup Next
                      </span>
                    </div>
                  </div>

                  {/* Customer Special Note */}
                  <div className="pt-2">
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#F4F4F1]/80 mb-1">
                      Delivery Instructions or Atelier Notes (Optional)
                    </label>
                    <textarea
                      name="customerNotes"
                      rows={2}
                      value={formData.customerNotes}
                      onChange={handleChange}
                      placeholder="e.g. Please call before delivery, or leave with security."
                      className="w-full bg-[#1F1D1A]/60 border border-[#F4F4F1]/20 p-2.5 rounded-xs text-xs focus:outline-none focus:border-[#F4F4F1] resize-none"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#F4F4F1] text-[#1F1D1A] py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#eaeae7] transition-colors cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Placing Order #{totalCount} Items...</span>
                    </>
                  ) : (
                    <span>Place Order (Cash on Delivery) · ₹{subtotal.toLocaleString()}</span>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: Order Summary (5 Cols) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="bg-[#1F1D1A] p-6 sm:p-8 rounded-sm border border-[#F4F4F1]/10 shadow-xs space-y-6">
                <div className="flex justify-between items-center border-b border-[#F4F4F1]/10 pb-3">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#F4F4F1]">
                    Order Summary ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                  </h2>
                  <Link href="/cart" className="text-[11px] text-[#F4F4F1]/60 hover:text-[#F4F4F1] underline">
                    Edit Bag
                  </Link>
                </div>

                {/* Line items */}
                <div className="divide-y divide-[#F4F4F1]/10 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-16 bg-[#2a2723]/40 rounded-xs overflow-hidden flex-shrink-0 border border-[#F4F4F1]/10">
                          <Image
                            src={item.image || '/image1.jpg'}
                            alt={item.name}
                            fill
                            unoptimized={Boolean(item.image?.startsWith('data:'))}
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] px-1 font-bold">
                            ×{item.quantity}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#F4F4F1] line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[#F4F4F1]/60 mt-0.5">
                            {item.size} / {item.color}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-medium text-xs text-[#F4F4F1]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Calculation */}
                <div className="border-t border-[#F4F4F1]/10 pt-4 space-y-2 text-xs text-[#F4F4F1]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Domestic Shipping</span>
                    <span className="text-emerald-300 font-semibold uppercase text-[11px]">
                      Complimentary (Free)
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#F4F4F1] border-t border-[#F4F4F1]/10 pt-3">
                    <span>Total Payable</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-[#F4F4F1]/50 block text-right">
                    Inclusive of all applicable GST
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="border-t border-[#F4F4F1]/10 pt-4 space-y-2 text-[11px] text-[#F4F4F1]/60">
                  <div className="flex items-center gap-2">
                    <span>🌿</span>
                    <span>100% Handcrafted Organic Textiles & French Seams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    <span>3–5 Business Days Express Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>256-Bit SSL Encrypted & Verified Checkout</span>
                  </div>
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
