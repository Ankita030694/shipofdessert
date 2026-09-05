import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Privacy Policy | KSHAUM',
  description: 'Privacy Policy for KSHAUM, operated by Thirteen Pillars of Business LLP. Learn how we collect, use, and safeguard your personal information.',
};

export default function PrivacyPolicy() {
  const sections = [
    {
      id: 'information-we-collect',
      number: '1',
      title: 'Information We Collect',
      subsections: [
        {
          subtitle: '1.1 Personal Information',
          content: 'When you make a purchase, register, or contact us, we collect personal details such as:',
          items: [
            'Full name',
            'Billing and delivery address',
            'Email address and phone number',
            'Payment details (processed securely through authorised third-party gateways)'
          ]
        },
        {
          subtitle: '1.2 Technical Data',
          content: 'We collect non-identifiable information through cookies and analytics tools, including:',
          items: [
            'IP address and device information',
            'Browser type and usage statistics',
            'Referring website and session activity'
          ]
        },
        {
          subtitle: '1.3 Transaction & Account Data',
          content: 'Information relating to orders, preferences, and communication with our customer service team.'
        }
      ]
    },
    {
      id: 'how-we-use-information',
      number: '2',
      title: 'How We Use Your Information',
      content: 'Your data is used solely for legitimate business purposes, including:',
      items: [
        'Processing and delivering orders, returns, and exchanges',
        'Communicating about purchases, shipping, or enquiries',
        'Improving our services, collections, and website experience',
        'Complying with applicable legal and regulatory requirements',
        'Preventing fraudulent transactions and ensuring account security',
        'Sending marketing updates (only where you have opted in)'
      ]
    },
    {
      id: 'payment-processing',
      number: '3',
      title: 'Payment Processing',
      content: 'All payments are securely handled through PayPal, Visa, MasterCard, and Apple Pay. We do not store complete card details on our servers.'
    },
    {
      id: 'international-orders',
      number: '4',
      title: 'International Orders and Data Transfers',
      content: 'As we ship internationally, your data may be transferred or processed in countries outside India. In all cases, we ensure that your personal information is handled with confidentiality and protected by equivalent standards of security and privacy.'
    },
    {
      id: 'sharing-information',
      number: '5',
      title: 'Sharing of Information',
      content: 'We may share your information only with:',
      items: [
        'Service providers assisting in operations (payment gateways, shipping, logistics, analytics)',
        'Legal or regulatory authorities, when required by law or to protect our rights',
        'Delivery partners, for order fulfilment'
      ],
      footnote: 'We do not sell, rent, or disclose your personal information to any unauthorised third party.'
    },
    {
      id: 'data-retention',
      number: '6',
      title: 'Data Retention',
      content: 'Your information will be retained for as long as necessary to fulfil the purposes described in this policy or as required by applicable law, including accounting, taxation, and compliance obligations.'
    },
    {
      id: 'cookies',
      number: '7',
      title: 'Cookies',
      content: 'Our website uses cookies to:',
      items: [
        'Enable core functionality and enhance user experience',
        'Analyse website performance and usage',
        'Personalise content and product suggestions'
      ],
      footnote: 'You may disable cookies in your browser settings, though certain website features may not function optimally.'
    },
    {
      id: 'security',
      number: '8',
      title: 'Security',
      content: 'We adopt appropriate technical and organisational safeguards to protect your data from unauthorised access, alteration, disclosure, or destruction.'
    },
    {
      id: 'your-rights',
      number: '9',
      title: 'Your Rights',
      content: 'You may at any time:',
      items: [
        'Request access to your personal information',
        'Request correction or deletion of data',
        'Withdraw consent for marketing communication'
      ],
      footnote: (
        <span>
          To exercise your rights, please contact:{' '}
          <a href="mailto:onlinecustomercare@thekshaum.com" className="font-medium underline hover:text-black transition-colors">
            onlinecustomercare@thekshaum.com
          </a>
        </span>
      )
    },
    {
      id: 'childrens-privacy',
      number: '10',
      title: 'Children’s Privacy',
      content: 'Our website and products are intended for adults. We do not knowingly collect personal data from individuals under 18 years of age.'
    },
    {
      id: 'policy-updates',
      number: '11',
      title: 'Policy Updates',
      content: 'We may update this Privacy Policy from time to time. All revisions will be published on this page, and the updated date will be noted above.'
    },
    {
      id: 'contact',
      number: '12',
      title: 'Contact',
      content: 'For privacy-related concerns, please contact:',
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
              Legal & Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1a] mb-4 font-serif">
              Privacy Policy
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
              This Privacy Policy describes how <strong className="font-semibold text-black">KSHAUM</strong>, operated by <strong className="font-semibold text-black">Thirteen Pillars of Business LLP</strong> (“we”, “our”, “us”), collects, uses, and protects the personal information of individuals who visit{' '}
              <a 
                href="http://www.thekshaum.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline font-medium text-black hover:opacity-80"
              >
                www.thekshaum.com
              </a>{' '}
              (“the Site”).
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[#1c1c1a]/80 italic border-l-2 border-[#1c1c1a] pl-4 py-1">
              We are committed to preserving your privacy and handling your information with care, transparency, and respect.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section 
                key={section.id} 
                id={section.id} 
                className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs scroll-mt-28 transition-all hover:border-[#1c1c1a]/30"
              >
                <div className="flex items-baseline gap-3 mb-4 border-b border-[#1c1c1a]/10 pb-3">
                  <span className="text-xs sm:text-sm font-mono font-semibold px-2 py-0.5 border border-[#1c1c1a]/20 text-[#1c1c1a]">
                    {section.number.padStart(2, '0')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
                    {section.title}
                  </h2>
                </div>

                {section.content && (
                  <p className="text-[#1c1c1a]/80 leading-relaxed mb-4 text-base">
                    {section.content}
                  </p>
                )}

                {section.subsections && (
                  <div className="space-y-6 mt-4">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="bg-[#DBD8CF] p-4 sm:p-5 border border-[#1c1c1a]/10">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          {sub.subtitle}
                        </h3>
                        <p className="text-[#1c1c1a]/80 text-sm leading-relaxed mb-3">
                          {sub.content}
                        </p>
                        {sub.items && (
                          <ul className="space-y-2 pl-5 list-disc text-sm text-[#1c1c1a]/80">
                            {sub.items.map((item, itemIdx) => (
                              <li key={itemIdx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ul className="space-y-2.5 pl-5 list-disc text-[#1c1c1a]/80 text-base mb-4 marker:text-[#1c1c1a]/40">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}

                {section.footnote && (
                  <div className="mt-4 pt-4 border-t border-[#1c1c1a]/10 text-sm text-[#1c1c1a]/70 leading-relaxed">
                    {section.footnote}
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
              Have questions regarding our Privacy Policy?{' '}
              <Link href="/contact" className="text-black underline font-medium hover:opacity-80">
                Contact our customer care team
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
