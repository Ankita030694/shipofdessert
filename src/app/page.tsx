import { Metadata } from "next";
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
    <div className="bg-[#DBD8CF] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="relative w-full flex-1">
        <h1 className="sr-only">KSHAUM — The Quiet Choice</h1>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
