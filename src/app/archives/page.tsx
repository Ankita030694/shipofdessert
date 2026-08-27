import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "Archives — KSHAUM",
  description: "The KSHAUM Archives preserve the collections, objects and visual language that form the evolving history of the house.",
  alternates: {
    canonical: "https://thekshaum.com/archives",
  },
  openGraph: {
    title: "Archives — KSHAUM",
    description: "The KSHAUM Archives preserve the collections, objects and visual language that form the evolving history of the house.",
    url: "https://thekshaum.com/archives",
  },
};

export default function ArchivesPage() {
  const archiveItems = [
    {
      year: "2026",
      title: "The Inheritance 01",
      desc: "Inaugural women's collection exploring restraint, structure and raw natural fibers.",
      image: "/image1.jpg",
      alt: "KSHAUM archive documentation of The Inheritance 01 collection",
    },
    {
      year: "2025",
      title: "Foundational Textile Studies",
      desc: "Material research on organic linen, virgin wool, and Ayurveda-informed Jeevan Vastra.",
      image: "/image2.jpg",
      alt: "KSHAUM archive textile studies exploring organic natural weaves",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="border-b border-[#dcd8cf] pb-8 mb-12 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-2">
            Historical Records
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide uppercase font-serif">
            Archives
          </h1>
        </div>

        <div className="space-y-16">
          {archiveItems.map((item) => (
            <div key={item.title} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#dcd8cf] pb-12">
              <div className="md:col-span-5 relative aspect-[4/3] bg-[#dcd8cf]/30 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-mono text-[#bdb2a1] block">{item.year}</span>
                <h2 className="text-xl font-normal uppercase tracking-wider text-[#1c1c1a]">{item.title}</h2>
                <p className="text-xs sm:text-sm text-[#1c1c1a]/75 leading-relaxed">{item.desc}</p>
                <Link
                  href="/collection/the-inheritance-01"
                  className="inline-block text-xs uppercase tracking-widest text-[#1c1c1a] underline pt-2"
                >
                  View Archive Dossier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
