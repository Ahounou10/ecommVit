import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import {
  BRAND_PHONE,
  BRAND_WHATSAPP,
  BRAND_INSTAGRAM,
  BRAND_FACEBOOK,
  BRAND_ADDRESS,
  BRAND_CITY,
} from '@/lib/constants';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

      {/* HERO */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 text-white py-14 sm:py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg md:text-xl">
            Une question ? Une commande ? On répond rapidement 
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">

          {/* LEFT - CONTACT INFOS */}
          <div className="space-y-8">

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nos coordonnées
            </h2>

            {/* CARD */}
            <div className="space-y-5">

              {/* PHONE */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Téléphone</p>
                  <a
                    href={`tel:${BRAND_PHONE}`}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    {BRAND_PHONE}
                  </a>
                </div>
              </div>

              {/* WHATSAPP */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <a
                    href={`https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`}
                    target="_blank"
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Nous écrire directement
                  </a>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Adresse</p>
                  <p className="text-gray-600 text-sm">
                    {BRAND_ADDRESS}
                    <br />
                    {BRAND_CITY}
                  </p>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Réseaux sociaux</p>

                  <div className="flex gap-4 mt-2 text-sm">
                    <a
                      href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`}
                      target="_blank"
                      className="text-emerald-600 hover:underline"
                    >
                      Instagram
                    </a>

                    <a
                      href={`https://facebook.com/${BRAND_FACEBOOK}`}
                      target="_blank"
                      className="text-emerald-600 hover:underline"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyer un message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <textarea
                rows={5}
                placeholder="Votre message..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition active:scale-95"
              >
                Envoyer le message
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Nous trouver
          </h2>

          <div className="h-80 md:h-96 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 shadow-inner">
            Carte à intégrer
          </div>
        </div>
      </div>
    </div>
  );
}