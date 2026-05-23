'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Edit2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getCart, removeCartItemById } from '@/lib/cart';
import { useCartSync } from '@/hooks/useCartSync';

import {
  formatPrice,
  getWhatsAppLink,
  formatCartWhatsAppMessage,
  getDiscountedPrice,
} from '@/lib/utils';

export default function CartPage() {
  const [cart, setCart] = useState(() => getCart());

  const router = useRouter();

  // 🔥 refresh panier
  const refreshCart = useCallback(() => {
    setCart(getCart());
  }, []);

  useCartSync(refreshCart);

  // 🔥 supprimer article
  function removeItem(cartItemId: string) {
    removeCartItemById(cartItemId);

    setCart(getCart());

    window.dispatchEvent(new Event('cartUpdated'));

    window.dispatchEvent(
      new CustomEvent('showToast', {
        detail: {
          message: 'Produit supprimé du panier',
          type: 'info',
          duration: 2200,
        },
      })
    );
  }

  // 🔥 modifier article
  function editItem(
    cartItemId: string,
    productId: string,
    size?: string,
    color?: string
  ) {
    const params = new URLSearchParams();

    params.set('cartItemId', cartItemId);

    if (size) {
      params.set('size', size);
    }

    if (color) {
      params.set('color', color);
    }

    router.push(`/product/${productId}?${params.toString()}`);
  }

  // 🔥 total
  const total = cart.reduce((sum, item) => {
    const product = item.product;

    if (!product) return sum;

    const price = product.promo_percent
      ? getDiscountedPrice(
          product.price,
          product.promo_percent
        )
      : product.price;

    return sum + price * item.quantity;
  }, 0);

  // 🔥 panier vide
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-10 sm:p-14 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-emerald-700" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ton panier est vide
          </h1>

          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md mx-auto">
            Découvre nos derniers produits et ajoute
            tes articles préférés ✨
          </p>

          <a
            href="/boutique"
            className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Explorer la boutique →
          </a>
        </div>
      </div>
    );
  }

  const message = formatCartWhatsAppMessage(cart);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900">
          Mon Panier
        </h1>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          {cart.length} article
          {cart.length > 1 ? 's' : ''} ajouté
          {cart.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* LISTE */}
      <div className="space-y-4">
        {cart.map((item) => {
          const product = item.product;

          if (!product) return null;

          const price = product.promo_percent
            ? getDiscountedPrice(
                product.price,
                product.promo_percent
              )
            : product.price;

          const cartImage =
            product.images?.[0] ||
            product.image_url ||
            '/placeholder.png';

          return (
            <div
              key={item.cartItemId}
              className="
                group
                bg-white/80
                backdrop-blur-xl
                border border-white/50
                rounded-3xl
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
                overflow-hidden
              "
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5">

                {/* IMAGE */}
                <div className="relative w-full sm:w-32 h-56 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={cartImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* INFOS */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {product.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                        Taille : {item.size || 'M'}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                        Couleur : {item.color || 'Noir'}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-sm text-emerald-700 font-medium">
                        Qté : {item.quantity}
                      </span>

                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                    {/* PRIX */}
                    <div>
                      <p className="text-sm text-gray-400">
                        Prix unitaire
                      </p>

                      <p className="text-emerald-600 text-2xl font-black">
                        {formatPrice(price)}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editItem(
                            item.cartItemId,
                            product.id,
                            item.size,
                            item.color
                          )
                        }
                        className="
                          flex items-center gap-2
                          px-4 py-3
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          transition
                          font-medium
                        "
                      >
                        <Edit2 size={16} />
                        <span className="hidden sm:inline">
                          Modifier
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          removeItem(item.cartItemId)
                        }
                        className="
                          flex items-center gap-2
                          px-4 py-3
                          rounded-xl
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          transition
                          font-medium
                        "
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">
                          Supprimer
                        </span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div
        className="
          mt-10
          bg-gradient-to-br
          from-emerald-500
          via-emerald-600
          to-teal-600
          rounded-3xl
          shadow-2xl
          overflow-hidden
          relative
        "
      >
        {/* glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

<div className="relative p-5 sm:p-6">

  <div className="flex items-center justify-between mb-6">
    
    <div>
      <p className="text-emerald-100 text-xs uppercase tracking-[0.2em]">
        Total panier
      </p>

      <h2 className="text-white text-3xl sm:text-4xl font-black mt-1">
        {formatPrice(total)}
      </h2>
    </div>

    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center backdrop-blur-md">
      <ShoppingBag className="w-6 h-6 text-white" />
    </div>

  </div>

  <a
    href={getWhatsAppLink(message)}
    target="_blank"
    className="
      block
      w-full
      bg-white
      text-emerald-700
      text-center
      py-3.5
      rounded-2xl
      font-semibold
      hover:bg-emerald-50
      transition-all
      duration-300
      active:scale-[0.98]
      shadow-lg
    "
  >
    Commander via WhatsApp →
  </a>
</div>
      </div>
    </div>
  );
}