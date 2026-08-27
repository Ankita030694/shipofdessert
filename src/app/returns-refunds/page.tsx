import { Metadata } from 'next';
import ReturnPolicy from '../return-policy/page';

export const metadata: Metadata = {
  title: "Returns & Refunds — KSHAUM",
  description: "Review KSHAUM’s return, exchange and refund conditions before placing an order.",
  alternates: {
    canonical: "https://thekshaum.com/returns-refunds",
  },
  openGraph: {
    title: "Returns & Refunds — KSHAUM",
    description: "Review KSHAUM’s return, exchange and refund conditions before placing an order.",
    url: "https://thekshaum.com/returns-refunds",
  },
};

export default function ReturnsRefundsPage() {
  return <ReturnPolicy />;
}
