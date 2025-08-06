import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AtypikHouse - Hébergements insolites et éco-responsables',
  description: 'Découvrez des hébergements uniques en France et en Europe : cabanes dans les arbres, yourtes traditionnelles et cabanes flottantes. Réservez votre séjour insolite avec AtypikHouse.',
  keywords: 'hébergements insolites, cabanes dans les arbres, yourtes, cabanes flottantes, glamping, éco-responsable, France, Europe, AtypikHouse',
  authors: [{ name: 'AtypikHouse' }],
  creator: 'AtypikHouse',
  publisher: 'AtypikHouse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://atypikhouse.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AtypikHouse - Hébergements insolites et éco-responsables',
    description: 'Découvrez des hébergements uniques en France et en Europe : cabanes dans les arbres, yourtes traditionnelles et cabanes flottantes.',
    url: 'https://atypikhouse.com',
    siteName: 'AtypikHouse',
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'AtypikHouse - Hébergements insolites',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtypikHouse - Hébergements insolites et éco-responsables',
    description: 'Découvrez des hébergements uniques en France et en Europe.',
    images: ['/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/hero.jpg" as="image" />
        <link rel="preload" href="/hero2.png" as="image" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.pexels.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "AtypikHouse",
              "description": "Hébergements insolites et éco-responsables en France et en Europe",
              "url": "https://atypikhouse.com",
              "logo": "https://atypikhouse.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Pierrefonds",
                "addressRegion": "Oise",
                "addressCountry": "FR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "French"
              },
              "sameAs": [
                "https://facebook.com/atypikhouse",
                "https://instagram.com/atypikhouse"
              ],
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "France"
                },
                {
                  "@type": "Country", 
                  "name": "Europe"
                }
              ],
              "serviceType": "Hébergements insolites et éco-responsables"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
