import HeroBanner from '@/components/HeroBanner';
import Features from '@/components/Features';
import CategoriesPreview from '@/components/CategoriesPreview';

export default function Home() {
  return (
    <>
      <HeroBanner />
      
      {/* Nouveautés Section */}
      <section id="nouveautes" className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-white via-blue-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4 sm:mb-6">
                Nouveautés
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Découvrez les derniers articles ajoutés à notre boutique. Des pièces uniques et tendance pour votre style.
            </p>
            <a
              href="/boutique"
              className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Voir tous les produits →
            </a>
          </div>
        </div>
      </section>

      <CategoriesPreview />
      <Features />

      {/* CTA Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Prêt à transformer votre garde-robe ? 
          </h2>
          <p className="text-base sm:text-lg text-emerald-50 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Parcourez notre collection exclusive et commandez facilement via WhatsApp. Livraison rapide et sécurisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/boutique"
              className="inline-block bg-white text-emerald-600 px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Commander maintenant →
            </a>
            <a
              href="/contact"
              className="inline-block bg-white/20 border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 ease-out text-sm sm:text-base"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
