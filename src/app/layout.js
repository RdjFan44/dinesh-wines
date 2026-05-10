import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgeGate from '@/components/AgeGate';
import LocationGate from '@/components/LocationGate';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Dinesh Wines — Premium Spirits Catalog | India',
    template: '%s | Dinesh Wines',
  },
  description:
    'Discover India\'s finest spirits, wines, and premium liquor at Dinesh Wines. Browse our exclusive catalog of whisky, wine, beer, rum, gin, and more. Catalog only — contact store for purchase.',
  keywords: [
    'liquor catalog india',
    'premium spirits india',
    'whisky catalog',
    'wine store india',
    'dinesh wines',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Dinesh Wines — Premium Spirits Catalog',
    description: 'Browse India\'s finest spirits catalog. Whisky, Wine, Beer, Rum, Gin & more.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {/* Age & location verification (client-side) */}
        <AgeGate />
        <LocationGate />

        {/* Main site header 3-layer system */}
        <Navbar />
        
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
