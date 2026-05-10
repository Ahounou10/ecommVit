'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart } from 'lucide-react';
import { createClient } from '@/supabase/client';
import {
  formatPrice,
  getDiscountedPrice,
  getWhatsAppLink,
} from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //  Next.js 16 : récupérer params proprement
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Noir');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  //  fetch produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          setProduct(null);
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, supabase]);

  // loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // produit introuvable
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Produit non trouvé
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const isSoldOut = product.stock === 0;

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je veux commander ${product.name} taille ${selectedSize} couleur ${selectedColor} - ${formatPrice(
      discountedPrice
    )}`;

    const link = getWhatsAppLink(message);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <p className="text-emerald-600 text-xl font-bold mt-2">
              {formatPrice(discountedPrice)}
            </p>

            <p className="text-gray-600 mt-4">
              {product.description}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleWhatsAppOrder}
                disabled={isSoldOut}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg"
              >
                <ShoppingBag className="inline w-5 h-5 mr-2" />
                Commander
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="border px-4 py-3 rounded-lg"
              >
                <Heart
                  className={
                    isFavorite
                      ? 'text-red-500 fill-red-500'
                      : ''
                  }
                />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}