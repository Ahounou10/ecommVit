'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/supabase/client';
import {
  formatPrice,
  getDiscountedPrice,
  getWhatsAppLink,
} from '@/lib/utils';
import { addToCart, updateCartItemById } from '@/lib/cart';
import { dispatchCartUpdate } from '@/hooks/useCartSync';
import type { Product } from '@/types';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartItemId = searchParams.get('cartItemId');
  const urlSize = searchParams.get('size') || 'M';
  const urlColor = searchParams.get('color') || 'Noir';

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(urlSize);
  const [selectedColor, setSelectedColor] = useState<string>(urlColor);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const isEditingFromCart = cartItemId !== null;
  const supabase = createClient();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setProduct(null);
          return;
        }

        setProduct(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Produit non trouvé
      </div>
    );
  }

  const price = getDiscountedPrice(product.price, product.promo_percent);
  const isSoldOut = product.stock === 0;

  const handleAddToCart = () => {
    if (isEditingFromCart && cartItemId) {
      updateCartItemById(
        cartItemId,
        product,
        1,
        selectedSize,
        selectedColor
      );
      dispatchCartUpdate();
    } else {
      addToCart(product, 1, selectedSize, selectedColor);
    }

    setShowAddedMessage(true);

    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2500);
  };

  const handleWhatsApp = () => {
    const message = `
*Bonjour je souhaite commander ce produit*

Produit : ${product.name}
Taille : ${selectedSize}
Couleur : ${selectedColor}

Merci !
    `;

    window.open(getWhatsAppLink(message), '_blank');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto">
        
        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* IMAGE */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain md:object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="w-full">

            <h1 className="text-xl md:text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-emerald-600 text-lg md:text-xl font-bold mt-2">
              {formatPrice(price)}
            </p>

            <p className="text-gray-600 mt-4 text-sm md:text-base">
              {product.description}
            </p>

            {/* SIZE */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Taille</h3>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Couleur</h3>
              <div className="flex flex-wrap gap-2">
                {['Noir', 'Blanc', 'Bleu'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      selectedColor === color
                        ? 'bg-black text-white'
                        : ''
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTONS MOBILE SAFE */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`w-full sm:flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm ${
                  showAddedMessage
                    ? 'bg-emerald-600 text-white'
                    : isEditingFromCart
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {showAddedMessage ? (
                  <>
                    <Check className="w-5 h-5" />
                    Ajouté !
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Ajouter
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsApp}
                disabled={isSoldOut}
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Commander
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-12 h-12 flex items-center justify-center border rounded-lg hover:bg-gray-100"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'text-red-500 fill-red-500' : ''
                  }`}
                />
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}