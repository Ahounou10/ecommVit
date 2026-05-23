import HeroBanner from '@/components/HeroBanner';
import Features from '@/components/Features';
import CategoriesPreview from '@/components/CategoriesPreview';

export default function Home() {
  return (
    <>
      <HeroBanner />

      {/* NOUVEAUTÉS */}
      <section
        id="nouveautes"
        className="relative overflow-hidden py-16 sm:py-24 md:py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 border-t border-emerald-100"
      >
        {/* Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent mb-4 sm:mb-6">
              Nouveautés
            </h2>

            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Découvrez les derniers articles ajoutés à notre boutique.
              Des pièces modernes, élégantes et tendance sélectionnées
              spécialement pour sublimer votre style.
            </p>

            <a
              href="/boutique"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg hover:shadow-2xl text-sm sm:text-base"
            >
              Voir tous les produits
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <div className="relative bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_30%)] pointer-events-none" />

        <div className="relative">
          <CategoriesPreview />
        </div>
      </div>

      {/* FEATURES */}
      <div className="relative bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.08),transparent_30%)] pointer-events-none" />

        <div className="relative">
          <Features />
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white">
        {/* Glow background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.25),transparent_40%)]" />

          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Redéfinissez votre style avec élégance
          </h2>

          <p className="text-base sm:text-lg text-emerald-50/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Explorez notre collection exclusive et commandez facilement
            via WhatsApp. Une expérience moderne, rapide et sécurisée.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/boutique"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg hover:shadow-2xl text-sm sm:text-base"
            >
              Commander maintenant
              <span>→</span>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 ease-out text-sm sm:text-base"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}