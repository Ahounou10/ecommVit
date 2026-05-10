'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import type { Product } from '@/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!product) return null;

  // ✅ TOAST PROPRE
  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }

  // ✅ AJOUT PANIER PROPRE
  function addToCart(product: Product) {
    if (typeof window === 'undefined') return;

    const cart: CartItem[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    const exists = cart.find(
      (item) => item.product.id === product.id
    );

    if (exists) {
      const updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem('cart', JSON.stringify(updated));
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        size: 'M',
        color: 'Noir',
      };

      cart.push(newItem);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    showToast('Produit ajouté au panier ');
  }

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const discount = product.promo_percent > 0;

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">

          {/* IMAGE */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">

            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />

            {discount && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full">
                -{product.promo_percent}%
              </div>
            )}

            {/* DESKTOP */}
            <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition items-end justify-between p-4">

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                className="bg-white p-2 rounded-full"
              >
                <Heart
                  className={
                    isFavorite ? 'text-red-500 fill-red-500' : ''
                  }
                />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="bg-emerald-600 text-white p-2 rounded-full"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>

            </div>

            {/* MOBILE (important pour ton problème) */}
            <div className="sm:hidden absolute bottom-2 right-2 flex gap-2">

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                className="bg-white p-2 rounded-full shadow"
              >
                <Heart
                  className={
                    isFavorite ? 'text-red-500 fill-red-500' : ''
                  }
                />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="bg-emerald-600 text-white p-2 rounded-full shadow"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>

            </div>

          </div>

          {/* INFO */}
          <div className="p-4">
            <h3 className="font-semibold">{product.name}</h3>

            <div className="text-emerald-600 font-bold">
              {formatPrice(
                discount ? discountedPrice : product.price
              )}
            </div>
          </div>

        </div>
      </Link>

      {/* ✅ TOAST GLOBAL (hors Link = important) */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}