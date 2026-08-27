import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Collection — KSHAUM",
  description: "Explore the collections of KSHAUM, where considered silhouettes, material and restraint shape a quieter approach to contemporary fashion.",
  alternates: {
    canonical: "https://thekshaum.com/collection",
  },
  openGraph: {
    title: "The Collection — KSHAUM",
    description: "Explore the collections of KSHAUM, where considered silhouettes, material and restraint shape a quieter approach to contemporary fashion.",
    url: "https://thekshaum.com/collection",
  },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
