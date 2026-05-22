'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, X } from 'lucide-react';
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
  const [selectedSize, setSelectedSize] = useState(urlSize);
  const [selectedColor, setSelectedColor] = useState(urlColor);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isEditingFromCart = cartItemId !== null;

  const supabase = createClient();

  // FETCH PRODUIT
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
          console.error(error);
          setProduct(null);
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error('Erreur produit:', err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // FERMER MODAL AVEC ESC
  useEffect(() => {
    if (!showImageModal) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showImageModal]);

  // LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // PRODUIT INTROUVABLE
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

  // GALERIE IMAGES SAFE
  const productImages =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

  // SAFE INDEX
  const safeSelectedIndex =
    productImages.length > 0
      ? Math.min(
          selectedImageIndex,
          productImages.length - 1
        )
      : 0;

  const currentImage =
    productImages[safeSelectedIndex];

  // IMAGE MANQUANTE
  if (!currentImage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Image non disponible
      </div>
    );
  }

  // AJOUT PANIER
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
      addToCart(
        product,
        1,
        selectedSize,
        selectedColor
      );
    }

    setShowAddedMessage(true);

    setTimeout(() => {
      setShowAddedMessage(false);

      if (isEditingFromCart) {
        router.push('/cart');
      }
    }, 1500);
  };

  // WHATSAPP
  const handleWhatsApp = () => {
    const message = `
*Bonjour je souhaite commander ce produit*

Produit : ${product.name}
Taille : ${selectedSize}
Couleur : ${selectedColor}

Merci !
`;

    window.open(
      getWhatsAppLink(message),
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* GALERIE */}
          <div className="w-full max-w-md mx-auto">

            {/* IMAGE PRINCIPALE */}
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 hover:shadow-lg transition"
            >
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </button>

            {/* MINIATURES */}
            {productImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex(idx)
                    }
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                      safeSelectedIndex === idx
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name}-${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="w-full">

            <h1 className="text-2xl md:text-3xl font-bold">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 flex-wrap">

  {/* Nouveau prix */}
  <p className="text-emerald-600 text-2xl md:text-3xl font-bold">
    {formatPrice(price)}
  </p>

  {/* Ancien prix */}
  {product.promo_percent > 0 && (
    <p className="text-gray-400 line-through text-lg md:text-xl">
      {formatPrice(product.price)}
    </p>
  )}

  {/* Badge promo */}
  {product.promo_percent > 0 && (
    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
      -{product.promo_percent}%
    </span>
  )}

</div>

            <p className="text-gray-600 mt-4 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* TAILLES */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Taille
              </h3>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COULEURS */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Couleur
              </h3>

              <div className="flex flex-wrap gap-2">
           {product.colors?.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selectedColor === color
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* STOCK */}
<div className="mt-4">

  {product.stock > 0 ? (

    <div
      className={`font-medium ${
        product.stock <= 3
          ? 'text-orange-600'
          : 'text-emerald-600'
      }`}
    >
      {product.stock <= 3
        ? ` Plus que ${product.stock} en stock`
        : ` En stock : ${product.stock} disponible${
            product.stock > 1 ? 's' : ''
          }`}
    </div>

  ) : (

    <div className="text-red-600 font-semibold">
       Rupture de stock
    </div>

  )}

</div>

            {/* BOUTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`w-full sm:flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-all duration-200 ${
  isSoldOut
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : showAddedMessage
    ? 'bg-emerald-600 text-white'
    : isEditingFromCart
    ? 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'
    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
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
                    {isEditingFromCart
                      ? 'Mettre à jour'
                      : 'Ajouter'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={isSoldOut}
                className={`w-full sm:flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
  isSoldOut
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
}`}
              >
                Commander
              </button>

            </div>
          </div>
        </div>
      </div>


      

      {/* MODAL IMAGE */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">

            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
            />

            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition"
            >
              <X className="w-6 h-6 text-black" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}