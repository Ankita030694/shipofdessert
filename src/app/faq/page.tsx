'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Orders & Pre-Orders
  {
    id: 'orders-how-to-order',
    category: 'Orders & Pre-Orders',
    question: 'How do I place an order or pre-order on KSHAUM?',
    answer: (
      <>
        To acquire a piece, select your preferred size and silhouette and proceed through our discreet checkout. For select archival releases or upcoming designs available on pre-order, the estimated dispatch date is clearly detailed on the garment page. Your piece and fabric allocation are reserved immediately upon order confirmation.
      </>
    ),
  },
  {
    id: 'orders-modifications',
    category: 'Orders & Pre-Orders',
    question: 'Can I modify or cancel my order after it has been placed?',
    answer: (
      <>
        Because our fulfillment team and atelier prepare orders promptly, modifications or cancellations can only be accommodated within 2 hours of placement. Please contact our{' '}
        <Link href="/contact" className="underline hover:opacity-75 transition-opacity">
          Client Concierge
        </Link>{' '}
        immediately with your order number.
      </>
    ),
  },
  {
    id: 'orders-preorder-billing',
    category: 'Orders & Pre-Orders',
    question: 'When is payment collected for pre-order pieces?',
    answer: (
      <>
        Pre-orders are billed in full at the time of purchase. This secures rare textile allotments, artisanal handloom capacity, and dedicated atelier scheduling for your piece.
      </>
    ),
  },
  {
    id: 'orders-dispatch-notification',
    category: 'Orders & Pre-Orders',
    question: 'How will I be informed when my order or pre-order dispatches?',
    answer: (
      <>
        Once your piece undergoes final hand inspection and departs our atelier, you will receive an archival dispatch notification via email and SMS containing your live courier tracking link.
      </>
    ),
  },

  // 2. Shipping
  {
    id: 'shipping-rates-timelines',
    category: 'Shipping',
    question: 'What are your shipping rates and delivery timelines?',
    answer: (
      <>
        We provide complimentary express delivery on all orders globally. Standard domestic shipments within India arrive within 2–4 business days from dispatch. Visit our{' '}
        <Link href="/shipping" className="underline hover:opacity-75 transition-opacity">
          Shipping &amp; Delivery guide
        </Link>{' '}
        for comprehensive details.
      </>
    ),
  },
  {
    id: 'shipping-packaging',
    category: 'Shipping',
    question: 'How are KSHAUM garments packaged for shipment?',
    answer: (
      <>
        Every garment is folded in an unbleached organic cotton breathable dust bag and housed in climate-resilient, 100% recyclable archival presentation boxes to safeguard natural fibers from transit friction and moisture.
      </>
    ),
  },
  {
    id: 'shipping-tracking',
    category: 'Shipping',
    question: 'How can I track my shipment?',
    answer: (
      <>
        As soon as your parcel is handed over to our logistics partners (DHL Express, FedEx Priority, or Blue Dart), you will receive automated tracking credentials via email and text message.
      </>
    ),
  },

  // 3. Returns
  {
    id: 'returns-policy',
    category: 'Returns',
    question: 'What is your return policy and window?',
    answer: (
      <>
        We welcome returns within 14 calendar days of delivery. Garments must be in pristine, unworn, unwashed condition with all original security tags, spare buttons, and presentation packaging attached. Read our full{' '}
        <Link href="/return-policy" className="underline hover:opacity-75 transition-opacity">
          Return Policy
        </Link>.
      </>
    ),
  },
  {
    id: 'returns-initiation',
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer: (
      <>
        You may initiate a return directly through our{' '}
        <Link href="/start-return" className="underline hover:opacity-75 transition-opacity">
          Start a Return portal
        </Link>{' '}
        or by contacting our concierge. Once approved, you will receive an insured prepaid shipping label and instructions for courier pickup.
      </>
    ),
  },
  {
    id: 'returns-refund-timing',
    category: 'Returns',
    question: 'When will I receive my refund?',
    answer: (
      <>
        Once your return is received and inspected by our atelier team (usually within 2–3 business days of arrival), approved refunds are credited back to your original payment method within 5–10 business days.
      </>
    ),
  },

  // 4. Exchanges
  {
    id: 'exchanges-process',
    category: 'Exchanges',
    question: 'Can I exchange my piece for a different size or silhouette?',
    answer: (
      <>
        Yes. We offer complimentary size exchanges subject to batch availability. If you require a different size or wish to switch silhouettes, please initiate an exchange request within 14 days of receipt via our concierge.
      </>
    ),
  },
  {
    id: 'exchanges-unavailable-size',
    category: 'Exchanges',
    question: 'What happens if my preferred exchange size is out of stock?',
    answer: (
      <>
        Because our garments are created in limited archival quantities, should your requested size be unavailable, our atelier can either tailor a piece if fabric reserves permit, or issue a full refund to your original payment method.
      </>
    ),
  },

  // 5. Sizing
  {
    id: 'sizing-fit-philosophy',
    category: 'Sizing',
    question: 'How do KSHAUM silhouettes fit?',
    answer: (
      <>
        Our garments are shaped by architectural restraint, featuring natural ease, fluid lines, and generous proportions. Detailed garment dimensions and model height/measurements are available on each individual product page.
      </>
    ),
  },
  {
    id: 'sizing-between-sizes',
    category: 'Sizing',
    question: 'What size should I select if I am between sizes?',
    answer: (
      <>
        Due to our relaxed tailoring and fluid drape, we recommend choosing your regular size for an intentionally effortless silhouette. If you prefer a closer structure, you may consider sizing down or consulting our concierge.
      </>
    ),
  },
  {
    id: 'sizing-styling-advice',
    category: 'Sizing',
    question: 'Do you offer personalized fit consultations?',
    answer: (
      <>
        Our client advisors are delighted to assist with personal sizing recommendations across trousers, dresses, tops, and sets. Simply reach out through our{' '}
        <Link href="/contact" className="underline hover:opacity-75 transition-opacity">
          Contact page
        </Link>{' '}
        with your measurements.
      </>
    ),
  },

  // 6. Payment
  {
    id: 'payment-methods',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: (
      <>
        We accept all major credit and debit cards (Visa, MasterCard, American Express), Apple Pay, Net Banking, and verified international payment systems. All transactions are secured with bank-grade 256-bit encryption.
      </>
    ),
  },
  {
    id: 'payment-cod',
    category: 'Payment',
    question: 'Is Cash on Delivery (COD) available?',
    answer: (
      <>
        Cash on Delivery is supported for select domestic orders within India up to standard courier threshold limits. Eligible pin codes will automatically display COD at checkout.
      </>
    ),
  },
  {
    id: 'payment-taxes-transparency',
    category: 'Payment',
    question: 'Are taxes and duties included in the displayed price?',
    answer: (
      <>
        Yes. All product prices on KSHAUM are transparent and inclusive of applicable goods and services taxes. There are no surprise fees or undisclosed processing charges at payment.
      </>
    ),
  },

  // 7. International Orders
  {
    id: 'intl-destinations',
    category: 'International Orders',
    question: 'Which countries does KSHAUM ship to?',
    answer: (
      <>
        We dispatch worldwide to over 50 destinations, including the United States, United Kingdom, European Union, UAE, Canada, Australia, Singapore, and Japan via DHL Express and FedEx Priority.
      </>
    ),
  },
  {
    id: 'intl-duties-taxes',
    category: 'International Orders',
    question: 'Are customs duties and import taxes included for international orders?',
    answer: (
      <>
        Yes. All international consignments are delivered on a Delivered Duty Paid (DDP) basis wherever available. Import duties and clearances are handled in advance, ensuring no unexpected customs charges upon delivery at your door.
      </>
    ),
  },
  {
    id: 'intl-delivery-time',
    category: 'International Orders',
    question: 'What is the international delivery timeline?',
    answer: (
      <>
        International orders generally arrive within 4–7 business days following dispatch, depending on destination airport clearance and local transit infrastructure.
      </>
    ),
  },

  // 8. Made-to-Order Information
  {
    id: 'mto-philosophy',
    category: 'Made-to-Order Information',
    question: 'What is the KSHAUM Made-to-Order process?',
    answer: (
      <>
        To preserve rare handloom textiles and eliminate excess inventory, select archival silhouettes and tailored garments are crafted only upon order confirmation. Each commission is cut and assembled by master tailors with generational expertise.
      </>
    ),
  },
  {
    id: 'mto-timelines',
    category: 'Made-to-Order Information',
    question: 'What is the production timeframe for Made-to-Order pieces?',
    answer: (
      <>
        Made-to-order pieces require 10–14 business days of dedicated handcrafting, meticulous seam finishing, and quality inspection before entering express dispatch.
      </>
    ),
  },
  {
    id: 'mto-customization',
    category: 'Made-to-Order Information',
    question: 'Can Made-to-Order garments be tailored to custom lengths?',
    answer: (
      <>
        Yes. For made-to-order items, our atelier can accommodate custom hem lengths and sleeve adjustments. Please select &quot;Bespoke &amp; Atelier Appointment&quot; on our{' '}
        <Link href="/contact" className="underline hover:opacity-75 transition-opacity">
          Contact page
        </Link>{' '}
        prior to ordering.
      </>
    ),
  },

  // 9. Customer Support
  {
    id: 'support-contact-channels',
    category: 'Customer Support',
    question: 'How can I connect with the KSHAUM Client Concierge?',
    answer: (
      <>
        Our Client Concierge is available Monday through Saturday, 10:00 – 19:00 IST. You can message us via our{' '}
        <Link href="/contact" className="underline hover:opacity-75 transition-opacity">
          Contact Form
        </Link>{' '}
        or email directly at{' '}
        <a href="mailto:onlinecustomercare@thekshaum.com" className="underline hover:opacity-75">
          onlinecustomercare@thekshaum.com
        </a>.
      </>
    ),
  },
  {
    id: 'support-lifetime-care',
    category: 'Customer Support',
    question: 'What is the Lifetime Care and Restoration service?',
    answer: (
      <>
        Every direct acquisition creates a private Ownership Record, granting access to our permanent garment care service. Our master tailors provide complimentary inspection, seam restoration, and hem repairs throughout the lifetime of the piece. Discover more on our{' '}
        <Link href="/care" className="underline hover:opacity-75 transition-opacity">
          Care for a Lifetime page
        </Link>.
      </>
    ),
  },
  {
    id: 'support-response-time',
    category: 'Customer Support',
    question: 'How quickly does concierge support respond?',
    answer: (
      <>
        We endeavor to review and reply to all written correspondence within 1 business day. For urgent order modifications within our 2-hour window, please mark your message &quot;Urgent Order Inquiry&quot;.
      </>
    ),
  },
];

