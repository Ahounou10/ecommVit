import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import Features from '@/components/Features';
import CategoriesPreview from '@/components/CategoriesPreview';

export default function Home() {
  return (
    <>
      <HeroBanner />

      <section id="nouveautes" className="border-b border-gray-200 bg-[#fafaf9] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            À découvrir
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Les nouveautés
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Retrouvez les derniers articles ajoutés à la boutique et parcourez la sélection complète.
          </p>
          <Link
            href="/boutique"
            className="mt-7 inline-flex min-h-12 items-center justify-center bg-gray-950 px-7 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>

      <CategoriesPreview />
      <Features />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl border border-gray-200 bg-[#fafaf9] px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Besoin d’aide ?
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
            Une question avant de commander ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600">
            Contactez-nous pour obtenir des précisions sur un article ou sur les modalités de commande.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/boutique" className="inline-flex min-h-12 items-center justify-center bg-gray-950 px-7 text-sm font-semibold text-white hover:bg-gray-700">
              Parcourir la boutique
            </Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center border border-gray-300 bg-white px-7 text-sm font-semibold text-gray-900 hover:bg-gray-100">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
