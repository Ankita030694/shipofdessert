'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock Password Reset Handler (Ready for Firebase Auth sendPasswordResetEmail integration)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: 'success',
        text: 'Password reset link sent to your email! (Frontend UI Mock - Firebase Auth will be connected here)'
      });
      // Future Firebase logic:
      // await sendPasswordResetEmail(auth, email);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Header Title */}
          <h1 className="text-center font-bold text-base sm:text-lg tracking-widest uppercase text-black mb-8">
            RESET YOUR PASSWORD
          </h1>

          {/* Subtitle */}
          <p className="text-sm font-normal text-black mb-8 text-center sm:text-left">
            We will send you an email to reset your password.
          </p>

          {/* Feedback message banner */}
          {message && (
            <div
              className={`p-3.5 mb-6 text-xs sm:text-sm rounded ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label 
                htmlFor="reset-email" 
                className="block font-bold text-xs sm:text-sm text-black mb-1"
              >
                Email* :
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent text-sm text-black placeholder-gray-500 border-b border-black py-2 focus:outline-none"
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>

              <Link
                href="/login"
                className="block w-full text-center text-xs sm:text-sm text-black underline hover:opacity-75 py-2"
              >
                Cancel
              </Link>
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
