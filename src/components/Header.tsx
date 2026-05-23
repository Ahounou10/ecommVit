'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Type propre du panier
type CartItem = {
  cartItemId: string;
  quantity: number;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const searchInput = useRef<HTMLInputElement | null>(null);

  //  lecture panier (safe + typé)
  const getCartCount = (): number => {
    if (typeof window === 'undefined') return 0;

    try {
      const cart: CartItem[] = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      return cart.reduce((sum: number, item: CartItem) => {
        return sum + (item.quantity || 1);
      }, 0);
    } catch {
      return 0;
    }
  };

  // 🔥 update UI
  const updateCart = () => {
    setCartCount(getCartCount());
  };

  // 🔥 sync + listeners
  type CartItem = {
  cartItemId: string;
  quantity: number;
};

useEffect(() => {
  const updateCart = () => {
    const cart: CartItem[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    const count = cart.reduce((sum: number, item: CartItem) => {
      return sum + (item.quantity || 1);
    }, 0);

    setCartCount(count);
  };

  updateCart(); // initial sync

  window.addEventListener('cartUpdated', updateCart);

  return () => {
    window.removeEventListener('cartUpdated', updateCart);
  };
}, []);

  // 🔥 focus search
  useEffect(() => {
    if (searchInput.current && typeof searchInput !== 'undefined') {
      setTimeout(() => searchInput.current?.focus(), 50);
    }
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-amber-50 to-white border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            B
          </div>
          <span className="hidden sm:inline font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            Boutique
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          

          {/* CART */}
          <Link href="/cart" className="relative p-2 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 rounded-lg transition-colors duration-200 group">
            <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE MENU */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 p-4 flex flex-col gap-2 bg-gradient-to-b from-gray-50 to-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}