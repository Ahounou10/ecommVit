'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Type propre du panier
type CartItem = {
  cartItemId: string;
  quantity: number;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const searchInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

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
    if (isSearchOpen) {
      setTimeout(() => searchInput.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="hidden sm:inline font-bold text-xl">
            Boutique
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-emerald-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          

          {/* CART */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
            <ShoppingBag className="w-5 h-5" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
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
        <div className="md:hidden border-t p-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}