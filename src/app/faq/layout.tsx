import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Frequently Asked Questions — KSHAUM",
  description: "Find answers regarding orders and pre-orders, shipping, returns, exchanges, sizing, payment, international orders, made-to-order craftsmanship, and customer support.",
  alternates: {
    canonical: "https://thekshaum.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions — KSHAUM",
    description: "Find answers regarding orders and pre-orders, shipping, returns, exchanges, sizing, payment, international orders, made-to-order craftsmanship, and customer support.",
    url: "https://thekshaum.com/faq",
    siteName: "KSHAUM",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
