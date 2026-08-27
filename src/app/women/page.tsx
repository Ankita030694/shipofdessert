import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "Women’s Clothing — KSHAUM",
  description: "Explore KSHAUM women’s clothing, including dresses, trousers and skirts shaped by considered silhouettes and understated elegance.",
  alternates: {
    canonical: "https://thekshaum.com/women",
  },
  openGraph: {
    title: "Women’s Clothing — KSHAUM",
    description: "Explore KSHAUM women’s clothing, including dresses, trousers and skirts shaped by considered silhouettes and understated elegance.",
    url: "https://thekshaum.com/women",
  },
};

export default function WomenPage() {
  const categories = [
    { title: "Dresses", href: "/women/dresses", desc: "Considered silhouettes and refined proportion" },
    { title: "Trousers", href: "/women/trousers", desc: "Clean lines and understated elegance" },
    { title: "Skirts", href: "/women/skirts", desc: "Quiet movement and material purity" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="border-b border-[#dcd8cf] pb-8 mb-12 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-2">
            Collection Directory
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide uppercase font-serif">
            Women
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="p-8 border border-[#dcd8cf] hover:border-[#1c1c1a] bg-[#f5f5f5] transition-all group"
            >
              <h2 className="text-base font-medium uppercase tracking-[0.2em] mb-2 group-hover:translate-x-1 transition-transform">
                {cat.title}
              </h2>
              <p className="text-xs text-[#1c1c1a]/70">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
