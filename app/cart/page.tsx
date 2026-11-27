'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/supabase/client';
import {
  getCart,
  removeCartItemById,
  saveCart,
  updateCartQuantity,
  type CartItem,
} from '@/lib/cart';
import { useCartSync } from '@/hooks/useCartSync';
import {
  formatPrice,
  getWhatsAppLink,
  formatCartWhatsAppMessage,
  getDiscountedPrice,
} from '@/lib/utils';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartError, setCartError] = useState('');
  const [availability, setAvailability] = useState<
    Record<string, 'checking' | 'available' | 'removed' | 'out_of_stock' | 'insufficient_stock' | 'unknown'>
  >({});
  const [validationVersion, setValidationVersion] = useState(0);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const cartProductIds = useMemo(
    () => [...new Set(cart.map((item) => item.product.id))].sort().join('|'),
    [cart]
  );

  const refreshCart = useCallback(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      refreshCart();
      setIsHydrated(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [refreshCart]);

  useCartSync(refreshCart);

  useEffect(() => {
    const handleFocus = () => setValidationVersion((version) => version + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (!isHydrated || !cartProductIds) {
      return;
    }

    let cancelled = false;

    const validateCartProducts = async () => {
      const currentItems = getCart();
      const productIds = [...new Set(currentItems.map((item) => item.product.id))];

      setAvailability((current) => {
        const next = { ...current };
        currentItems.forEach((item) => {
          next[item.cartItemId] = 'checking';
        });
        return next;
      });

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('is_active', true);

      if (cancelled) return;

      if (error) {
        setCartError('Impossible de vérifier la disponibilité des produits. Réessayez dans quelques instants.');
        setAvailability((current) => {
          const next = { ...current };
          currentItems.forEach((item) => {
            next[item.cartItemId] = 'unknown';
          });
          return next;
        });
        return;
      }

      const latestProducts = new Map(
        (data || []).map((product) => [product.id, product as CartItem['product']])
      );
      const nextAvailability: typeof availability = {};

      const refreshedItems = currentItems.map((item) => {
        const latestProduct = latestProducts.get(item.product.id);

        if (!latestProduct) {
          nextAvailability[item.cartItemId] = 'removed';
          return item;
        }

        const stock = Math.max(0, Number(latestProduct.stock) || 0);
        if (stock === 0) {
          nextAvailability[item.cartItemId] = 'out_of_stock';
        } else if (item.quantity > stock) {
          nextAvailability[item.cartItemId] = 'insufficient_stock';
        } else {
          nextAvailability[item.cartItemId] = 'available';
        }

        return { ...item, product: latestProduct };
      });

      if (cancelled) return;

      setCartError('');
      setAvailability(nextAvailability);
      setCart(refreshedItems);
      if (!saveCart(refreshedItems)) {
        setCartError('Les informations ont été actualisées à l’écran, mais leur sauvegarde locale a échoué.');
      }
    };

    void validateCartProducts();

    return () => {
      cancelled = true;
    };
  }, [cartProductIds, isHydrated, supabase, validationVersion]);

  const total = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const unitPrice = getDiscountedPrice(
          item.product.price,
          item.product.promo_percent
        );
        return sum + unitPrice * item.quantity;
      }, 0),
    [cart]
  );

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappMessage = formatCartWhatsAppMessage(cart);

  function handleQuantityChange(item: CartItem, nextQuantity: number) {
    setCartError('');
    const result = updateCartQuantity(item.cartItemId, nextQuantity);

    if (!result.success) {
      setCartError(result.message);
      return;
    }

    refreshCart();
  }

  function handleRemoveItem(cartItemId: string) {
    setCartError('');
    const removed = removeCartItemById(cartItemId);
    if (!removed) {
      setCartError('Impossible de modifier le panier sur cet appareil.');
      return;
    }
    refreshCart();

    window.dispatchEvent(
      new CustomEvent('showToast', {
        detail: {
          message: 'Article retiré du panier.',
          type: 'info',
          duration: 2200,
        },
      })
    );
  }

  function handleEditItem(item: CartItem) {
    const params = new URLSearchParams();
    params.set('cartItemId', item.cartItemId);
    if (item.size) params.set('size', item.size);
    if (item.color) params.set('color', item.color);

    router.push(`/product/${item.product.id}?${params.toString()}`);
  }

  if (!isHydrated) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-28 rounded-lg bg-gray-100" />
          <div className="h-28 rounded-lg bg-gray-100" />
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6">
        <section className="w-full border border-gray-200 bg-white px-6 py-12 text-center sm:px-12">
          <ShoppingBag className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
            Votre panier est vide
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
            Parcourez la boutique et ajoutez les articles qui vous intéressent.
          </p>
          <Link
            href="/boutique"
            className="mt-7 inline-flex items-center justify-center bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
          >
            Découvrir la boutique
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 border-b border-gray-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Votre sélection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
          Mon panier
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {totalQuantity} article{totalQuantity > 1 ? 's' : ''} au total
        </p>
      </header>

      {cartError && (
        <p role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cartError}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-label="Articles du panier" className="space-y-4">
          {cart.map((item) => {
            const product = item.product;
            const unitPrice = getDiscountedPrice(
              product.price,
              product.promo_percent
            );
            const status = availability[item.cartItemId] ?? 'checking';
            const imageSrc =
              status === 'removed'
                ? '/placeholder.png'
                : product.images?.[0] || product.image_url || '/placeholder.png';
            const stock = Math.max(0, Number(product.stock) || 0);
            const isAvailable = status === 'available';

            return (
              <article
                key={item.cartItemId}
                className="flex flex-col gap-4 border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-50 sm:h-32 sm:w-28">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 112px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-950">{product.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Taille : {item.size || 'Non précisée'} · Couleur : {item.color || 'Non précisée'}
                  </p>
                  <p className="mt-3 text-base font-semibold text-gray-950">
                    {formatPrice(unitPrice)}
                    <span className="ml-1 text-xs font-normal text-gray-500">l’unité</span>
                  </p>
                  {status === 'removed' && (
                    <p role="status" className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                      Ce produit a été retiré de la boutique. Il n’existe plus.
                    </p>
                  )}
                  {status === 'out_of_stock' && (
                    <p role="status" className="mt-3 border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-800">
                      Produit en rupture de stock. Vous ne pouvez plus le commander ni le modifier.
                    </p>
                  )}
                  {status === 'insufficient_stock' && (
                    <p role="status" className="mt-3 border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                      Stock insuffisant : seulement {stock} article{stock > 1 ? 's' : ''} disponible{stock > 1 ? 's' : ''}. Ajustez la quantité ou retirez cet article.
                    </p>
                  )}
                  {status === 'checking' && (
                    <p className="mt-3 text-xs text-gray-500">Vérification de la disponibilité…</p>
                  )}
                  {status === 'unknown' && (
                    <p role="alert" className="mt-3 text-sm text-red-700">
                      Disponibilité non vérifiée. Réessayez avant de commander.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  {isAvailable ? (
                    <div className="flex items-center border border-gray-300">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Diminuer la quantité de ${product.name}`}
                        className="p-2.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-9 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity >= stock}
                        aria-label={`Augmenter la quantité de ${product.name}`}
                        className="p-2.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : status === 'insufficient_stock' ? (
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, stock)}
                      className="px-3 py-2 text-sm font-medium text-gray-800 underline underline-offset-4"
                    >
                      Ajuster à {stock}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Actions indisponibles</span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditItem(item)}
                    disabled={!isAvailable}
                    className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-gray-700 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    aria-label={`Retirer ${product.name} du panier`}
                    className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-red-700 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                    Retirer
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-950">Récapitulatif</h2>
          <div className="mt-5 flex items-center justify-between border-b border-gray-200 pb-4 text-sm text-gray-600">
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="font-semibold text-gray-950">Total</span>
            <span className="text-xl font-semibold text-gray-950">{formatPrice(total)}</span>
          </div>
          <p className="mb-5 text-xs leading-5 text-gray-500">
            Les frais de livraison et les modalités de paiement seront confirmés lors de la commande.
          </p>
          {cart.some((item) => availability[item.cartItemId] !== 'available') && (
            <p className="mb-3 border border-orange-200 bg-orange-50 px-3 py-2 text-xs leading-5 text-orange-800">
              Retirez les produits indisponibles ou ajustez les quantités signalées pour continuer votre commande.
            </p>
          )}
          <button
            type="button"
            disabled={cart.some((item) => availability[item.cartItemId] !== 'available')}
            onClick={() => window.open(getWhatsAppLink(whatsappMessage), '_blank', 'noopener,noreferrer')}
            className="block w-full bg-gray-900 px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            Commander via WhatsApp
          </button>
          <Link
            href="/boutique"
            className="mt-3 block w-full border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </main>
  );
}
