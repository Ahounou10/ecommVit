'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
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
  const [toast, setToast] = useState<string | null>(null);

  if (!product) return null;

  // Récupère la première image avec fallback sur image_url
  const productImage = product.images?.[0] || product.image_url;
  
  if (!productImage) return null;

  // valeurs par défaut depuis la boutique
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }

  function addToCart(product: Product) {
    if (typeof window === 'undefined') return;

    const cart: CartItem[] = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    // cherche même produit + même taille + même couleur
    const exists = cart.find(
      (item) =>
        item.product.id === product.id &&
        item.size === defaultSize &&
        item.color === defaultColor
    );

    if (exists) {
      const updated = cart.map((item) =>
        item.product.id === product.id &&
        item.size === defaultSize &&
        item.color === defaultColor
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      localStorage.setItem('cart', JSON.stringify(updated));
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        size: defaultSize,
        color: defaultColor,
      };

      cart.push(newItem);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    showToast('Produit ajouté au panier');
  }

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const discount = product.promo_percent > 0;

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer">

          {/* IMAGE */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            <Image
              src={productImage}
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
            <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition items-end justify-end p-4">

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

            {/* MOBILE */}
            <div className="sm:hidden absolute bottom-2 right-2">

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

            <div className="mt-2 flex items-center gap-2 flex-wrap">

  {/* Nouveau prix */}
  <span className="text-emerald-600 font-bold text-lg">
    {formatPrice(
      discount
        ? discountedPrice
        : product.price
    )}
  </span>

  {/* Ancien prix */}
  {discount && (
    <span className="text-sm text-gray-400 line-through">
      {formatPrice(product.price)}
    </span>
  )}

</div>
          </div>
        </div>
      </Link>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}