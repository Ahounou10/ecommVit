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
import { addToCart, getCart } from '@/lib/cart';
import type { Product } from '@/types';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartIndex = searchParams.get('cartIndex');
  const urlSize = searchParams.get('size') || 'M';
  const urlColor = searchParams.get('color') || 'Noir';

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(urlSize);
  const [selectedColor, setSelectedColor] = useState<string>(urlColor);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const isEditingFromCart = cartIndex !== null;

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
      } catch (err) {
        console.error(err);
        setProduct(null);
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

  const price = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const isSoldOut = product.stock === 0;

  const handleAddToCart = () => {
    if (!product) return;

    // Si on modifie depuis le panier, supprimer l'ancien et ajouter le nouveau
    if (isEditingFromCart && cartIndex !== null) {
      const cart = getCart();
      const updated = [...cart];
      updated.splice(parseInt(cartIndex), 1);
      localStorage.setItem('cart', JSON.stringify(updated));
    }

    addToCart({
      product,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });

    setShowAddedMessage(true);

    // Rediriger au panier après 1 seconde si on vient du panier
    if (isEditingFromCart) {
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } else {
      // Masquer le message après 3 secondes si on vient de la boutique
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 3000);
    }
  };

  const handleWhatsApp = () => {
    const message = `
🛒 *Nouvelle commande depuis la page produit*

Produit : ${product.name}
Taille : ${selectedSize}
Couleur : ${selectedColor}
Quantité : 1
Prix : ${formatPrice(price)}

Lien produit : ${product.image_url}

Merci !
    `;

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
              {formatPrice(price)}
            </p>

            <p className="text-gray-600 mt-4">
              {product.description}
            </p>

            {/* SIZE */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Taille</h3>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg ${
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
              <div className="flex gap-2">
                {['Noir', 'Blanc', 'Bleu'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg ${
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

            {/* BUTTON */}
            <div className="flex gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  showAddedMessage
                    ? isEditingFromCart 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : isEditingFromCart
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {showAddedMessage ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isEditingFromCart ? 'Mise à jour...' : 'Ajouté au panier !'}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {isEditingFromCart ? 'Mettre à jour' : 'Ajouter au panier'}
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsApp}
                disabled={isSoldOut}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Commander
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="border px-4 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? 'text-red-500 fill-red-500'
                      : ''
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