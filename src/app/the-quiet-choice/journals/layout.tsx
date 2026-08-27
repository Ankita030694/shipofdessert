import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journals — KSHAUM',
  description: 'The KSHAUM Journal explores design, architecture, material, culture and the ideas that inform a quieter way of seeing and dressing.',
  alternates: {
    canonical: 'https://thekshaum.com/the-quiet-choice/journals',
  },
  openGraph: {
    title: 'Journals — KSHAUM',
    description: 'The KSHAUM Journal explores design, architecture, material, culture and the ideas that inform a quieter way of seeing and dressing.',
    url: 'https://thekshaum.com/the-quiet-choice/journals',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
