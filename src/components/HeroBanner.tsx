'use client';

export default function HeroBanner() {
  return (
    <section className="relative min-h-[500px] md:h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Vêtements de <span className="text-emerald-400">qualité premium</span> pour votre style
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            Découvrez notre collection exclusive de vêtements modernes et élégants. 
            Commandez simplement via WhatsApp et recevez chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/boutique"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-110 shadow-lg"
            >
              Découvrir la boutique
            </a>
            <a
              href="#nouveautes"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold border border-white/30 transition-all duration-300 ease-out hover:scale-105 hover:border-white/50"
            >
              Voir les nouveautés
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent opacity-5" />
    </section>
  );
}
