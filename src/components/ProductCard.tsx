'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
// pas d'état local ici — toasts gérés globalement
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
  if (!product) return null;

  // Récupère la première image avec fallback sur image_url
  const productImage = product.images?.[0] || product.image_url;
  
  if (!productImage) return null;

  // valeurs par défaut depuis la boutique
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  // Remarque: toasts globaux gérés par le composant `Toast` via l'événement `showToast`

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

    window.dispatchEvent(new CustomEvent('showToast', {
      detail: { message: 'Produit ajouté au panier', type: 'success', duration: 2500 },
    }));

    window.dispatchEvent(new Event('cartUpdated'));
  }

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const discount = product.promo_percent > 0;

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group bg-gradient-to-br from-white to-amber-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-amber-100">

          {/* IMAGE */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {discount && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full shadow-md font-semibold text-sm">
                -{product.promo_percent}%
              </div>
            )}

            {/* DESKTOP */}
            <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-end p-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
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
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-full shadow-lg transform active:scale-95 transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* INFO */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
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

      {/* Utilise le toast global (composant Toast monté dans Header) */}
    </>
  );
}