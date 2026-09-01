import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thekshaum.com"),
  title: {
    default: "KSHAUM — The Quiet Choice",
    template: "%s — KSHAUM",
  },
  description: "KSHAUM is a contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
  keywords: [
    "KSHAUM",
    "The Quiet Choice",
    "quiet luxury",
    "considered design",
    "understated fashion",
    "contemporary fashion",
    "artisan textiles",
    "slow fashion"
  ],
  authors: [{ name: "KSHAUM" }],
  creator: "KSHAUM",
  publisher: "KSHAUM",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "KSHAUM — The Quiet Choice",
    description: "KSHAUM is a contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
    url: "https://thekshaum.com",
    siteName: "KSHAUM",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KSHAUM — The Quiet Choice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KSHAUM — The Quiet Choice",
    description: "KSHAUM is a contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thekshaum.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://thekshaum.com/#organization",
        name: "KSHAUM",
        url: "https://thekshaum.com",
        logo: "https://thekshaum.com/KSHAUM.svg",
        description: "A contemporary fashion house shaped by restraint, considered design and a quieter approach to dressing.",
        sameAs: []
      },
      {
        "@type": "WebSite",
        "@id": "https://thekshaum.com/#website",
        url: "https://thekshaum.com",
        name: "KSHAUM",
        publisher: {
          "@id": "https://thekshaum.com/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
