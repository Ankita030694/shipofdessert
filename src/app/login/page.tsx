'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isAdminLogin = callbackUrl.includes('/admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setMessage({ type: 'error', text: 'Invalid email or password. Please try again.' });
      } else {
        setMessage({
          type: 'success',
          text: 'Login successful! Redirecting...',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An unexpected error occurred during login.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Title */}
      <h1 className="text-center font-bold text-base sm:text-lg tracking-widest uppercase text-[#F4F4F1] mb-3 font-serif">
        {isAdminLogin ? 'ADMIN LOGIN' : 'LOGIN'}
      </h1>

      {/* Subtitle */}
      <p className="text-sm font-normal text-[#F4F4F1]/80 mb-8 text-center sm:text-left">
        {isAdminLogin
          ? 'Enter your verified administrator credentials to access management:'
          : 'Enter your email and password to access your account:'}
      </p>

      {/* Feedback message banner */}
      {message && (
        <div
          className={`p-3.5 mb-6 text-xs sm:text-sm rounded border ${
            message.type === 'success'
              ? 'bg-stone-100 text-[#F4F4F1] border-[#F4F4F1]/20'
              : 'bg-red-50 text-red-800 border-red-200'
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
            className="block font-bold text-xs sm:text-sm text-[#F4F4F1] mb-1"
          >
            Email* :
          </label>
          <input
            id="login-email"
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full bg-transparent text-sm text-[#F4F4F1] placeholder-[#F4F4F1]/60 border-b border-[#F4F4F1] py-2 focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="pt-2">
          <label
            htmlFor="login-password"
            className="block font-bold text-xs sm:text-sm text-[#F4F4F1] mb-1"
          >
            Password* :
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-sm text-[#F4F4F1] placeholder-[#F4F4F1]/60 border-b border-[#F4F4F1] py-2 pr-10 focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#F4F4F1]/60 hover:text-[#F4F4F1] focus:outline-none p-1 cursor-pointer"
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
            className="text-xs sm:text-sm text-[#F4F4F1] underline hover:opacity-70 transition-opacity"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Login CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F4F4F1] text-[#1F1D1A] py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#eaeae7] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : isAdminLogin ? 'Access Admin Portal' : 'Login'}
        </button>
      </form>

      {/* Conditional Create an Account Section (Only shown for customer login, hidden on admin login) */}
      {!isAdminLogin ? (
        <div className="mt-14 text-center">
          <h2 className="font-bold text-xs sm:text-sm tracking-widest uppercase text-[#F4F4F1] mb-4">
            CREATE AN ACCOUNT
          </h2>
          <Link
            href="/signup"
            className="block w-full bg-[#F4F4F1] text-[#1F1D1A] py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#eaeae7] transition-colors text-center cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="mt-10 text-center pt-6 border-t border-[#F4F4F1]/10">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-[#F4F4F1]/60 hover:text-[#F4F4F1] underline transition-colors"
          >
            ← Return to Storefront
          </Link>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1F1D1A] text-[#F4F4F1]">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
        <Suspense fallback={<div className="text-xs uppercase tracking-widest text-[#F4F4F1]/60">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
