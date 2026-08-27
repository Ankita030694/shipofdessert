import { Metadata } from 'next';
import TermsAndConditions from '../terms-and-conditions/page';

export const metadata: Metadata = {
  title: "Terms & Conditions — KSHAUM",
  description: "Review the terms and conditions governing use of the KSHAUM website and purchase of our products.",
  alternates: {
    canonical: "https://thekshaum.com/terms-conditions",
  },
  openGraph: {
    title: "Terms & Conditions — KSHAUM",
    description: "Review the terms and conditions governing use of the KSHAUM website and purchase of our products.",
    url: "https://thekshaum.com/terms-conditions",
  },
};

export default function TermsConditionsPage() {
  return <TermsAndConditions />;
}
