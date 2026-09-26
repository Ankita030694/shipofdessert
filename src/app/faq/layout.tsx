import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Kshaum",
  description: "Find answers regarding Kshaum clothing, our design philosophy, organic and natural fabrics, sizing, shipping, international delivery, and customer care.",
  alternates: {
    canonical: "https://thekshaum.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions — Kshaum",
    description: "Find answers regarding Kshaum clothing, our design philosophy, organic and natural fabrics, sizing, shipping, international delivery, and customer care.",
    url: "https://thekshaum.com/faq",
    siteName: "Kshaum",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
