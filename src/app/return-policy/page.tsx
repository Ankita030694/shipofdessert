import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Return Policy | KSHAUM',
  description: 'Learn about the Return Policy and refund procedure for items purchased on thekshaum.com.',
};

export default function ReturnPolicy() {
  const eligibleRegions = [
    'United States',
    'United Kingdom',
    'European Union',
    'Canada',
    'Switzerland',
    'Monaco',
    'San Marino',
    'Vatican City',
    'Norway',
    'UAE',
    'Qatar',
    'Japan',
    'Hong Kong',
    'Macau',
    'Australia',
    'Indonesia',
    'South Korea',
    'Malaysia',
    'New Zealand',
    'Philippines',
    'Singapore',
    'Thailand',
    'Taiwan',
    'Vietnam'
  ];

  const steps = [
    {
      step: '01',
      title: 'Fill out the Return Form',
      description: 'Initiate your return request online. Our Customer Care team will review your request and issue a Return Authorization (RA) by email within 1 business day, which is required to process your return.'
    },
    {
      step: '02',
      title: 'Prepare Your Package',
      description: 'Once you have received your Return Authorization, make sure the item(s) are in their original condition, with all tags and original packaging intact.'
    },
    {
      step: '03',
      title: 'Ship Your Return',
      description: 'Follow the shipping instructions provided in your Return Authorization email to send the package back to our warehouse.'
    },
    {
      step: '04',
      title: 'Inspection & Refund',
      description: 'Once received at our warehouse, please allow up to 10 business days for inspection and processing. Approved refunds are issued directly to your original payment method.'
    }
  ];

  const paymentMethods = [
    {
      name: 'Credit Card',
      subtitle: 'Visa, MasterCard, American Express',
      description: 'All major credit cards accepted. Card will be credited once the return has been inspected and approved.'
    },
    {
      name: 'PayPal',
      subtitle: 'Digital Wallet',
      description: 'Direct reimbursement to your connected PayPal account balance or linked card upon approval.'
    },
    {
      name: 'Apple Pay',
      subtitle: 'Apple Wallet',
      description: 'Refunds sent back to the card linked to your Apple Pay account.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#DBD8CF] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="border-b border-[#dcd8cf] pb-10 mb-12 text-center md:text-left">
            <div className="inline-block uppercase tracking-[0.25em] text-xs font-semibold text-[#bdb2a1] mb-3">
              Customer Services & Orders
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1c1c1a] mb-4 font-serif">
              Return Policy
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl">
              You may return any item purchased on{' '}
              <a 
                href="http://www.thekshaum.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline font-medium text-black hover:opacity-75"
              >
                thekshaum.COM
              </a>{' '}
              within <strong className="font-semibold text-black">14 days</strong> of the delivery date.
            </p>
          </div>

          {/* Key Return Policy Highlight Banner */}
          <div className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block text-xs uppercase tracking-widest font-semibold px-2.5 py-1 bg-[#1c1c1a] text-white rounded-none mb-2">
                  14-Day Return Window
                </span>
                <h2 className="text-xl font-medium text-[#1c1c1a] font-serif">
                  Hassle-Free Returns & Dedicated Customer Support
                </h2>
                <p className="text-sm text-[#1c1c1a]/70 mt-1">
                  Our Customer Care team is here to assist you with every step of your return authorization.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/contact"
                  className="inline-block bg-[#1c1c1a] text-white px-6 py-3 rounded-none text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors text-center w-full md:w-auto"
                >
                  Contact Customer Care
                </Link>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#1c1c1a]"></span>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1c1a]">
                How to Initiate a Return
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((item) => (
                <div 
                  key={item.step} 
                  className="bg-[#DBD8CF] p-6 border border-[#1c1c1a]/15 shadow-xs hover:border-[#1c1c1a]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl font-light font-serif text-[#1c1c1a]/50 mb-3">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-medium text-[#1c1c1a] mb-2 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#1c1c1a]/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Return Conditions & Guidelines */}
          <section className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs mb-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-medium text-[#1c1c1a] font-serif border-b border-[#1c1c1a]/10 pb-3">
              Conditions for Return
            </h2>

            <div className="space-y-4 text-base text-[#1c1c1a]/80 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-black font-bold">•</span>
                <p>
                  <strong className="text-black font-semibold">Original Condition:</strong> The item(s) you wish to return must be in their original, unworn condition with all original tags attached and original packaging included. Otherwise, we will be unable to approve your return and issue a refund.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-black font-bold">•</span>
                <p>
                  <strong className="text-black font-semibold">Inspection:</strong> Once your return shipment reaches our warehouse, please allow up to 10 business days for processing. If the item(s) do not meet the conditions detailed above, they will be sent back to you and the return request will be denied.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 text-black font-bold">•</span>
                <p>
                  <strong className="text-black font-semibold">Non-Refundable Fees:</strong> Please note that original shipping fees are non-refundable.
                </p>
              </div>
            </div>
          </section>

          {/* Regional Shipping Responsibilities */}
          <section className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs mb-12">
            <div className="flex items-baseline justify-between mb-4 border-b border-[#1c1c1a]/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-medium text-[#1c1c1a] font-serif">
                Return Shipping & Covered Regions
              </h2>
            </div>
            
            <p className="text-base text-[#1c1c1a]/80 leading-relaxed mb-6">
              <strong className="font-semibold text-black">Kshaum takes full responsibility</strong> for the return label and associated shipping costs for orders returning from the following regions:
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {eligibleRegions.map((region) => (
                <span 
                  key={region} 
                  className="px-3 py-1.5 bg-[#DBD8CF] border border-[#1c1c1a]/20 text-xs font-medium text-[#1c1c1a]"
                >
                  {region}
                </span>
              ))}
            </div>

            <div className="bg-[#DBD8CF] border border-[#1c1c1a]/20 p-4 text-sm text-[#1c1c1a] leading-relaxed">
              <strong>Please Note:</strong> For regions not included in the above list, it is the customer’s full responsibility to arrange the return of their unwanted item(s), upon receiving their Return Authorization (RA) and return instructions from Kshaum Customer Care.
            </div>
          </section>

          {/* Refunds & Payment Methods */}
          <section className="bg-[#DBD8CF] p-6 sm:p-8 border border-[#1c1c1a]/15 shadow-xs mb-12">
            <h2 className="text-xl sm:text-2xl font-medium text-[#1c1c1a] font-serif border-b border-[#1c1c1a]/10 pb-3 mb-4">
              Refunds & Processing
            </h2>

            <p className="text-base text-[#1c1c1a]/80 leading-relaxed mb-6">
              Once your return shipment reaches our warehouse, please allow up to 10 business days for your return to be processed and refund issued. Once accepted, we will process your reimbursement and send you a Refund Confirmation email.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <div key={method.name} className="p-4 bg-[#DBD8CF] border border-[#1c1c1a]/15 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-black text-sm">{method.name}</h3>
                    <p className="text-xs text-[#1c1c1a]/60 mb-2">{method.subtitle}</p>
                    <p className="text-xs text-[#1c1c1a]/80 leading-relaxed">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1c1c1a]/10 pt-4 text-sm text-[#1c1c1a]/70 space-y-2">
              <p>
                If you have received a Refund Confirmation email but have not received your funds, please contact your bank or card issuer. If your bank is unable to locate your refund, please contact Customer Care.
              </p>
              <p>
                For further information on the conditions for exercising your right to return, please see our{' '}
                <Link href="/privacy-policy" className="text-black underline font-medium hover:opacity-75">
                  Legal Area & Privacy Policy
                </Link>.
              </p>
            </div>
          </section>

          {/* Footer Contact Banner */}
          <div className="text-center border-t border-[#1c1c1a]/15 pt-8 space-y-3">
            <h3 className="text-lg font-medium text-[#1c1c1a] font-serif">Questions about your Return?</h3>
            <p className="text-sm text-[#1c1c1a]/70">
              Our Customer Care team is available to assist you with any questions or return authorizations.
            </p>
            <div>
              <a 
                href="mailto:onlinecustomercare@thekshaum.com" 
                className="inline-block font-medium underline text-black hover:opacity-75 text-sm"
              >
                onlinecustomercare@thekshaum.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
