import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { BRAND_PHONE, BRAND_WHATSAPP, BRAND_INSTAGRAM, BRAND_FACEBOOK, BRAND_ADDRESS, BRAND_CITY } from '@/lib/constants';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 to-emerald-950 text-white py-8 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">Contactez-nous</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">
            Nous sommes là pour vous aider ! Posez vos questions, nous répondons rapidement.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-8 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Side - Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Nos Coordonnées</h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-md bg-emerald-600 text-white">
                      <Phone className="h-5 sm:h-6 w-5 sm:w-6" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Téléphone</h3>
                    <a href={`tel:${BRAND_PHONE}`} className="text-emerald-600 hover:text-emerald-700 font-semibold break-all text-sm sm:text-base">
                      {BRAND_PHONE}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-md bg-emerald-600 text-white">
                      <MessageSquare className="h-5 sm:h-6 w-5 sm:w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm sm:text-base"
                    >
                      Nous envoyer un message
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-md bg-emerald-600 text-white">
                      <MapPin className="h-5 sm:h-6 w-5 sm:w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Adresse</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {BRAND_ADDRESS}<br />
                      {BRAND_CITY}
                    </p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-md bg-emerald-600 text-white">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Suivez-nous</h3>
                    <div className="flex gap-4 mt-2">
                      <a href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                        Instagram
                      </a>
                      <a href={`https://facebook.com/${BRAND_FACEBOOK}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    placeholder="Kouakou  felix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    placeholder="felix@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-out hover:shadow-lg hover:scale-105"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nous trouver</h2>
          <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-lg">Carte à intégrer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
