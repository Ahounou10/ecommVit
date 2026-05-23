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
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Mon Panier</h1>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center border-2 border-dashed border-amber-200">
          <p className="text-lg text-gray-600 mb-6">Ton panier est vide</p>
          <a href="/boutique" className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
            Continuer tes achats →
          </a>
        </div>
      </div>
    );
  }

  const message = formatCartWhatsAppMessage(cart);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Mon Panier</h1>
      <p className="text-gray-500 mb-8 text-lg">{cart.length} article{cart.length > 1 ? 's' : ''}</p>

      <div className="space-y-4">
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
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-4 sm:p-6 flex gap-4 items-start sm:items-center transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                <Image
                  src={cartImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFOS */}
              <div className="flex-1">
                <h2 className="font-bold text-lg text-gray-900 line-clamp-2">
                  {product.name}
                </h2>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <p>Taille : <span className="font-semibold text-gray-900">{item.size || 'M'}</span></p>
                  <p>Couleur : <span className="font-semibold text-gray-900">{item.color || 'Noir'}</span></p>
                  <p>Qté : <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                </div>

                <p className="text-emerald-600 font-bold mt-3 text-lg">
                  {formatPrice(price)}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 flex-col">
                <button
                  onClick={() =>
                    editItem(
                      item.cartItemId,
                      product.id,
                      item.size,
                      item.color
                    )
                  }
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Edit2 size={16} />
                  <span className="hidden sm:inline">Modifier</span>
                </button>

                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="mt-10 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg p-6 sm:p-8 border border-amber-200">
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold text-gray-900">Total :</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">{formatPrice(total)}</span>
        </div>

        <a
          href={getWhatsAppLink(message)}
          target="_blank"
          className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-center py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg transform hover:scale-105 shadow-md"
        >
          Commander via WhatsApp
        </a>
      </div>
    </div>
  );
}