import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AccessibilityPage() {
  const sections = [
    {
      id: 'commitment',
      number: '1',
      title: 'Our Commitment to Accessibility',
      content:
        'KSHAUM believes that considered design and understated elegance must be accessible to everyone. We are committed to digital inclusion, ensuring that individuals with diverse abilities, including those who rely on assistive technologies, can effortlessly explore our garments, learn about our craftsmanship, and purchase with autonomy and dignity.',
    },
    {
      id: 'standards',
      number: '2',
      title: 'Conformance Standards',
      content:
        'We actively work to align our digital experience with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These internationally recognized guidelines outline best practices for making web content accessible to individuals with visual, auditory, cognitive, and motor impairments.',
    },
    {
      id: 'measures',
      number: '3',
      title: 'Measures Taken to Support Accessibility',
      content: 'Across our digital platform, we implement the following ongoing measures:',
      items: [
        'Semantic HTML markup to facilitate seamless navigation with screen readers.',
        'Accessible color contrast ratios tailored for clear legibility against our signature palette.',
        'Text alternatives (descriptive alt text) for campaign imagery, lookbooks, and garment details.',
        'Full keyboard accessibility across navigation menus, drawers, bag interactions, and checkout flows.',
        'Visible focus states and logical tab order for assistive navigation.',
        'Responsive layout scaling that adapts smoothly across mobile, tablet, and desktop viewports up to 200% zoom without loss of functionality.',
        'ARIA landmarks, labels, and roles to clearly announce interactive state transitions.'
      ],
    },
    {
      id: 'ongoing-effort',
      number: '4',
      title: 'Ongoing Evaluation & Improvement',
      content:
        'Accessibility is an ongoing discipline, not a finite milestone. We continually evaluate our platform through automated testing, manual keyboard navigation audits, and assistive technology assessments as new features, collections, and editorial narratives are unveiled.',
    },
    {
      id: 'third-party',
      number: '5',
      title: 'Third-Party Content & Integrations',
      content:
        'While we strive to ensure all aspects of the KSHAUM experience conform to our standards, certain third-party integrations (such as external payment gateways or courier tracking portals) are managed by independent service providers. We actively advocate for accessibility conformance with all our external partners.',
    },
    {
      id: 'feedback-support',
      number: '6',
      title: 'Assistance & Feedback',
      content:
        'If you encounter any difficulty accessing content, navigating our site, or completing a transaction, our Client Concierge is at your service to assist you personally with product descriptions, ordering, or sizing guidance.',
      contactDetails: {
        email: 'onlinecustomercare@thekshaum.com',
        hours: 'Monday – Saturday, 10:00 – 19:00 IST',
        subject: 'Accessibility Assistance Request',
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#635F58] text-[#F4F4F1]">
      <Navbar />

      <main className="flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-[#F4F4F1]/20 pb-10 mb-12 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.28em] text-[#bdb2a1] font-semibold block mb-3">
              Customer Services &amp; Inclusion
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.14em] uppercase font-serif mb-4 text-[#F4F4F1]">
              Accessibility Statement
            </h1>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/80 max-w-2xl font-light leading-relaxed">
              KSHAUM is committed to providing a digital environment that is welcoming, dignified, and universally accessible to all individuals.
            </p>
            <div className="mt-4 text-[11px] uppercase tracking-widest text-[#bdb2a1]">
              Last updated: 2026
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-[#635F58] p-6 sm:p-8 border border-[#F4F4F1]/20 mb-12 rounded-none">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[#bdb2a1]"></span>
              <span className="text-xs uppercase tracking-[0.22em] text-[#bdb2a1] font-medium">
                Our Standards
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#F4F4F1]/90 leading-relaxed font-light">
              We continually enhance our site to meet or exceed{' '}
              <strong className="font-medium text-[#F4F4F1]">
                WCAG 2.1 Level AA
              </strong>{' '}
              guidelines. If you require specialized assistance or accommodation while browsing, our concierge is prepared to guide you through your acquisition.
            </p>
          </div>

          {/* Statement Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xs font-mono text-[#bdb2a1]">
                    {section.number}.
                  </span>
                  <h2 className="text-sm sm:text-base uppercase tracking-wider font-medium text-[#F4F4F1]">
                    {section.title}
                  </h2>
                </div>

                <div className="pl-6 border-l border-[#F4F4F1]/15 space-y-4 text-xs sm:text-sm text-[#F4F4F1]/85 leading-relaxed font-light">
                  <p>{section.content}</p>

                  {section.items && (
                    <ul className="list-disc pl-5 space-y-2 mt-3 text-[#F4F4F1]/80">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.contactDetails && (
                    <div className="mt-6 p-6 bg-[#524e48]/40 border border-[#F4F4F1]/20 space-y-3">
                      <p className="font-medium text-[#F4F4F1]">Concierge Contact:</p>
                      <ul className="space-y-1.5 text-xs text-[#F4F4F1]/80">
                        <li>
                          Email:{' '}
                          <a
                            href={`mailto:${section.contactDetails.email}?subject=${encodeURIComponent(
                              section.contactDetails.subject
                            )}`}
                            className="underline hover:opacity-75 font-normal text-[#F4F4F1]"
                          >
                            {section.contactDetails.email}
                          </a>
                        </li>
                        <li>Hours: {section.contactDetails.hours}</li>
                      </ul>
                      <div className="pt-2">
                        <Link
                          href="/contact"
                          className="inline-block bg-[#F4F4F1] text-[#635F58] hover:bg-[#e4e4e1] text-xs uppercase tracking-[0.2em] font-medium py-2.5 px-6 transition-colors"
                        >
                          Contact Concierge
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
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
