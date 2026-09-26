import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accessibility Statement — Kshaum",
  description: "At Kshaum, we believe thoughtful design should be accessible to as many people as possible. Learn about our approach to digital accessibility and how to contact us for assistance.",
  alternates: {
    canonical: "https://thekshaum.com/accessibility",
  },
  openGraph: {
    title: "Accessibility Statement — Kshaum",
    description: "At Kshaum, we believe thoughtful design should be accessible to as many people as possible. Learn about our approach to digital accessibility and how to contact us for assistance.",
    url: "https://thekshaum.com/accessibility",
    siteName: "Kshaum",
    type: "website",
  },
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
