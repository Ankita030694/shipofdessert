import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Nothing Here — KSHAUM',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-40 pb-24 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-3">
          404 Error
        </span>
        <h1 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase font-serif mb-4">
          Nothing Here
        </h1>
        <p className="text-xs sm:text-sm text-[#1c1c1a]/70 max-w-sm mb-8">
          The requested page could not be located. You may explore the active collections.
        </p>

        <Link
          href="/shop"
          className="inline-block bg-[#1c1c1a] text-white px-8 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-[#333330] transition-colors"
        >
          Return to Shop
        </Link>
      </main>

      <Footer />
    </div>
  );
}
