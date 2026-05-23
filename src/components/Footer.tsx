'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_PHONE, BRAND_WHATSAPP, BRAND_INSTAGRAM, BRAND_FACEBOOK, BRAND_ADDRESS, BRAND_CITY } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              B
            </div>
            <h3 className="text-white font-bold text-lg">Boutique Vêtements</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Vêtements de qualité et tendance pour tous les styles. Commandez facilement via WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded"></span>
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Accueil</Link></li>
              <li><Link href="/boutique" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Boutique</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded"></span>
              Contact
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${BRAND_PHONE}`} className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 break-all">
                  {BRAND_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{BRAND_ADDRESS}, {BRAND_CITY}</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded"></span>
              Suivez-nous
            </h4>
            <div className="space-y-2.5 text-sm">
              <a href={`https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`} className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 font-medium">
                  WhatsApp
              </a>
              <a href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`} className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 font-medium">
                  Instagram
              </a>
              <a href={`https://facebook.com/${BRAND_FACEBOOK}`} className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 font-medium">
                  Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-4">
            <p>&copy; 2024-2025 Boutique Vêtements. Tous droits réservés.</p>
            <div className="flex gap-6 sm:gap-8">
              <Link href="#" className="text-gray-500 hover:text-emerald-400 transition-colors duration-200">Conditions</Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-400 transition-colors duration-200">Confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
