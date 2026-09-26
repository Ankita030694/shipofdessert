'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answerText: string;
  answerNode: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  // 1. About Kshaum
  {
    id: 'what-is-kshaum',
    category: 'About Kshaum',
    question: 'What is Kshaum?',
    answerText:
      'Kshaum is a contemporary fashion house from India, creating modern clothing, objects and spaces through a distinct design language. Our world extends from fashion into objects, architecture, art, design, culture and ideas.\n\nOur clothing collections for women and men focus on refined everyday wardrobe essentials, contemporary silhouettes, considered materials and enduring design.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum is a contemporary fashion house from India, creating modern clothing, objects and spaces through a distinct design language. Our world extends from fashion into objects, architecture, art, design, culture and ideas.
        </p>
        <p>
          Our clothing collections for women and men focus on refined everyday wardrobe essentials, contemporary silhouettes, considered materials and enduring design.
        </p>
      </div>
    ),
  },
  {
    id: 'what-kind-of-clothing',
    category: 'About Kshaum',
    question: 'What kind of clothing does Kshaum make?',
    answerText:
      'Kshaum creates contemporary clothing for women and men, including everyday wardrobe essentials such as shirts, tops, tanks, trousers, skirts, dresses, jackets and other modern fashion pieces.\n\nOur approach combines clean silhouettes, thoughtful proportions, quality fabrics and considered construction to create clothing designed for everyday life.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum creates contemporary clothing for women and men, including everyday wardrobe essentials such as shirts, tops, tanks, trousers, skirts, dresses, jackets and other modern fashion pieces.
        </p>
        <p>
          Our approach combines clean silhouettes, thoughtful proportions, quality fabrics and considered construction to create clothing designed for everyday life.
        </p>
      </div>
    ),
  },
  {
    id: 'is-kshaum-luxury',
    category: 'About Kshaum',
    question: 'Is Kshaum a luxury fashion brand?',
    answerText:
      'Kshaum is a contemporary fashion house focused on quality, design and longevity. We create premium clothing using carefully considered materials and construction, while keeping the collection rooted in pieces people can genuinely wear and live in.\n\nRather than following seasonal trends, Kshaum focuses on modern wardrobe pieces with a lasting point of view.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum is a contemporary fashion house focused on quality, design and longevity. We create premium clothing using carefully considered materials and construction, while keeping the collection rooted in pieces people can genuinely wear and live in.
        </p>
        <p>
          Rather than following seasonal trends, Kshaum focuses on modern wardrobe pieces with a lasting point of view.
        </p>
      </div>
    ),
  },
  {
    id: 'is-kshaum-for-women-or-men',
    category: 'About Kshaum',
    question: 'Is Kshaum for women or men?',
    answerText:
      'Kshaum creates contemporary fashion for both women and men.\n\nOur collections are designed around versatile wardrobe pieces that can move naturally between work, travel, everyday life and evening.',
    answerNode: (
      <div className="space-y-3">
        <p>Kshaum creates contemporary fashion for both women and men.</p>
        <p>
          Our collections are designed around versatile wardrobe pieces that can move naturally between work, travel, everyday life and evening.
        </p>
      </div>
    ),
  },
  {
    id: 'where-is-kshaum-from',
    category: 'About Kshaum',
    question: 'Where is Kshaum from?',
    answerText:
      'Kshaum is an India-founded contemporary fashion house with a global outlook.\n\nOur perspective begins in India, while our design language is intended for a modern international audience. Kshaum ships clothing worldwide.',
    answerNode: (
      <div className="space-y-3">
        <p>Kshaum is an India-founded contemporary fashion house with a global outlook.</p>
        <p>
          Our perspective begins in India, while our design language is intended for a modern international audience. Kshaum ships clothing worldwide.
        </p>
      </div>
    ),
  },

  // 2. Craft & Fabrics
  {
    id: 'where-are-kshaum-clothes-made',
    category: 'Craft & Fabrics',
    question: 'Where are Kshaum clothes made?',
    answerText:
      'Kshaum clothing is produced through carefully selected manufacturing partners, with close attention to fabric quality, construction, finishing and consistency.\n\nThe country of manufacture and specific product information are provided where relevant on each product page.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum clothing is produced through carefully selected manufacturing partners, with close attention to fabric quality, construction, finishing and consistency.
        </p>
        <p>
          The country of manufacture and specific product information are provided where relevant on each product page.
        </p>
      </div>
    ),
  },
  {
    id: 'what-fabrics-does-kshaum-use',
    category: 'Craft & Fabrics',
    question: 'What fabrics does Kshaum use?',
    answerText:
      'Kshaum favours natural and organic fabrics and fibres where appropriate, selected for their quality, texture, comfort, performance and longevity.\n\nWe believe fabric is an essential part of good design. Each Kshaum product page provides its specific fabric composition and care information.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum favours natural and organic fabrics and fibres where appropriate, selected for their quality, texture, comfort, performance and longevity.
        </p>
        <p>
          We believe fabric is an essential part of good design. Each Kshaum product page provides its specific fabric composition and care information.
        </p>
      </div>
    ),
  },
  {
    id: 'why-organic-natural-fabrics',
    category: 'Craft & Fabrics',
    question: 'Why does Kshaum use organic and natural fabrics?',
    answerText:
      'We choose natural and organic materials because how a garment feels, moves and ages matters as much as how it looks.\n\nOur approach to fabric selection considers comfort, durability, texture, construction and the intended life of each garment. We aim to create clothing that remains relevant beyond a single season.',
    answerNode: (
      <div className="space-y-3">
        <p>
          We choose natural and organic materials because how a garment feels, moves and ages matters as much as how it looks.
        </p>
        <p>
          Our approach to fabric selection considers comfort, durability, texture, construction and the intended life of each garment. We aim to create clothing that remains relevant beyond a single season.
        </p>
      </div>
    ),
  },

  // 3. Sizing & Fit
  {
    id: 'how-do-kshaum-clothes-fit',
    category: 'Sizing & Fit',
    question: 'How do Kshaum clothes fit?',
    answerText:
      'Kshaum uses different silhouettes and fits across its collections, from fitted and structured pieces to relaxed and fluid shapes.\n\nEvery product page includes information about the fit, measurements and size guide to help you choose the right size.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Kshaum uses different silhouettes and fits across its collections, from fitted and structured pieces to relaxed and fluid shapes.
        </p>
        <p>
          Every product page includes information about the fit, measurements and size guide to help you choose the right size.
        </p>
      </div>
    ),
  },
  {
    id: 'how-do-i-choose-my-size',
    category: 'Sizing & Fit',
    question: 'How do I choose my Kshaum size?',
    answerText:
      'Use the size guide provided on each product page and compare the measurements with a garment you already own where possible.\n\nIf you are between sizes or need help choosing a size, our team can assist you before you place your order.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Use the size guide provided on each product page and compare the measurements with a garment you already own where possible.
        </p>
        <p>
          If you are between sizes or need help choosing a size, our team can assist you before you place your order.
        </p>
      </div>
    ),
  },

  // 4. Shipping & Delivery
  {
    id: 'where-does-kshaum-ship',
    category: 'Shipping & Delivery',
    question: 'Where does Kshaum ship?',
    answerText:
      'Kshaum offers international shipping as well as shipping across India.\n\nAvailable destinations, shipping methods and applicable delivery charges are calculated at checkout.',
    answerNode: (
      <div className="space-y-3">
        <p>Kshaum offers international shipping as well as shipping across India.</p>
        <p>Available destinations, shipping methods and applicable delivery charges are calculated at checkout.</p>
      </div>
    ),
  },
  {
    id: 'does-kshaum-ship-internationally',
    category: 'Shipping & Delivery',
    question: 'Does Kshaum ship internationally?',
    answerText:
      'Yes. Kshaum ships internationally.\n\nInternational delivery options and estimated delivery times vary by destination and are displayed during checkout.',
    answerNode: (
      <div className="space-y-3">
        <p>Yes. Kshaum ships internationally.</p>
        <p>
          International delivery options and estimated delivery times vary by destination and are displayed during checkout.
        </p>
      </div>
    ),
  },
  {
    id: 'how-long-delivery-takes',
    category: 'Shipping & Delivery',
    question: 'How long does Kshaum delivery take?',
    answerText:
      'Delivery times depend on your location, product availability and shipping method.\n\nAn estimated delivery timeline is provided during checkout before you complete your order.',
    answerNode: (
      <div className="space-y-3">
        <p>Delivery times depend on your location, product availability and shipping method.</p>
        <p>An estimated delivery timeline is provided during checkout before you complete your order.</p>
      </div>
    ),
  },
  {
    id: 'are-customs-duties-included',
    category: 'Shipping & Delivery',
    question: 'Are customs duties included in international orders?',
    answerText:
      'International orders may be subject to customs duties, import taxes or other charges imposed by the destination country.\n\nThese charges vary by country and, where applicable, are the responsibility of the customer.',
    answerNode: (
      <div className="space-y-3">
        <p>
          International orders may be subject to customs duties, import taxes or other charges imposed by the destination country.
        </p>
        <p>These charges vary by country and, where applicable, are the responsibility of the customer.</p>
      </div>
    ),
  },

  // 5. Orders, Returns & Contact
  {
    id: 'can-i-return-or-exchange',
    category: 'Orders & Returns',
    question: 'Can I return or exchange Kshaum clothing?',
    answerText:
      'Eligible Kshaum products can be returned or exchanged according to our Returns & Exchanges Policy.\n\nPlease review the policy before placing your order, as eligibility and conditions may vary for certain products.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Eligible Kshaum products can be returned or exchanged according to our{' '}
          <Link href="/return-policy" className="underline hover:text-white transition-colors">
            Returns &amp; Exchanges Policy
          </Link>.
        </p>
        <p>
          Please review the policy before placing your order, as eligibility and conditions may vary for certain products.
        </p>
      </div>
    ),
  },
  {
    id: 'can-i-cancel-or-change-order',
    category: 'Orders & Returns',
    question: 'Can I cancel or change my Kshaum order?',
    answerText:
      'If you need to change or cancel an order, contact us as soon as possible.\n\nWe will make every reasonable effort to accommodate your request, although changes may not be possible once an order has entered processing, production or dispatch.',
    answerNode: (
      <div className="space-y-3">
        <p>
          If you need to change or cancel an order,{' '}
          <Link href="/contact" className="underline hover:text-white transition-colors">
            contact us
          </Link>{' '}
          as soon as possible.
        </p>
        <p>
          We will make every reasonable effort to accommodate your request, although changes may not be possible once an order has entered processing, production or dispatch.
        </p>
      </div>
    ),
  },
  {
    id: 'how-can-i-track-order',
    category: 'Orders & Returns',
    question: 'How can I track my Kshaum order?',
    answerText:
      'Once your order has been dispatched, you will receive order tracking information through the contact details provided at checkout.',
    answerNode: (
      <div className="space-y-3">
        <p>
          Once your order has been dispatched, you will receive order tracking information through the contact details provided at checkout.
        </p>
      </div>
    ),
  },
  {
    id: 'how-can-i-contact-kshaum',
    category: 'Orders & Returns',
    question: 'How can I contact Kshaum?',
    answerText:
      'For questions about Kshaum clothing, sizing, fabrics, orders, shipping or returns, please contact our customer support team through the details provided on our Contact page.\n\nIf you are uncertain about a piece or your size, we would rather you ask before ordering.',
    answerNode: (
      <div className="space-y-3">
        <p>
          For questions about Kshaum clothing, sizing, fabrics, orders, shipping or returns, please contact our customer support team through the details provided on our{' '}
          <Link href="/contact" className="underline hover:text-white transition-colors">
            Contact page
          </Link>.
        </p>
        <p>
          If you are uncertain about a piece or your size, we would rather you ask before ordering.
        </p>
      </div>
    ),
  },
];

