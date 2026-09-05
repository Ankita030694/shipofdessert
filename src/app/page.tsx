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

      <main className="relative w-full flex-1">
        {/* Full-Page End-to-End Architectural Hero Visual */}
        <div className="relative w-full h-[100dvh] overflow-hidden bg-[#1c1c1a]">
          {/* Desktop Video (Screen width >= 768px) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="hidden md:block w-full h-full object-cover filter brightness-[0.96]"
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
            className="block md:hidden w-full h-full object-cover filter brightness-[0.96]"
            aria-label="KSHAUM architectural mobile campaign video"
          >
            <source src="/KSHAUM%20mobile%20.webm" type="video/webm" />
            <source src="/KSHAUM mobile .webm" type="video/webm" />
          </video>

          {/* Minimalist Visual Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 pt-20 sm:pt-24 md:pt-28 pointer-events-none">
            {/* Top spacer to ensure clear separation from translucent navbar */}
            <div></div>

            {/* Bottom Content & CTA */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pointer-events-auto">
              <div className="max-w-xl">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-white/95 drop-shadow-sm font-serif">
                  The Quiet Choice
                </h1>
                <p className="mt-2 text-xs sm:text-sm tracking-[0.25em] text-white/80 uppercase font-light">
                  KSHAUM
                </p>
              </div>

              <div className="sm:text-right pb-1">
                <Link 
                  href="/collection" 
                  className="inline-block text-xs uppercase tracking-[0.25em] text-white hover:text-white/70 transition-opacity border-b border-white/70 pb-0.5"
                >
                  Explore The Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
