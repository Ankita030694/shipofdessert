import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AccessibilityPage() {
  const approachPoints = [
    'Clear and consistent navigation',
    'Readable typography and well-structured content',
    'Meaningful text alternatives for images where appropriate',
    'Clearly labelled links, buttons and form fields',
    'Appropriate colour contrast and visual clarity',
    'Keyboard-friendly interaction where possible',
    'A shopping experience that is usable across different screen sizes and devices',
    'Clear product, sizing, shipping and returns information',
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#635F58] text-[#F4F4F1]">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-[#F4F4F1]/20 pb-10 mb-12 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.28em] text-[#bdb2a1] font-semibold block mb-3">
              Customer Services &amp; Inclusivity
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.14em] uppercase font-serif mb-4 text-[#F4F4F1]">
              Accessibility Statement
            </h1>
            <div className="text-[11px] uppercase tracking-widest text-[#bdb2a1]">
              Last updated: September 2026
            </div>
          </div>

          {/* Statement Introduction */}
          <div className="space-y-6 text-sm sm:text-base text-[#F4F4F1]/90 leading-relaxed font-light mb-12">
            <p>
              At Kshaum, we believe thoughtful design should be accessible to as many people as possible.
            </p>
            <p>
              We are committed to making the Kshaum website easier to navigate, understand and use, regardless of the device, technology or method used to access it.
            </p>
            <p>
              We continuously work to improve the accessibility and usability of our digital experience, including our product pages, navigation, content, forms and online shopping experience.
            </p>
          </div>

          {/* Our Approach Section */}
          <section className="mb-14 p-6 sm:p-8 bg-[#58544e]/50 border border-[#F4F4F1]/15">
            <h2 className="text-lg sm:text-xl uppercase tracking-wider font-medium text-[#F4F4F1] mb-4">
              Our approach
            </h2>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/85 mb-4 font-light">
              We aim to provide:
            </p>
            <ul className="space-y-2.5 pl-5 list-disc text-xs sm:text-sm text-[#F4F4F1]/85 font-light leading-relaxed mb-6">
              {approachPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/85 font-light leading-relaxed border-t border-[#F4F4F1]/15 pt-4">
              Accessibility is an ongoing process. As the Kshaum website and digital experience develop, we will continue to identify areas for improvement and make changes where reasonably possible.
            </p>
          </section>

          {/* Need Assistance Section */}
          <section className="p-6 sm:p-8 border border-[#F4F4F1]/20 bg-[#635F58] space-y-4">
            <h2 className="text-lg sm:text-xl uppercase tracking-wider font-medium text-[#F4F4F1]">
              Need assistance?
            </h2>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/90 font-light leading-relaxed">
              If you have difficulty accessing any part of the Kshaum website, completing a purchase, understanding product information or using any of our digital services, please{' '}
              <Link href="/contact" className="underline hover:text-white transition-colors">
                contact us
              </Link>.
            </p>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/90 font-light leading-relaxed">
              Tell us which page or feature you were trying to use and, where possible, what difficulty you encountered. We will make reasonable efforts to assist you and improve the experience.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href="/contact"
                className="inline-block bg-[#F4F4F1] text-[#635F58] hover:bg-[#e4e4e1] text-xs uppercase tracking-[0.2em] font-medium py-3 px-6 transition-colors"
              >
                Contact Concierge
              </Link>
              <a
                href="mailto:onlinecustomercare@thekshaum.com?subject=Accessibility%20Assistance%20Request"
                className="inline-block border border-[#F4F4F1]/40 text-[#F4F4F1] hover:border-[#F4F4F1] text-xs uppercase tracking-[0.2em] font-medium py-3 px-6 transition-colors"
              >
                Email Support
              </a>
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-8 text-xs text-[#bdb2a1] italic">
            Last updated: September 2026
          </div>

          {/* Bottom Navigation Links */}
          <div className="mt-16 pt-10 border-t border-[#F4F4F1]/20 flex flex-wrap gap-4 justify-between items-center text-xs text-[#bdb2a1]">
            <Link href="/privacy-policy" className="hover:text-[#F4F4F1] underline">
              &larr; Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-[#F4F4F1] underline">
              Terms &amp; Conditions
            </Link>
            <Link href="/faq" className="hover:text-[#F4F4F1] underline">
              Frequently Asked Questions &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
