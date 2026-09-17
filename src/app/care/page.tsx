import { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "Care for a Lifetime — KSHAUM",
  description: "A benefit of KSHAUM Ownership. Every piece purchased directly from KSHAUM is recorded to its owner, creating a private Ownership Record and access to our lifetime care service.",
  alternates: {
    canonical: "https://thekshaum.com/care",
  },
  openGraph: {
    title: "Care for a Lifetime — KSHAUM",
    description: "A benefit of KSHAUM Ownership. A KSHAUM piece is made to remain.",
    url: "https://thekshaum.com/care",
    siteName: "KSHAUM",
    type: "website",
  },
};

export default function CarePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1F1D1A] text-[#F4F4F1]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Header Banner */}
        <div className="border-b border-[#F4F4F1]/20 pb-10 mb-14 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-medium block mb-3">
            A benefit of KSHAUM Ownership
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.15em] uppercase text-[#F4F4F1] font-serif mb-4">
            CARE FOR A LIFETIME
          </h1>
          <p className="text-sm sm:text-base text-[#F4F4F1]/80 max-w-xl mx-auto italic font-serif">
            A KSHAUM piece is made to remain.
          </p>
        </div>

        {/* Intro Statement Card */}
        <div className="bg-[#1F1D1A] p-8 sm:p-12 rounded-sm border border-[#F4F4F1]/20 shadow-xs mb-12">
          <p className="text-sm sm:text-base leading-relaxed text-[#F4F4F1]/90 font-light mb-6">
            Every piece purchased directly from KSHAUM is recorded to its owner, creating a private Ownership Record and access to our lifetime care service.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-[#F4F4F1]/90 font-light">
            When a piece requires attention, we will assess it and, where possible, repair or restore it with respect for its original construction and character.
          </p>
        </div>

        {/* Core Pillars: Ownership & Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ownership */}
          <div className="bg-[#1F1D1A] p-8 rounded-sm border border-[#F4F4F1]/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#bdb2a1]"></span>
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#F4F4F1]">
                  Ownership
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#F4F4F1]/80 leading-relaxed font-light">
                Your Ownership Record connects your piece to its original purchase and, where applicable, its care history.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f0ece1]">
              <span className="text-[11px] uppercase tracking-widest text-[#bdb2a1]">
                Private & Permanent Record
              </span>
            </div>
          </div>

          {/* Care */}
          <div className="bg-[#1F1D1A] p-8 rounded-sm border border-[#F4F4F1]/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#bdb2a1]"></span>
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#F4F4F1]">
                  Care
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#F4F4F1]/80 leading-relaxed font-light mb-3">
                Repair and restoration are available throughout the life of the piece.
              </p>
              <p className="text-xs sm:text-sm text-[#F4F4F1]/70 leading-relaxed font-light">
                Standard repairs generally take 30-45 working days once the piece has been received by KSHAUM. More extensive work may require additional time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f0ece1]">
              <span className="text-[11px] uppercase tracking-widest text-[#bdb2a1]">
                30–45 Working Days Assessment
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Terms & Consideration */}
        <div className="bg-[#1F1D1A] p-8 sm:p-10 rounded-sm border border-[#F4F4F1]/20 mb-12">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F4F4F1] mb-4">
            Repair & Restoration Considerations
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-[#F4F4F1]/80 font-light mb-4">
            Certain repairs, including significant accidental damage, third-party alterations or extensive material replacement, may incur a charge. We will always inform you before proceeding.
          </p>
          <div className="p-4 bg-[#1F1D1A]/70 border-l-2 border-[#F4F4F1] rounded-xs">
            <p className="text-xs text-[#F4F4F1]/85 leading-relaxed italic">
              All restorations are conducted by master tailors with archival precision, preserving authentic fiber integrity and original silhouette.
            </p>
          </div>
        </div>

        {/* Made to Remain & CTA Banner */}
        <div className="text-center bg-[#F4F4F1] text-[#1F1D1A] p-10 sm:p-14 rounded-sm shadow-md">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-light block mb-3">
            Philosophy of Longevity
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif tracking-wider uppercase mb-3">
            Made to Remain
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light leading-relaxed mb-8">
            We believe a well-made piece should not become disposable with time.
          </p>

          <div className="pt-2">
            <a
              href="mailto:onlinecustomercare@thekshaum.com?subject=Lifetime%20Care%20Request%20-%20KSHAUM%20Ownership&body=Dear%20KSHAUM%20Concierge,%0A%0AI%20would%20like%20to%20request%20care%20for%20my%20KSHAUM%20piece.%0A%0AOwner%20Name:%0AOrder%20Number%20or%20Purchase%20Date:%0APiece%20Name/Description:%0ADetails%20of%20Care%20Required:%0A%0AThank%20you."
              className="inline-block bg-[#1F1D1A] text-[#F4F4F1] hover:bg-[#c9c5ba] text-xs uppercase tracking-[0.25em] font-medium py-3.5 px-8 transition-colors border border-[#1F1D1A]"
            >
              Request Care
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#bdb2a1]">
              KSHAUM — The Quiet Choice
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
