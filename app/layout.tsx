import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Boutique Vêtements | Collection en ligne',
  description:
    'Découvrez notre sélection de vêtements, consultez les disponibilités et commandez directement auprès de la boutique.',
  keywords:
    "vêtements, fashion, boutique, t-shirts, jeans, robes, chaussures, Côte d'Ivoire",
  authors: [{ name: 'Boutique' }],
  openGraph: {
    title: 'Boutique Vêtements',
    description: 'Une sélection de vêtements et un service de commande direct.',
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
      <body className="min-h-screen bg-[#f7f8fa] text-gray-950">
        <div className="relative z-50">
          <Header />
        </div>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
