import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "Checkout — KSHAUM",
  description: "Secure checkout at KSHAUM.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full text-center">
        <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase mb-4 font-serif">
          Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#1c1c1a]/70 mb-8">
          Your order session is being prepared. Please review your selection before payment.
        </p>

        <Link
          href="/cart"
          className="inline-block bg-[#1c1c1a] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-[#333330] transition-colors"
        >
          Return to Selection
        </Link>
      </main>

      <Footer />
    </div>
  );
}
