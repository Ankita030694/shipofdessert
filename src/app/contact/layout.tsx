import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact — KSHAUM",
  description: "Contact KSHAUM for enquiries regarding collections, orders, collaborations and other matters.",
  alternates: {
    canonical: "https://thekshaum.com/contact",
  },
  openGraph: {
    title: "Contact — KSHAUM",
    description: "Contact KSHAUM for enquiries regarding collections, orders, collaborations and other matters.",
    url: "https://thekshaum.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
