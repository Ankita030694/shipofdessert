import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "KSHAUM — Women’s Clothing & Collections",
  description: "Explore KSHAUM women’s clothing, collections and archives — considered silhouettes, refined proportion and a quieter approach to contemporary dressing.",
  alternates: {
    canonical: "https://thekshaum.com/shop",
  },
  openGraph: {
    title: "KSHAUM — Women’s Clothing & Collections",
    description: "Explore KSHAUM women’s clothing, collections and archives — considered silhouettes, refined proportion and a quieter approach to contemporary dressing.",
    url: "https://thekshaum.com/shop",
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Semantic H1 integrated subtly with editorial restraint */}
        <div className="text-center py-6">
          <h1 className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold mb-2">
            KSHAUM Women’s Clothing & Collections
          </h1>
          <p className="text-base sm:text-lg font-light tracking-wide text-[#1c1c1a]">
            The Current Season & Archives
          </p>
        </div>

        {/* Video / Visual Hero Banner */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[680px] rounded-sm overflow-hidden bg-[#dcd8cf]/40 my-6">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="KSHAUM women's collection video showcase"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Quiet Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 text-center">
          <Link
            href="/women/dresses"
            className="p-6 border border-[#dcd8cf] hover:border-[#1c1c1a] transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium block">Dresses</span>
          </Link>
          <Link
            href="/women/trousers"
            className="p-6 border border-[#dcd8cf] hover:border-[#1c1c1a] transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium block">Trousers</span>
          </Link>
          <Link
            href="/women/skirts"
            className="p-6 border border-[#dcd8cf] hover:border-[#1c1c1a] transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium block">Skirts</span>
          </Link>
          <Link
            href="/collection/the-inheritance-01"
            className="p-6 border border-[#dcd8cf] hover:border-[#1c1c1a] transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium block">The Inheritance 01</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
