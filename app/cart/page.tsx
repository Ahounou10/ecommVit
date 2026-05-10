'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { getCart } from '@/lib/cart';
import {
  formatPrice,
  getWhatsAppLink,
  formatWhatsAppMessage,
  getDiscountedPrice,
} from '@/lib/utils';

export default function CartPage() {
  const [cart, setCart] = useState(() => getCart());

  function removeItem(index: number) {
    const updated = [...cart];
    updated.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  }

  const total = cart.reduce((sum, item) => {
    const product = item.product;

    if (!product) return sum;

    const price = product.promo_percent
      ? getDiscountedPrice(product.price, product.promo_percent)
      : product.price;

    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <p className="text-gray-500">Ton panier est vide </p>
      </div>
    );
  }

  const message = cart
    .map((item) => formatWhatsAppMessage(item))
    .join('\n');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Mon Panier </h1>

      <div className="space-y-5">
        {cart.map((item, index) => {
          const product = item.product;

          if (!product) return null;

          const price = product.promo_percent
            ? getDiscountedPrice(
                product.price,
                product.promo_percent
              )
            : product.price;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
            >
              {/* IMAGE */}
              <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFOS */}
              <div className="flex-1">
                <h2 className="font-bold text-lg">
                  {product.name}
                </h2>

                {item.size && (
                  <p className="text-sm text-gray-500">
                    Taille : {item.size}
                  </p>
                )}

                {item.color && (
                  <p className="text-sm text-gray-500">
                    Couleur : {item.color}
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  Quantité : {item.quantity}
                </p>

                <p className="text-emerald-600 font-bold mt-1">
                  {formatPrice(price)}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="text-right">
                <p className="font-bold mb-3">
                  {formatPrice(price * item.quantity)}
                </p>

                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total :</span>
          <span>{formatPrice(total)}</span>
        </div>

        <a
          href={getWhatsAppLink(message)}
          target="_blank"
          className="block mt-6 bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl font-bold transition"
        >
          Commander via WhatsApp 
        </a>
      </div>
    </div>
  );
}