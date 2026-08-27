import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

export const metadata: Metadata = {
  title: "The Inheritance 01 — KSHAUM Women’s Collection",
  description: "Discover The Inheritance 01, KSHAUM’s first women’s collection, presented through considered silhouettes, refined materials and quiet proportion.",
  alternates: {
    canonical: "https://thekshaum.com/collection/the-inheritance-01",
  },
  openGraph: {
    title: "The Inheritance 01 — KSHAUM Women’s Collection",
    description: "Discover The Inheritance 01, KSHAUM’s first women’s collection, presented through considered silhouettes, refined materials and quiet proportion.",
    url: "https://thekshaum.com/collection/the-inheritance-01",
    images: [{ url: "/image1.jpg", width: 1200, height: 1600, alt: "KSHAUM The Inheritance 01 gathered silk dress" }],
  },
};

export default function TheInheritance01Page() {
  const galleryItems = [
    { id: 1, title: "Gathered Silk Dress", image: "/image1.jpg", alt: "KSHAUM The Inheritance 01 gathered silk dress in natural off-white" },
    { id: 2, title: "Pleated Linen Slip Dress", image: "/image2.jpg", alt: "KSHAUM The Inheritance 01 pleated linen slip dress crafted from organic handwoven fiber" },
    { id: 3, title: "Structured Column Dress", image: "/image3.jpg", alt: "KSHAUM The Inheritance 01 structured column dress in lightweight virgin wool" },
    { id: 4, title: "Wide-Leg Washed Linen Trouser", image: "/image4.jpg", alt: "KSHAUM The Inheritance 01 wide-leg washed linen trouser with deep front pleats" },
    { id: 5, title: "Tailored Straight Wool Pant", image: "/image1.jpg", alt: "KSHAUM The Inheritance 01 tailored straight wool pant with minimal waistband" },
    { id: 6, title: "Fluted Silk Crepe Skirt", image: "/image2.jpg", alt: "KSHAUM The Inheritance 01 fluted silk crepe maxi skirt in muted stone" },
    { id: 7, title: "Raw Silk Oversized Tunic", image: "/image3.jpg", alt: "KSHAUM The Inheritance 01 raw silk oversized tunic with dropped shoulder seam" },
    { id: 8, title: "Cocoon Coat in Double-Faced Cashmere", image: "/image4.jpg", alt: "KSHAUM The Inheritance 01 cocoon coat in double-faced unlined cashmere" },
    { id: 9, title: "Handloomed Cotton Kimono Jacket", image: "/image1.jpg", alt: "KSHAUM The Inheritance 01 handloomed cotton kimono jacket in pale sand" },
    { id: 10, title: "High-Waist Drape Culotte", image: "/image2.jpg", alt: "KSHAUM The Inheritance 01 high-waist drape culotte with side seam pockets" },
    { id: 11, title: "Bias-Cut Silk Habotai Camisole", image: "/image3.jpg", alt: "KSHAUM The Inheritance 01 bias-cut silk habotai camisole with delicate French seams" },
    { id: 12, title: "Sculpted Neck Wool Knit Top", image: "/image4.jpg", alt: "KSHAUM The Inheritance 01 sculpted neck wool knit top in charcoal melange" },
    { id: 13, title: "Unstructured Linen Trench", image: "/image1.jpg", alt: "KSHAUM The Inheritance 01 unstructured linen trench with storm flap and belt" },
    { id: 14, title: "Layered Chiffon Maxi Robe", image: "/image2.jpg", alt: "KSHAUM The Inheritance 01 layered chiffon maxi robe with fluid hemline" },
    { id: 15, title: "Relaxed Poplin Band-Collar Shirt", image: "/image3.jpg", alt: "KSHAUM The Inheritance 01 relaxed poplin band-collar shirt in crisp ivory" },
    { id: 16, title: "Minimalist Calfskin Slide", image: "/image4.jpg", alt: "KSHAUM The Inheritance 01 minimalist calfskin slide with architectural leather sole" },
    { id: 17, title: "Folded Leather Structured Pouch", image: "/image1.jpg", alt: "KSHAUM The Inheritance 01 folded leather structured pouch with discreet magnetic closure" },
    { id: 18, title: "Organic Indigo Wool Shawl", image: "/image2.jpg", alt: "KSHAUM The Inheritance 01 organic indigo wool shawl with hand-finished selvedge" },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "The Inheritance 01 — KSHAUM Women’s Collection",
    "description": "Discover The Inheritance 01, KSHAUM’s first women’s collection, presented through considered silhouettes, refined materials and quiet proportion.",
    "url": "https://thekshaum.com/collection/the-inheritance-01",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": galleryItems.length,
      "itemListElement": galleryItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.title,
        "image": `https://thekshaum.com${item.image}`
      }))
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Collection Identity Header */}
        <div className="border-b border-[#dcd8cf] pb-8 mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-2">
            Collection 01
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide uppercase font-serif mb-4">
            The Inheritance 01
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#1c1c1a]/75 font-light leading-relaxed">
            Presented through considered silhouettes, quiet proportion and enduring natural materials.
          </p>
        </div>

        {/* 18 Product Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {galleryItems.map((item) => (
            <div key={item.id} className="group">
              <Link href="/collection/details">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#dcd8cf]/30 mb-4">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-[#1c1c1a]">
                    {item.title}
                  </h2>
                  <span className="text-[11px] text-[#bdb2a1] uppercase tracking-widest block mt-0.5">
                    The Inheritance 01
                  </span>
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
