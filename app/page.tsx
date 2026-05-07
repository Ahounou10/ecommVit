import HeroBanner from '@/components/HeroBanner';
import Features from '@/components/Features';
import CategoriesPreview from '@/components/CategoriesPreview';

export default function Home() {
  return (
    <>
      <HeroBanner />
      
      {/* Nouveautés Section */}
      <section id="nouveautes" className="py-8 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Nouveautés
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Découvrez les derniers articles ajoutés à notre boutique
            </p>
            <a
              href="/boutique"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-110 text-sm sm:text-base shadow-lg"
            >
              Voir tous les produits
            </a>
          </div>
        </div>
      </section>

      <CategoriesPreview />
      <Features />

      {/* CTA Section */}
      <section className="py-8 sm:py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Prêt à commander ? 
          </h2>
          <p className="text-base sm:text-lg text-emerald-50 mb-6 sm:mb-8">
            Parcourez notre collection et commandez facilement via WhatsApp
          </p>
          <a
            href="/boutique"
            className="inline-block bg-white text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 ease-out transform hover:scale-110 text-sm sm:text-base shadow-lg"
          >
            Commander maintenant
          </a>


          <a
            href="http://localhost:3000/admin/dashboard"
            className="inline-block bg-white text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 ease-out transform hover:scale-110 text-sm sm:text-base shadow-lg"
          >
            admin
          </a>
        </div>
      </section>
    </>
  );
}
