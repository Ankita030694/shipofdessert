import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'The Quiet Choice — KSHAUM',
  description: 'A study in restraint, longevity and considered thought. Explore our Philosophy and Journals.',
  alternates: {
    canonical: 'https://thekshaum.com/the-quiet-choice',
  },
  openGraph: {
    title: 'The Quiet Choice — KSHAUM',
    description: 'A study in restraint, longevity and considered thought. Explore our Philosophy and Journals.',
    url: 'https://thekshaum.com/the-quiet-choice',
    siteName: 'KSHAUM',
    type: 'website',
  },
};

export default function TheQuietChoicePage() {
  const cards = [
    {
      title: 'Our Philosophy',
      eyebrow: '01 / ESSENCE',
      description: 'Restraint, permanence, and the architecture of quiet living. Discover the ethos and mindful principles that shape every KSHAUM silhouette.',
      image: '/image1.jpg',
      href: '/philosophy',
      ctaText: 'Explore Philosophy',
    },
    {
      title: 'Journal',
      eyebrow: '02 / EDITORIAL',
      description: 'Thoughtful essays, material studies, architectural narratives, and quiet observations on contemporary design culture.',
      image: '/image3.jpg',
      href: '/journal',
      ctaText: 'Read Journals',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#DBD8CF] text-[#1C1C1A]">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full flex flex-col justify-start">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#BDB2A1] font-medium block mb-3">
            KSHAUM Curation
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.18em] uppercase text-[#1C1C1A] font-serif mb-4">
            The Quiet Choice
          </h1>
          <p className="text-xs sm:text-sm tracking-wider text-[#1C1C1A]/75 font-light leading-relaxed">
            A deeper exploration into the ideas, craftsmanship, and timeless narratives that guide our work.
          </p>
        </div>

        {/* Two Minimalist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col justify-between bg-[#DBD8CF] border border-[#1c1c1a]/20 p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-[#1C1C1A]/40 hover:shadow-lg"
            >
              <div>
                {/* Card Visual Image */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#DBD8CF]/40 mb-6 sm:mb-8">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.97]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-[#1C1C1A]/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* Eyebrow */}
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#BDB2A1] font-medium block mb-2">
                  {card.eyebrow}
                </span>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-light font-serif tracking-wider uppercase text-[#1C1C1A] mb-3 group-hover:opacity-80 transition-opacity">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#1C1C1A]/75 font-light leading-relaxed mb-8">
                  {card.description}
                </p>
              </div>

              {/* Action Link / Arrow */}
              <div className="pt-4 border-t border-[#DBD8CF]/70 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-[#1C1C1A]">
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {card.ctaText}
                </span>
                <span className="text-sm font-light transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
