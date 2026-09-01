import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "KSHAUM — The Quiet Choice",
  description: "KSHAUM is a contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
  alternates: {
    canonical: "https://thekshaum.com/",
  },
  openGraph: {
    title: "KSHAUM — The Quiet Choice",
    description: "KSHAUM is a contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
    url: "https://thekshaum.com/",
    siteName: "KSHAUM",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="relative flex-1 w-full min-h-[90vh] flex flex-col justify-end items-center px-4 sm:px-8 pb-12 pt-24">
        {/* Full-Page Architectural Hero Visual */}
        <div className="relative w-full h-[82vh] max-h-[920px] rounded-sm overflow-hidden bg-[#dcd8cf]/30">
          {/* Desktop Video (Screen width >= 768px) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/sodhero.jpg"
            className="hidden md:block w-full h-full object-cover filter brightness-[0.98]"
            aria-label="KSHAUM architectural desktop campaign video"
          >
            <source src="/Kshaum%20Desktop.webm" type="video/webm" />
            <source src="/Kshaum Desktop.webm" type="video/webm" />
          </video>

          {/* Mobile Video (Screen width < 768px) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/sodhero.jpg"
            className="block md:hidden w-full h-full object-cover filter brightness-[0.98]"
            aria-label="KSHAUM architectural mobile campaign video"
          >
            <source src="/KSHAUM%20mobile%20.webm" type="video/webm" />
            <source src="/KSHAUM mobile .webm" type="video/webm" />
          </video>

          {/* Minimalist Visual Overlay & Semantic H1 */}
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8 sm:p-14">
            <div className="max-w-xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white/95 drop-shadow-sm font-serif">
                The Quiet Choice
              </h1>
              <p className="mt-2 text-xs sm:text-sm tracking-widest text-white/80 uppercase font-light">
                KSHAUM
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Direct Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/collection" 
            className="inline-block text-xs uppercase tracking-[0.25em] text-[#1c1c1a] hover:opacity-60 transition-opacity border-b border-[#1c1c1a] pb-0.5"
          >
            Explore The Collection
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