const CATEGORIES = [
  'All',
  'Orders & Pre-Orders',
  'Shipping',
  'Returns',
  'Exchanges',
  'Sizing',
  'Payment',
  'International Orders',
  'Made-to-Order Information',
  'Customer Support',
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0].id);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const questionMatch = item.question.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);

      return questionMatch || categoryMatch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Structured Data for Google rich search results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.question,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#635F58] text-[#F4F4F1]">
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="border-b border-[#F4F4F1]/20 pb-10 mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-[#bdb2a1] font-medium block mb-3">
            Customer Services &amp; Concierge
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.14em] uppercase font-serif mb-4 text-[#F4F4F1]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#F4F4F1]/80 max-w-xl mx-auto font-light leading-relaxed">
            Essential information regarding orders, pre-orders, shipping, returns, exchanges, sizing, payment, international delivery, made-to-order craft, and customer support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative border-b border-[#F4F4F1]/40 focus-within:border-[#F4F4F1] transition-colors pb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#bdb2a1] mr-3 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across orders, shipping, returns, sizing, payment..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#F4F4F1] placeholder-[#F4F4F1]/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#bdb2a1] hover:text-[#F4F4F1] ml-2 px-1 transition-colors uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                  className={`px-3 py-1.5 text-[11px] sm:text-xs uppercase tracking-[0.16em] transition-all border rounded-none cursor-pointer ${
                    isActive
                      ? 'bg-[#F4F4F1] text-[#635F58] border-[#F4F4F1] font-medium'
                      : 'bg-transparent text-[#F4F4F1]/80 border-[#F4F4F1]/25 hover:border-[#F4F4F1]/60 hover:text-[#F4F4F1]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="border-t border-[#F4F4F1]/20 divide-y divide-[#F4F4F1]/20">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="py-5 sm:py-6 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-start justify-between text-left gap-4 group cursor-pointer"
                  >
                    <div className="flex-1 pr-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#bdb2a1] block mb-1 font-medium">
                        {item.category}
                      </span>
                      <h2 className="text-sm sm:text-base font-medium tracking-wide text-[#F4F4F1] group-hover:text-[#ffffff] transition-colors">
                        {item.question}
                      </h2>
                    </div>
                    <span className="text-base sm:text-lg text-[#F4F4F1]/80 font-light select-none transition-transform duration-200 mt-1">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-2 text-xs sm:text-sm text-[#F4F4F1]/85 leading-relaxed font-light">
                      <div className="max-w-3xl space-y-2">{item.answer}</div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-[#F4F4F1]/70 mb-3 font-light">
                No matching inquiries found for &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs uppercase tracking-widest text-[#F4F4F1] underline hover:opacity-70 transition-opacity"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-[#F4F4F1]/20">
          <Link
            href="/care"
            className="p-6 bg-[#635F58] border border-[#F4F4F1]/20 hover:border-[#F4F4F1]/50 transition-colors group block"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] block mb-2">
              Ownership Benefit
            </span>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#F4F4F1] mb-2 group-hover:translate-x-1 transition-transform">
              Lifetime Care &rarr;
            </h3>
            <p className="text-xs text-[#F4F4F1]/75 font-light leading-relaxed">
              Explore our repair and restoration service for registered garments.
            </p>
          </Link>

          <Link
            href="/shipping"
            className="p-6 bg-[#635F58] border border-[#F4F4F1]/20 hover:border-[#F4F4F1]/50 transition-colors group block"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] block mb-2">
              Global Logistics
            </span>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#F4F4F1] mb-2 group-hover:translate-x-1 transition-transform">
              Shipping &amp; Duties &rarr;
            </h3>
            <p className="text-xs text-[#F4F4F1]/75 font-light leading-relaxed">
              Complimentary worldwide delivery on Delivered Duty Paid (DDP) terms.
            </p>
          </Link>

          <Link
            href="/return-policy"
            className="p-6 bg-[#635F58] border border-[#F4F4F1]/20 hover:border-[#F4F4F1]/50 transition-colors group block"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] block mb-2">
              Client Protection
            </span>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#F4F4F1] mb-2 group-hover:translate-x-1 transition-transform">
              Return Policy &rarr;
            </h3>
            <p className="text-xs text-[#F4F4F1]/75 font-light leading-relaxed">
              14-day return window with insured prepaid return logistics.
            </p>
          </Link>
        </div>

        {/* Concierge Assistance Banner */}
        <div className="mt-14 bg-[#F4F4F1] text-[#635F58] p-8 sm:p-12 text-center rounded-none shadow-sm">
          <span className="text-xs uppercase tracking-[0.28em] text-[#8c857b] font-medium block mb-2">
            Personalized Assistance
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif tracking-wider uppercase mb-3 text-[#635F58]">
            Still Have a Question?
          </h2>
          <p className="text-xs sm:text-sm text-[#635F58]/85 max-w-lg mx-auto font-light leading-relaxed mb-6">
            Our client advisors are available to assist with sizing advice, custom orders, pre-order timelines, and order assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-block bg-[#635F58] text-[#F4F4F1] hover:bg-[#524e48] text-xs uppercase tracking-[0.22em] font-medium py-3 px-8 transition-colors"
            >
              Contact Concierge
            </Link>
            <a
              href="mailto:onlinecustomercare@thekshaum.com"
              className="w-full sm:w-auto inline-block border border-[#635F58] text-[#635F58] hover:bg-[#635F58]/10 text-xs uppercase tracking-[0.22em] font-medium py-3 px-8 transition-colors"
            >
              Email Us Directly
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-[#635F58]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#635F58]/70 gap-2">
            <span>Hours: Monday – Saturday, 10:00 – 19:00 IST</span>
            <span className="font-serif italic">KSHAUM — The Quiet Choice</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
