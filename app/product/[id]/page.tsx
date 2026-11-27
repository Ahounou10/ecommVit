'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Check,
  X,
} from 'lucide-react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { createClient } from '@/supabase/client';

import {
  formatPrice,
  getDiscountedPrice,
  getWhatsAppLink,
} from '@/lib/utils';

import { addToCart, updateCartItemById } from '@/lib/cart';

import type { Product } from '@/types';

const supabase = createClient();

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const searchParams = useSearchParams();

  const cartItemId =
    searchParams.get('cartItemId');

  const urlSize =
    searchParams.get('size') || 'M';

  const urlColor =
    searchParams.get('color') || 'Noir';

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] =
    useState(urlSize);

  const [selectedColor, setSelectedColor] =
    useState(urlColor);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showAddedMessage, setShowAddedMessage] =
    useState(false);

  const [cartActionError, setCartActionError] = useState('');

  const [showImageModal, setShowImageModal] =
    useState(false);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);

  const isEditingFromCart =
    cartItemId !== null;

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
        setSelectedSize((current) =>
          data.sizes?.includes(current) ? current : data.sizes?.[0] || ''
        );
        setSelectedColor((current) =>
          data.colors?.includes(current) ? current : data.colors?.[0] || ''
        );
      } catch (err) {
        console.error(
          'Erreur produit:',
          err
        );

        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ESC + SCROLL LOCK MODAL
  useEffect(() => {
    if (!showImageModal) return;

    // Bloquer le scroll en arrière-plan
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      // Restaurer le scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showImageModal]);

  // LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <div className="text-slate-500 text-lg animate-pulse-soft">
          Chargement du produit...
        </div>
      </div>
    );
  }

  // PRODUIT INTROUVABLE
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <div className="text-red-500 font-semibold">
          Produit non trouvé
        </div>
      </div>
    );
  }

  const price = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  const isSoldOut = product.stock === 0;

  // IMAGES
  const productImages =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

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
      <div className="min-h-screen flex items-center justify-center">
        Image non disponible
      </div>
    );
  }

  // AJOUT PANIER
  const handleAddToCart = () => {
    setCartActionError('');

    if (!selectedSize || !product.sizes?.includes(selectedSize)) {
      setCartActionError('Veuillez choisir une taille disponible.');
      return;
    }

    if (!selectedColor || !product.colors?.includes(selectedColor)) {
      setCartActionError('Veuillez choisir une couleur disponible.');
      return;
    }

    if (isEditingFromCart && cartItemId) {
      const updated = updateCartItemById(
        cartItemId,
        product,
        undefined,
        selectedSize,
        selectedColor
      );

      if (!updated) {
        setCartActionError('Cet article ne peut plus être modifié. Vérifiez le panier et le stock disponible.');
        return;
      }
    } else {
      const result = addToCart(product, 1, selectedSize, selectedColor);
      if (!result.success) {
        setCartActionError(result.message);
        return;
      }
      if (result.message !== 'Produit ajouté au panier.') {
        setCartActionError(result.message);
      }
    }

    setShowAddedMessage(true);

    setTimeout(() => {
      setShowAddedMessage(false);
      if (isEditingFromCart) router.push('/cart');
    }, 1200);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 py-6 sm:py-10">
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-teal-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* GALERIE */}
          <div className="w-full">

            {/* IMAGE PRINCIPALE */}
            <button
              type="button"
              onClick={() =>
                setShowImageModal(true)
              }
              className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/70 shadow-2xl shadow-slate-200/40 hover:scale-[1.01] transition-all duration-500"
            >
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>

            {/* MINIATURES */}
            {productImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {productImages.map(
                  (img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setSelectedImageIndex(
                          idx
                        )
                      }
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                        safeSelectedIndex ===
                        idx
                          ? 'border-emerald-500 ring-4 ring-emerald-100 scale-105'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name}-${idx}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="w-full">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-center gap-4 mt-5 flex-wrap">

              <p className="text-emerald-600 text-3xl sm:text-4xl font-bold tracking-tight">
                {formatPrice(price)}
              </p>

              {product.promo_percent > 0 && (
                <>
                  <p className="text-slate-400 line-through text-lg sm:text-xl">
                    {formatPrice(product.price)}
                  </p>

                  <span className="bg-red-500/10 text-red-600 border border-red-200 px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.promo_percent}%
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-slate-600 mt-6 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* STOCK */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm ${
                    product.stock <= 3
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  {product.stock <= 3
                    ? `Plus que ${product.stock} en stock`
                    : `${product.stock} disponible${
                        product.stock > 1
                          ? 's'
                          : ''
                      }`}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-600 font-medium text-sm">
                  Rupture de stock
                </div>
              )}
            </div>

            {/* TAILLES */}
            <div className="mt-8">
              <h3 className="font-semibold text-slate-800 mb-3">
                Taille
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`px-5 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-white hover:bg-emerald-50 border-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COULEURS */}
            <div className="mt-8">
              <h3 className="font-semibold text-slate-800 mb-3">
                Couleur
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.colors?.map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setSelectedColor(
                          color
                        )
                      }
                      className={`px-5 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                        selectedColor ===
                        color
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                          : 'bg-white hover:bg-emerald-50 border-slate-200'
                      }`}
                    >
                      {color}
                    </button>
                  )
                )}
              </div>
            </div>

            {cartActionError && (
              <p role="alert" className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cartActionError}
              </p>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`w-full sm:flex-1 px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 text-sm transition-all duration-300 ${
                  isSoldOut
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : showAddedMessage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-1'
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
                      : 'Ajouter au panier'}
                  </>
                )}
              </button>

              {/* WHATSAPP */}
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={isSoldOut}
                className={`w-full sm:flex-1 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  isSoldOut
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:-translate-y-1 shadow-sm'
                }`}
              >
                Commander via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL IMAGE */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
        >
          {/* BOUTON FERMETURE — toujours ancré en haut à droite du viewport */}
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md rounded-full p-3 hover:bg-white active:scale-95 transition-all duration-200 shadow-xl"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-slate-800" />
          </button>

          {/* IMAGE — zone sécurisée, clic ne ferme pas */}
          <div
            className="absolute inset-0 flex items-center justify-center p-14 sm:p-16 md:p-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}