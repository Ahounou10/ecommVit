import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import {
  BRAND_PHONE,
  BRAND_WHATSAPP,
  BRAND_INSTAGRAM,
  BRAND_FACEBOOK,
  BRAND_ADDRESS,
  BRAND_CITY,
} from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#202823] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex h-9 w-9 items-center justify-center bg-white text-sm font-semibold text-gray-950">
              B
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">Boutique Vêtements</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
              Une sélection de vêtements et un service de commande direct.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
              <li><Link href="/boutique" className="text-gray-400 hover:text-white">Boutique</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Coordonnées</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <a href={`tel:${BRAND_PHONE}`} className="text-gray-400 hover:text-white">{BRAND_PHONE}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-gray-400">{BRAND_ADDRESS}, {BRAND_CITY}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Réseaux et messagerie</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={`https://wa.me/${BRAND_WHATSAPP.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">WhatsApp</a></li>
              <li><a href={`https://instagram.com/${BRAND_INSTAGRAM.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Instagram</a></li>
              <li><a href={`https://facebook.com/${BRAND_FACEBOOK}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Boutique Vêtements. Tous droits réservés.</p>
          <p>Abidjan, Côte d’Ivoire</p>
        </div>
      </div>
    </footer>
  );
}
