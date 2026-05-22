'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Edit2 } from 'lucide-react';
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

  const refreshCart = useCallback(() => {
    setCart(getCart());
  }, []);

  useCartSync(refreshCart);

  // ✅ supprimer UN item précis
  function removeItem(cartItemId: string) {
  removeCartItemById(cartItemId);
  setCart(getCart());

  window.dispatchEvent(new Event('cartUpdated'));
}

  // ✅ modifier UN item précis
  function editItem(
    cartItemId: string,
    productId: string,
    size?: string,
    color?: string
  ) {
    const params = new URLSearchParams();

    params.set('cartItemId', cartItemId);
    if (size) params.set('size', size);
    if (color) params.set('color', color);

    router.push(`/product/${productId}?${params.toString()}`);
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
        <p className="text-gray-500">Ton panier est vide</p>
      </div>
    );
  }

  const message = formatCartWhatsAppMessage(cart);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

      <div className="space-y-5">
        {cart.map((item) => {
          const product = item.product;
          if (!product) return null;

          const price = product.promo_percent
            ? getDiscountedPrice(product.price, product.promo_percent)
            : product.price;

          const cartImage = product.images?.[0] || product.image_url || '/placeholder.png';

          return (
            <div
              key={item.cartItemId}
              className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
            >
              {/* IMAGE */}
              <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
                <Image
                  src={cartImage}
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

                <p className="text-sm text-gray-500">
                  Taille : {item.size || 'M'}
                </p>

                <p className="text-sm text-gray-500">
                  Couleur : {item.color || 'Noir'}
                </p>

                <p className="text-sm text-gray-500">
                  Quantité : {item.quantity}
                </p>

                <p className="text-emerald-600 font-bold mt-1">
                  {formatPrice(price)}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="text-right space-y-2">

                <button
                  onClick={() =>
                    editItem(
                      item.cartItemId,
                      product.id,
                      item.size,
                      item.color
                    )
                  }
                  className="block w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded text-sm font-medium transition"
                >
                  <Edit2 className="inline-block mr-1" size={16} />
                  Modifier
                </button>

                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="block w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded text-sm font-medium transition"
                >
                  <Trash2 className="inline-block mr-1" size={16} />
                  Supprimer
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