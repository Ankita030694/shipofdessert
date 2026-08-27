import { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: "Shipping & Delivery — KSHAUM",
  description: "Information about KSHAUM shipping, delivery timelines, order processing and delivery conditions.",
  alternates: {
    canonical: "https://thekshaum.com/shipping",
  },
  openGraph: {
    title: "Shipping & Delivery — KSHAUM",
    description: "Information about KSHAUM shipping, delivery timelines, order processing and delivery conditions.",
    url: "https://thekshaum.com/shipping",
  },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-[#dcd8cf] pb-8 mb-10 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-2">
            Customer Services
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide uppercase font-serif">
            Shipping & Delivery
          </h1>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#1c1c1a]/85 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-semibold uppercase tracking-wider text-[#1c1c1a]">1. Complimentary Standard Delivery</h2>
            <p>
              KSHAUM offers complimentary express delivery on all orders globally. Orders are dispatched with premium couriers in climate-controlled packaging designed to protect natural and delicate fibers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold uppercase tracking-wider text-[#1c1c1a]">2. Delivery Timelines</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
              <li>Domestic Orders (India): 2–4 business days from dispatch.</li>
              <li>International Orders: 4–7 business days via DHL Express / FedEx Priority.</li>
              <li>Made-to-Order / Archival pieces: 10–14 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold uppercase tracking-wider text-[#1c1c1a]">3. Customs, Duties & Taxes</h2>
            <p>
              All international shipments are delivered on a DDP (Delivered Duty Paid) basis where applicable, ensuring no unforeseen charges upon arrival.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
