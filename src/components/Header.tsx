'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const searchInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // 🔥 focus search
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInput.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // 🔥 fonction stable (évite erreurs React)
  const updateCartCount = useCallback(() => {
    if (typeof window === 'undefined') return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as {
      quantity?: number;
    }[];

    const total = cart.reduce((sum, item) => {
      return sum + (item.quantity || 1);
    }, 0);

    setCartCount(total);
  }, []);

  // 🔥 sync panier
 useEffect(() => {
  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as {
      quantity?: number;
    }[];

    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const syncCart = () => {
    const total = getCartCount();
    setCartCount(total);
  };

  // 🔥 premier chargement
  syncCart();

  // 🔥 listeners
  const handleChange = () => syncCart();

  window.addEventListener('storage', handleChange);
  window.addEventListener('focus', handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener('focus', handleChange);
  };
}, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
              B
            </div>
            <span className="hidden sm:inline font-bold text-xl text-gray-900">
              Boutique
            </span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen((s) => !s)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const q = searchInput.current?.value?.trim();
                      if (q) {
                        router.push(`/boutique?search=${encodeURIComponent(q)}`);
                      }
                      setIsSearchOpen(false);
                    }}
                  >
                    <input
                      ref={searchInput}
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full px-3 py-2 border rounded"
                    />
                  </form>
                </div>
              )}
            </div>

            {/* CART */}
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <ShoppingBag className="w-5 h-5" />

              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}