'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Mock Form Submit Handler (Ready for Firebase Auth createUserWithEmailAndPassword integration)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.firstName || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password should be at least 6 characters.' });
      return;
    }

    setLoading(true);

    // Mock Registration Delay
    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: 'success',
        text: 'Account created successfully! (Frontend UI Mock - Firebase Auth will be connected here)'
      });
      // Future Firebase logic:
      // const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // await updateProfile(userCredential.user, { displayName: `${formData.firstName} ${formData.lastName}` });
      // router.push('/login');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          
          {/* Header Title */}
          <h1 className="text-center font-bold text-base sm:text-lg tracking-widest uppercase text-[#1c1c1a] mb-8">
            CREATE AN ACCOUNT
          </h1>

          {/* Subtitle */}
          <p className="text-sm font-normal text-[#1c1c1a] mb-8">
            Please enter your details to create an account:
          </p>

          {/* Feedback message banner */}
          {message && (
            <div
              className={`p-3.5 mb-6 text-xs sm:text-sm rounded border ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* First Name Field */}
            <div>
              <label 
                htmlFor="signup-firstName" 
                className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1"
              >
                First Name* :
              </label>
              <input
                id="signup-firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label 
                htmlFor="signup-lastName" 
                className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1"
              >
                Last Name :
              </label>
              <input
                id="signup-lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="signup-email" 
                className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1"
              >
                Email* :
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="pt-2">
              <label 
                htmlFor="signup-password" 
                className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1"
              >
                Password* :
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-[#1c1c1a] focus:outline-none p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="pt-2">
              <label 
                htmlFor="signup-confirmPassword" 
                className="block font-bold text-xs sm:text-sm text-[#1c1c1a] mb-1"
              >
                Confirm Password* :
              </label>
              <input
                id="signup-confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-transparent text-sm text-[#1c1c1a] placeholder-[#1c1c1a]/60 border-b border-[#1c1c1a] py-2 focus:outline-none"
              />
            </div>

            {/* Signup CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1c1c1a] text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#333330] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Already have an account Section */}
          <div className="mt-14 text-center">
            <h2 className="font-bold text-xs sm:text-sm tracking-widest uppercase text-[#1c1c1a] mb-4">
              ALREADY HAVE AN ACCOUNT?
            </h2>
            <Link
              href="/login"
              className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#333330] transition-colors text-center cursor-pointer"
            >
              Login
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
