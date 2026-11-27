import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#202823] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
            Notre boutique
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            À propos de nous
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Une boutique de vêtements qui privilégie une sélection claire, des informations utiles et une commande simple.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
          Notre approche
        </h2>
        <div className="mt-6 space-y-5 text-base leading-7 text-gray-600">
          <p>
            Boutique Vêtements est née d’une idée simple : faciliter la découverte et la commande de vêtements en ligne.
          </p>
          <p>
            Vous pouvez parcourir les articles, consulter leurs caractéristiques, choisir les tailles et les couleurs disponibles, puis nous contacter pour finaliser votre commande.
          </p>
          <p>
            Nous souhaitons rendre chaque étape compréhensible, avec des informations accessibles et un échange direct lorsque vous en avez besoin.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#fafaf9] py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
            Nos engagements
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              { title: 'Clarté', description: 'Des informations lisibles sur les articles, les prix et les disponibilités.' },
              { title: 'Simplicité', description: 'Un parcours de commande direct, sans étapes inutiles.' },
              { title: 'Échange', description: 'Un contact humain pour répondre à vos questions avant la commande.' },
            ].map((item) => (
              <article key={item.title} className="border-t border-gray-300 pt-5">
                <h3 className="font-semibold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold text-gray-950">
          Découvrez notre sélection
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          Parcourez les articles disponibles et trouvez ceux qui vous correspondent.
        </p>
        <Link href="/boutique" className="mt-6 inline-flex min-h-12 items-center justify-center bg-gray-950 px-7 text-sm font-semibold text-white hover:bg-gray-700">
          Voir la boutique
        </Link>
      </section>
    </main>
  );
}
