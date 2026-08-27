import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gathered Silk Dress — KSHAUM",
  description: "Crafted in pure mulberry silk, the Gathered Silk Dress is defined by quiet proportion, subtle drape and hand-finished French seams.",
  alternates: {
    canonical: "https://thekshaum.com/collection/details",
  },
  openGraph: {
    title: "Gathered Silk Dress — KSHAUM",
    description: "Crafted in pure mulberry silk, the Gathered Silk Dress is defined by quiet proportion, subtle drape and hand-finished French seams.",
    url: "https://thekshaum.com/collection/details",
    images: [{ url: "/image1.jpg", width: 1200, height: 1600, alt: "KSHAUM Gathered Silk Dress in natural off-white" }],
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Gathered Silk Dress",
    "image": "https://thekshaum.com/image1.jpg",
    "description": "Crafted in pure mulberry silk, the Gathered Silk Dress is defined by quiet proportion, subtle drape and hand-finished French seams.",
    "sku": "KSH-INH01-DR01",
    "brand": {
      "@type": "Brand",
      "name": "KSHAUM"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://thekshaum.com/collection/details",
      "priceCurrency": "USD",
      "price": "1650",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {children}
    </>
  );
}
