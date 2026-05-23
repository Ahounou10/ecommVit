'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Toast from '@/components/Toast';

type CartItem = {
  cartItemId: string;
  quantity: number;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 🛒 lecture panier
  const getCartCount = (): number => {
    if (typeof window === 'undefined') return 0;

    try {
      const cart: CartItem[] = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      return cart.reduce((sum, item) => {
        return sum + (item.quantity || 1);
      }, 0);
    } catch {
      return 0;
    }
  };

  // 🔥 sync panier
  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCartCount());
    };

    setTimeout(updateCart, 0);

    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
              B
            </div>

            <span className="hidden sm:block text-xl font-bold text-slate-800 tracking-tight">
              Boutique
            </span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-slate-600 hover:text-emerald-600 font-medium transition-colors duration-300 group"
              >
                {link.label}

                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            {/* CART */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl hover:bg-emerald-50 transition-colors duration-300 group"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30 animate-pulse-soft">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white/90 backdrop-blur-xl">
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <Toast />
    </>
  );
}