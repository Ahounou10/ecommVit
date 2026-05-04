'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_PHONE, BRAND_WHATSAPP, BRAND_INSTAGRAM, BRAND_FACEBOOK, BRAND_ADDRESS, BRAND_CITY } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
              B
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Boutique Vêtements</h3>
            <p className="text-sm text-gray-400">
              Vêtements de qualité pour tous les styles. Commandez maintenant via WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link href="/boutique" className="hover:text-emerald-400 transition-colors">Boutique</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href={`tel:${BRAND_PHONE}`} className="hover:text-emerald-400 transition-colors">
                  {BRAND_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{BRAND_ADDRESS}, {BRAND_CITY}</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold mb-4">Suivez-nous</h4>
            <div className="space-y-2 text-sm">
              <a href={`https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`} className="block hover:text-emerald-400 transition-colors">
                WhatsApp
              </a>
              <a href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`} className="block hover:text-emerald-400 transition-colors">
                Instagram
              </a>
              <a href={`https://facebook.com/${BRAND_FACEBOOK}`} className="block hover:text-emerald-400 transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Boutique Vêtements. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-emerald-400 transition-colors">Conditions</Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
