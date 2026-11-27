import Link from 'next/link';
import { MapPin, MessageSquare, Phone } from 'lucide-react';
import {
  BRAND_PHONE,
  BRAND_WHATSAPP,
  BRAND_INSTAGRAM,
  BRAND_FACEBOOK,
  BRAND_ADDRESS,
  BRAND_CITY,
} from '@/lib/constants';

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#202823] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
            Nous contacter
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Parlons de votre commande
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Une question sur un article, une taille ou une livraison ? Retrouvez nos coordonnées et contactez-nous directement.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">Nos coordonnées</h2>
          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            <div className="flex gap-4 py-5">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-950">Téléphone</h3>
                <a href={`tel:${BRAND_PHONE}`} className="mt-1 block text-sm text-gray-600 hover:text-gray-950">
                  {BRAND_PHONE}
                </a>
              </div>
            </div>
            <div className="flex gap-4 py-5">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-950">Adresse</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {BRAND_ADDRESS}<br />{BRAND_CITY}
                </p>
              </div>
            </div>
            <div className="flex gap-4 py-5">
              <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-950">Réseaux sociaux</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <a href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 underline underline-offset-4 hover:text-gray-950">Instagram</a>
                  <a href={`https://facebook.com/${BRAND_FACEBOOK}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 underline underline-offset-4 hover:text-gray-950">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit border border-gray-200 bg-[#fafaf9] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-950">Écrivez-nous sur WhatsApp</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Pour obtenir une réponse au sujet d’un produit ou d’une commande, envoyez-nous directement un message.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-gray-950 px-5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Contacter la boutique
          </a>
          <Link href="/boutique" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-gray-300 bg-white px-5 text-sm font-medium text-gray-900 hover:bg-gray-100">
            Retour à la boutique
          </Link>
        </aside>
      </section>
    </main>
  );
}
