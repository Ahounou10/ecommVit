export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 to-emerald-950 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de nous</h1>
          <p className="text-xl text-gray-300">
            Votre boutique de vêtements premium en ligne
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed mb-12">
            <p>
              Bienvenue chez Boutique Vêtements, votre destination privilégiée pour les vêtements de qualité 
              en Côte d'Ivoire. Fondée avec la passion de rendre la mode accessible à tous, nous nous engageons 
              à offrir des articles tendance et de qualité supérieure.
            </p>
            <p>
              Notre mission est simple : vous fournir des vêtements modernes, élégants et confortables, 
              tout en rendant votre expérience d'achat aussi facile que possible. Grâce à notre plateforme 
              intuitive, vous pouvez parcourir notre collection et commander directement via WhatsApp.
            </p>
            <p>
              Nous croyons que la qualité ne doit pas être compromise par la commodité. C'est pourquoi nous 
              sélectionnons chaque article avec soin pour vous offrir le meilleur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">1000+</div>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-gray-600">Produits en stock</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">24/7</div>
              <p className="text-gray-600">Service client</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nos Valeurs</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualité</h3>
              <p className="text-gray-600">
                Chaque vêtement est sélectionné avec soin pour assurer votre satisfaction et votre confort.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibilité</h3>
              <p className="text-gray-600">
                Des prix justes et une expérience d'achat simple, même sans compétences technologiques.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Confiance</h3>
              <p className="text-gray-600">
                Transparence totale dans nos produits et nos services. Votre confiance est notre priorité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Rejoignez notre communauté
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez nos derniers articles et profitez de nos promotions exclusives
          </p>
          <a
            href="/boutique"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105"
          >
            Parcourir la boutique
          </a>
        </div>
      </div>
    </div>
  );
}
