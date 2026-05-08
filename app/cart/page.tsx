'use client';

import { useEffect, useState } from 'react';
import { getCart, CartItem } from '@/lib/cart';
import {
  formatPrice,
  getWhatsAppLink,
  formatWhatsAppMessage,
  getDiscountedPrice,
} from '@/lib/utils';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  // 🧠 TOTAL SAFE (évite les crashs)
  const total = cart.reduce((sum, item) => {
    const product = item.product;

    if (!product) return sum; // 👈 sécurité anti undefined

    const price = product.promo_percent
      ? product.price * (1 - product.promo_percent / 100)
      : product.price;

    return sum + price * (item.quantity || 1);
  }, 0);

  // 🛒 panier vide
  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Panier</h1>
        <p className="text-gray-500 mt-2">Ton panier est vide 😅</p>
      </div>
    );
  }

  // 📲 message WhatsApp SAFE
  const message = cart
    .filter((item) => item.product)
    .map((item) =>
      formatWhatsAppMessage(
        item.product,
        item.size || '',
        item.color || ''
      )
    )
    .join('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>

      {/* 🧾 LISTE */}
      <div className="space-y-4">
        {cart.map((item, i) => {
          const product = item.product;

          if (!product) return null; // sécurité

          return (
            <div key={i} className="border p-4 rounded">
              <p className="font-bold">{product.name}</p>

              <p>Quantité: {item.quantity || 1}</p>

              <p>
                Prix:{' '}
                {formatPrice(
                  product.promo_percent
                    ? getDiscountedPrice(
                        product.price,
                        product.promo_percent
                      )
                    : product.price
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* 💰 TOTAL */}
      <div className="mt-6 font-bold text-lg">
        Total: {formatPrice(total)}
      </div>

      {/* 📲 WHATSAPP */}
      <a
        href={getWhatsAppLink(message)}
        target="_blank"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded"
      >
        Commander via WhatsApp 📲
      </a>
    </div>
  );
}