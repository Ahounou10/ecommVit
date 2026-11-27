import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="bg-[#202823] text-white">
      <div className="mx-auto grid min-h-[440px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#c4d0c8]">
            Collection sélectionnée
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Des pièces choisies pour votre quotidien.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Découvrez une sélection de vêtements faciles à porter, à associer et à commander.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/boutique"
              className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-sm font-semibold text-gray-950 hover:bg-gray-100"
            >
              Découvrir la boutique
            </Link>
            <Link
              href="#nouveautes"
              className="inline-flex min-h-12 items-center justify-center border border-white/40 px-7 text-sm font-semibold text-white hover:bg-white/10"
            >
              Voir les nouveautés
            </Link>
          </div>
        </div>

        <div className="hidden border-l border-white/20 pl-10 md:block">
          <p className="text-sm uppercase tracking-[0.18em] text-gray-400">
            Boutique vêtements
          </p>
          <p className="mt-4 max-w-xs text-2xl font-medium leading-snug text-white">
            Une sélection claire. Un achat simple. Un service direct.
          </p>
          <div className="mt-8 h-px w-20 bg-[#c4d0c8]" />
        </div>
      </div>
    </section>
  );
}
