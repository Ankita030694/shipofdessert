import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Philosophy — KSHAUM | The Quiet Choice',
  description: 'The philosophy of KSHAUM — a quieter approach to fashion shaped by restraint, proportion, material and enduring design.',
  alternates: {
    canonical: 'https://thekshaum.com/the-quiet-choice/philosophy',
  },
  openGraph: {
    title: 'Philosophy — KSHAUM | The Quiet Choice',
    description: 'The philosophy of KSHAUM — a quieter approach to fashion shaped by restraint, proportion, material and enduring design.',
    url: 'https://thekshaum.com/the-quiet-choice/philosophy',
  },
};

export default function PhilosophyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
