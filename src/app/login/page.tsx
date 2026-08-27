'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // Mock Form Submit Handler (Ready for Firebase Auth signInWithEmailAndPassword integration)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);

    // Mock Authentication Delay
    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: 'success',
        text: 'Login successful! (Frontend UI Mock - Firebase Auth will be connected here)'
      });
      // Future Firebase logic:
      // await signInWithEmailAndPassword(auth, email, password);
      // router.push('/account');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Header Title */}
          <h1 className="text-center font-bold text-base sm:text-lg tracking-widest uppercase text-black mb-8">
            LOGIN
          </h1>

          {/* Subtitle */}
          <p className="text-sm font-normal text-black mb-8">
            Enter your email and password to login:
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="login-email" 
                className="block font-bold text-xs sm:text-sm text-black mb-1"
              >
                Email* :
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent text-sm text-black placeholder-gray-500 border-b border-black py-2 focus:outline-none"
              />
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="pt-2">
              <label 
                htmlFor="login-password" 
                className="block font-bold text-xs sm:text-sm text-black mb-1"
              >
                Password* :
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent text-sm text-black placeholder-gray-500 border-b border-black py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black focus:outline-none p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right pt-1 pb-2">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-black underline hover:opacity-70 transition-opacity"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Create an Account Section */}
          <div className="mt-14 text-center">
            <h2 className="font-bold text-xs sm:text-sm tracking-widest uppercase text-black mb-4">
              CREATE AN ACCOUNT
            </h2>
            <Link
              href="/signup"
              className="block w-full bg-black text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors text-center cursor-pointer"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