const CATEGORIES = [
  'All',
  'About Kshaum',
  'Craft & Fabrics',
  'Sizing & Fit',
  'Shipping & Delivery',
  'Orders & Returns',
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
      const answerMatch = item.answerText.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);

      return questionMatch || answerMatch || categoryMatch;
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
        text: item.answerText,
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
            Customer Care &amp; Support
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.14em] uppercase font-serif mb-4 text-[#F4F4F1]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#F4F4F1]/80 max-w-xl mx-auto font-light leading-relaxed">
            Find answers to common questions about Kshaum, our collections, fabrics, sizing, international shipping, delivery, and orders.
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
              placeholder="Search across questions, fabrics, sizing, shipping..."
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
                      <div className="max-w-3xl">{item.answerNode}</div>
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

        {/* Still Have Questions Banner */}
        <div className="mt-14 bg-[#F4F4F1] text-[#635F58] p-8 sm:p-12 text-center rounded-none shadow-sm">
          <span className="text-xs uppercase tracking-[0.28em] text-[#8c857b] font-medium block mb-2">
            Personalized Assistance
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif tracking-wider uppercase mb-3 text-[#635F58]">
            Still Have a Question?
          </h2>
          <p className="text-xs sm:text-sm text-[#635F58]/85 max-w-lg mx-auto font-light leading-relaxed mb-6">
            For questions about Kshaum clothing, sizing, fabrics, orders, shipping or returns, please contact our customer support team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-block bg-[#635F58] text-[#F4F4F1] hover:bg-[#524e48] text-xs uppercase tracking-[0.22em] font-medium py-3 px-8 transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="mailto:onlinecustomercare@thekshaum.com"
              className="w-full sm:w-auto inline-block border border-[#635F58] text-[#635F58] hover:bg-[#635F58]/10 text-xs uppercase tracking-[0.22em] font-medium py-3 px-8 transition-colors"
            >
              Email Us Directly
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-[#635F58]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#635F58]/70 gap-2">
            <span>Customer Support</span>
            <span className="font-serif italic">Kshaum — Contemporary Design</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
