export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-emerald-950 to-black text-white py-16 sm:py-24 md:py-32">

        {/* glow background */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">

          <h1 className="text-2xl sm:text-2xl md:text-4xl font-black mb-4">
            À propos de nous
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Une boutique moderne pensée pour ton style, ton confort et ta confiance 
          </p>

        </div>
      </div>

      {/* STORY */}
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Notre histoire
          </h2>

          <div className="space-y-5 text-gray-600 leading-relaxed text-base sm:text-lg">

            <p>
              Bienvenue chez Boutique Vêtements, une boutique née avec une idée simple :
              rendre la mode accessible, stylée et facile à commander.
            </p>

            <p>
              Ici, pas de complication. Tu choisis, tu ajoutes au panier, et tu commandes directement via WhatsApp.
            </p>

            <p>
              On sélectionne chaque article avec soin pour garantir un bon équilibre entre qualité, style et prix.
            </p>

          </div>

          {/* STATS */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">

            {[
              { value: "1000+", label: "Clients satisfaits" },
              { value: "500+", label: "Produits disponibles" },
              { value: "24/7", label: "Support client" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-4xl font-black text-emerald-600">
                  {item.value}
                </div>
                <p className="text-gray-600 mt-2">
                  {item.label}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* VALUES */}
      <div className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">

        <div className="max-w-5xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos valeurs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {[
              {
                title: "Qualité",
                desc: "Chaque produit est sélectionné avec soin pour garantir confort et style."
              },
              {
                title: "Accessibilité",
                desc: "Une expérience simple, rapide et pensée pour tous."
              },
              {
                title: "Confiance",
                desc: "Transparence et sérieux dans chaque commande."
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-600">
                  {v.desc}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="py-20">

        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Rejoins la boutique 
          </h2>

          <p className="text-gray-600 mb-8">
            Découvre nos collections et trouve ton style dès maintenant.
          </p>

          <a
            href="/boutique"
            className="
              inline-block
              bg-gradient-to-r
              from-emerald-500
              to-emerald-600
              text-white
              px-10 py-4
              rounded-2xl
              font-bold
              shadow-lg
              hover:scale-105
              transition
            "
          >
            Voir la boutique →
          </a>

        </div>
      </div>

    </div>
  );
}