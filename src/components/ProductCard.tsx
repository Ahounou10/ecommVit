'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

type CartItem = {
  product: Product;
  quantity: number;
};

function addToCart(product: Product) {
  if (typeof window === 'undefined') return;

  const cart: CartItem[] = JSON.parse(
    localStorage.getItem('cart') || '[]'
  );

  const exists = cart.find(
    (item) =>
      item?.product &&
      item.product.id === product.id
  );

  if (exists) {
    const updated = cart.map((item) =>
      item?.product?.id === product.id
        ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
        : item
    );

    localStorage.setItem(
      'cart',
      JSON.stringify(updated)
    );
  } else {
    cart.push({
      product,
      quantity: 1,
    });

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );
  }

  alert('Produit ajouté au panier 🛒');
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] =
    useState(false);

  if (!product) return null;

  const discountedPrice =
    getDiscountedPrice(
      product.price,
      product.promo_percent
    );

  const discount =
    product.promo_percent > 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">

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

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-end justify-between p-4">

          <button
            onClick={() =>
              setIsFavorite(!isFavorite)
            }
            className="bg-white p-2 rounded-full"
          >
            <Heart
              className={
                isFavorite
                  ? 'text-red-500 fill-red-500'
                  : ''
              }
            />
          </button>

          <button
            onClick={() =>
              addToCart(product)
            }
            className="bg-emerald-600 text-white p-2 rounded-full"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>

        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold">
          {product.name}
        </h3>

        <div className="text-emerald-600 font-bold">
          {formatPrice(
            discount
              ? discountedPrice
              : product.price
          )}
        </div>
      </div>
    </div>
  );
}