import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Terms & Conditions | KSHAUM',
  description: 'Terms & Conditions for KSHAUM, operated by Thirteen Pillars of Business LLP. Review our sales, eligibility, order policies, and legal terms.',
};

export default function TermsAndConditions() {
  const sections = [
    {
      number: '01',
      title: 'General',
      paragraphs: [
        'These Terms govern all use of our website and apply to all sales made through it.',
        'We reserve the right to amend or update these Terms at any time. Continued use of the website signifies your acceptance of such changes.'
      ]
    },
    {
      number: '02',
      title: 'Eligibility',
      paragraphs: [
        'By using our website, you confirm that you are at least 18 years old and legally capable of entering into binding contracts under Indian law.'
      ]
    },
    {
      number: '03',
      title: 'Product Information',
      paragraphs: [
        'We strive for accuracy in product descriptions, pricing, and imagery. However, minor variations in colour, texture, or finish may occur due to display differences or natural characteristics of materials.',
        'All products are subject to availability. We reserve the right to withdraw, substitute, or modify items at any time.'
      ]
    },
    {
      number: '04',
      title: 'Pricing and Payment',
      paragraphs: [
        'Prices are displayed in both Indian Rupees (INR) and United States Dollars (USD).',
        'Prices may vary depending on region or currency conversion at checkout.',
        'We accept payments via PayPal, Visa, MasterCard, and Apple Pay. All payments are processed through secure, third-party payment gateways.',
        'In case of technical or pricing errors, we reserve the right to cancel or adjust orders after notifying the customer.'
      ]
    },
    {
      number: '05',
      title: 'Orders',
      paragraphs: [
        'An order is considered confirmed once you receive a dispatch email from us.',
        'We may cancel any order in the event of payment failure, stock unavailability, or suspected fraud.'
      ]
    },
    {
      number: '06',
      title: 'Shipping and Delivery',
      paragraphs: [
        'We offer international shipping via trusted logistics partners.',
        'Delivery timelines vary by destination and are indicated at checkout.',
        'Customs duties, import taxes, or clearance fees (if applicable) are the responsibility of the recipient.',
        'We are not liable for delays beyond our control, including customs clearance or courier disruptions.'
      ]
    },
    {
      number: '07',
      title: 'Returns, Exchanges, and Refunds',
      paragraphs: [
        'We accept returns, exchanges, and refunds within 14 days from the date of delivery, provided that:'
      ],
      listItems: [
        'The item is unworn, unused, and in original condition with all labels attached.',
        'The item is returned in its original packaging with proof of purchase.'
      ],
      extraParagraph: (
        <div className="space-y-2 mt-3">
          <p>Refunds are issued to the original payment method within 7–14 working days upon receipt and inspection of the returned goods.</p>
          <p>
            To initiate a return or exchange, contact:{' '}
            <a href="mailto:onlinecustomercare@thekshaum.com" className="font-medium underline hover:text-black">
              onlinecustomercare@thekshaum.com
            </a>{' '}
            or visit our{' '}
            <Link href="/return-policy" className="font-medium underline hover:text-black">
              Return Policy
            </Link>.
          </p>
        </div>
      )
    },
    {
      number: '08',
      title: 'Intellectual Property',
      paragraphs: [
        'All text, designs, images, trademarks, and other content on thekshaum.com are the property of Thirteen Pillars of Business LLP.',
        'No portion of the website may be copied, reproduced, or distributed without prior written consent.'
      ]
    },
    {
      number: '09',
      title: 'Limitation of Liability',
      paragraphs: [
        'To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.',
        'Our liability shall in no event exceed the total amount paid for the product purchased.',
        'Nothing in these Terms limits your statutory rights under Indian consumer law.'
      ]
    },
    {
      number: '10',
      title: 'Privacy',
      paragraphs: [
        'Your use of our website is also governed by our Privacy Policy, which outlines how we collect and protect your data.'
      ],
      link: {
        text: 'Read our full Privacy Policy',
        href: '/privacy-policy'
      }
    },
    {
      number: '11',
      title: 'Governing Law and Jurisdiction',
      paragraphs: [
        'These Terms are governed by and construed in accordance with the laws of India.',
        'Any disputes shall fall under the exclusive jurisdiction of the courts of India.'
      ]
    },
    {
      number: '12',
      title: 'Contact',
      paragraphs: [
        'For questions about these Terms, please contact:'
      ],
      contactDetails: {
        email: 'onlinecustomercare@thekshaum.com',
        brand: 'KSHAUM',
        company: 'Thirteen Pillars of Business LLP',
        country: 'India'
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#DBD8CF] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-[#1c1c1a]/15 pb-10 mb-12 text-center md:text-left">
            <div className="inline-block uppercase tracking-[0.25em] text-xs font-semibold text-[#8C827A] mb-3">
              Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1a] mb-4 font-serif">
              Terms & Conditions
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#1c1c1a]/70">
              <span className="inline-flex items-center px-3 py-1 rounded-none border border-[#1c1c1a]/15 text-[#1c1c1a] text-xs tracking-wider">
                Effective Date: July 2026
              </span>
              <span>•</span>
              <span>
                Site:{' '}
                <a 
                  href="http://www.thekshaum.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-black transition-colors"
                >
                  www.thekshaum.com
                </a>
              </span>
            </div>
          </div>

          {/* Introduction Card */}
          <div className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs mb-12 space-y-4">
            <p className="text-base sm:text-lg leading-relaxed text-[#1c1c1a]">
              Welcome to{' '}
              <a 
                href="http://www.thekshaum.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline font-medium text-black hover:opacity-80"
              >
                www.thekshaum.com
              </a>, owned and operated by <strong className="font-semibold text-black">Thirteen Pillars of Business LLP</strong> (“we”, “our”, “us”).
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[#1c1c1a]/80 italic border-l-2 border-[#1c1c1a] pl-4 py-1">
              By accessing our website or making a purchase, you agree to be bound by the following Terms & Conditions.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section 
                key={section.number} 
                className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs scroll-mt-28 transition-all hover:border-[#1c1c1a]/30"
              >
                <div className="flex items-baseline gap-3 mb-4 border-b border-[#1c1c1a]/10 pb-3">
                  <span className="text-xs sm:text-sm font-mono font-semibold px-2 py-0.5 border border-[#1c1c1a]/20 text-[#1c1c1a]">
                    {section.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3 text-[#1c1c1a]/80 text-base leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.listItems && (
                  <ul className="space-y-2 pl-5 list-disc text-[#1c1c1a]/80 text-base my-3 marker:text-[#1c1c1a]/40">
                    {section.listItems.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}

                {section.extraParagraph}

                {section.link && (
                  <div className="mt-4 pt-3 border-t border-[#1c1c1a]/10">
                    <Link href={section.link.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-black underline hover:opacity-75">
                      {section.link.text} →
                    </Link>
                  </div>
                )}

                {section.contactDetails && (
                  <div className="mt-4 bg-[#DBD8CF] p-5 border border-[#1c1c1a]/20 space-y-2 text-sm text-[#1c1c1a]">
                    <p>
                      <strong>Email:</strong>{' '}
                      <a 
                        href={`mailto:${section.contactDetails.email}`} 
                        className="underline font-medium text-black hover:opacity-75"
                      >
                        {section.contactDetails.email}
                      </a>
                    </p>
                    <p><strong>Brand:</strong> {section.contactDetails.brand}</p>
                    <p><strong>Entity:</strong> {section.contactDetails.company}</p>
                    <p><strong>Location:</strong> {section.contactDetails.country}</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Bottom Help Notice */}
          <div className="mt-14 text-center border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600">
              Need clarification regarding our terms?{' '}
              <Link href="/contact" className="text-black underline font-medium hover:opacity-80">
                Contact our customer support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
