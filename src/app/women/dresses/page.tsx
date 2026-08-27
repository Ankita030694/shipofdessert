import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

export const metadata: Metadata = {
  title: "Women’s Dresses — KSHAUM",
  description: "Discover KSHAUM women’s dresses, defined by considered silhouettes, refined proportion and a quieter approach to contemporary dressing.",
  alternates: {
    canonical: "https://thekshaum.com/women/dresses",
  },
  openGraph: {
    title: "Women’s Dresses — KSHAUM",
    description: "Discover KSHAUM women’s dresses, defined by considered silhouettes, refined proportion and a quieter approach to contemporary dressing.",
    url: "https://thekshaum.com/women/dresses",
  },
};

export default function DressesPage() {
  const dresses = [
    {
      id: 1,
      name: "Gathered Silk Dress",
      price: "$1,650",
      image: "/image1.jpg",
      alt: "KSHAUM The Inheritance 01 gathered silk dress in natural off-white",
    },
    {
      id: 2,
      name: "Pleated Linen Slip Dress",
      price: "$1,420",
      image: "/image2.jpg",
      alt: "KSHAUM pleated linen slip dress crafted from organic handwoven fiber",
    },
    {
      id: 3,
      name: "Structured Wool Column Dress",
      price: "$1,890",
      image: "/image3.jpg",
      alt: "KSHAUM structured column dress in lightweight virgin wool",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-[#dcd8cf] pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-[#bdb2a1] mb-2">
              <Link href="/women" className="hover:text-[#1c1c1a]">Women</Link> / <span>Dresses</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase font-serif">
              Dresses
            </h1>
          </div>
          <span className="text-xs text-[#1c1c1a]/60 uppercase tracking-widest">
            {dresses.length} Selections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dresses.map((item) => (
            <div key={item.id} className="group">
              <Link href="/collection/details">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#dcd8cf]/30 mb-4">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex justify-between items-start text-xs sm:text-sm">
                  <h2 className="font-normal uppercase tracking-wider">{item.name}</h2>
                  <span className="font-light">{item.price}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
