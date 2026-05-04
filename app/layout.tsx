import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Boutique Vêtements - Vêtements Premium en Ligne',
  description: 'Découvrez notre collection exclusive de vêtements modernes et élégants. Commandez via WhatsApp et recevez chez vous.',
  keywords: 'vêtements, fashion, boutique, t-shirts, jeans, robes, chaussures, Côte d\'Ivoire',
  authors: [{ name: 'Boutique' }],
  openGraph: {
    title: 'Boutique Vêtements',
    description: 'Vêtements de qualité premium pour votre style',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
