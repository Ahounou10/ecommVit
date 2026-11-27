'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Toast from '@/components/Toast';
import { CART_UPDATE_EVENT, getCart } from '@/lib/cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCart();
    window.addEventListener(CART_UPDATE_EVENT, updateCart);

    return () => window.removeEventListener(CART_UPDATE_EVENT, updateCart);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Accueil Boutique">
            <span className="flex h-9 w-9 items-center justify-center bg-gray-950 text-sm font-semibold text-white">
              B
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-950">
              Boutique
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              aria-label={`Panier, ${cartCount} article(s)`}
              className="relative inline-flex h-10 w-10 items-center justify-center text-gray-800 hover:bg-gray-100"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-gray-950 px-1 text-[11px] font-semibold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center text-gray-800 hover:bg-gray-100 md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav aria-label="Navigation mobile" className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700 last:border-0 hover:text-gray-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <Toast />
    </>
  );
}
