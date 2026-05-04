'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart } from 'lucide-react';
import { createClient } from '@/supabase/client';
import { formatPrice, getDiscountedPrice, getWhatsAppLink } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Noir');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProduct(data);
      if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      if (data.colors.length > 0) setSelectedColor(data.colors[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen">Produit non trouvé</div>;
  }

  const discountedPrice = getDiscountedPrice(product.price, product.promo_percent);
  const isSoldOut = product.stock === 0;

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je veux commander ${product.name} taille ${selectedSize} couleur ${selectedColor} - ${formatPrice(discountedPrice)}`;
    const link = getWhatsAppLink(message);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square relative bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.promo_percent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  -{product.promo_percent}%
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-emerald-600">
                  {formatPrice(discountedPrice)}
                </span>
                {product.promo_percent > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isSoldOut ? (
                  <span className="text-red-600 font-semibold">Rupture de stock</span>
                ) : (
                  <span className="text-green-600 font-semibold">{product.stock} en stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Taille</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white text-gray-900 hover:border-emerald-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Couleur</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white text-gray-900 hover:border-emerald-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleWhatsAppOrder}
                disabled={isSoldOut}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-white transition-all ${
                  isSoldOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 transform hover:scale-105'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Commander via WhatsApp
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-emerald-300 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                  }`}
                />
              </button>
            </div>

            {/* Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Livraison</h4>
                  <p className="text-sm text-gray-600">Livraison rapide après confirmation du paiement</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Échange</h4>
                  <p className="text-sm text-gray-600">Échange gratuit en cas de défaut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
