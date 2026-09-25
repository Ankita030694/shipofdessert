import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accessibility Statement — KSHAUM",
  description: "Learn about KSHAUM's commitment to digital accessibility, inclusive design, and conformance with WCAG 2.1 Level AA standards.",
  alternates: {
    canonical: "https://thekshaum.com/accessibility",
  },
  openGraph: {
    title: "Accessibility Statement — KSHAUM",
    description: "Learn about KSHAUM's commitment to digital accessibility, inclusive design, and conformance with WCAG 2.1 Level AA standards.",
    url: "https://thekshaum.com/accessibility",
    siteName: "KSHAUM",
    type: "website",
  },
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
