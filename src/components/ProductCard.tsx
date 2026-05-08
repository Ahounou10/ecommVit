'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

// 🟢 panier simple localStorage (sans context pour éviter de t’embrouiller)
function addToCart(product: Product) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const exists = cart.find((p: Product) => p.id === product.id);

  if (exists) {
    const updated = cart.map((p: any) =>
      p.id === product.id
        ? { ...p, quantity: (p.quantity || 1) + 1 }
        : p
    );
    localStorage.setItem('cart', JSON.stringify(updated));
  } else {
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  alert('Produit ajouté au panier 🛒');
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const discount = product.promo_percent > 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">

      {/* IMAGE */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.promo_percent}%
          </div>
        )}

        {/* ACTIONS */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white rounded-full p-2"
          >
            <Heart className={isFavorite ? 'text-red-500 fill-red-500' : ''} />
          </button>

          {/* 🔥 ICI ON CHANGE TOUT */}
          <button
            onClick={() => addToCart(product)}
            className="bg-emerald-600 text-white rounded-full p-2"
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
  );
}