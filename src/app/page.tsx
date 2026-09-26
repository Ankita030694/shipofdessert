import { Metadata } from "next";
import Image from "next/image";
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
    <div className="bg-[#635F58] text-[#F4F4F1] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="relative w-full flex-1">
        <h1 className="sr-only">KSHAUM — The Quiet Choice</h1>

        {/* Full-Page End-to-End Architectural Hero Visual */}
        <div className="relative w-full h-[100dvh] overflow-hidden bg-[#201F1B]">
          {/* Desktop Hero Visual (Screen width >= 768px) - 16:9 Image */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src="/hero-desktop.jpg"
              alt="KSHAUM — The Quiet Choice Campaign"
              fill
              priority
              className="object-cover filter brightness-[0.96]"
              sizes="100vw"
            />
          </div>

          {/* Mobile Hero Visual (Screen width < 768px) - 9:16 Image */}
          <div className="block md:hidden relative w-full h-full">
            <Image
              src="/hero-mobile.jpg"
              alt="KSHAUM — The Quiet Choice Mobile Campaign"
              fill
              priority
              className="object-cover filter brightness-[0.96]"
              sizes="100vw"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
