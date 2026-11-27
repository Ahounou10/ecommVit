'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const productImage = product.images?.[0] || product.image_url;
  if (!productImage) return null;

  const defaultSize = product.sizes?.[0] || 'M';
  const defaultColor = product.colors?.[0] || 'Noir';
  const hasStock = Number(product.stock) > 0;
  const hasDiscount = Number(product.promo_percent) > 0;

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const result = addToCart(product, 1, defaultSize, defaultColor);

    window.dispatchEvent(
      new CustomEvent('showToast', {
        detail: {
          message: result.message,
          type: result.success ? 'success' : 'error',
          duration: 2500,
        },
      })
    );
  }

  const displayedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  return (
    <article className="group h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
              -{product.promo_percent}%
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-900 sm:text-base">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-semibold text-gray-950">
              {formatPrice(hasDiscount ? displayedPrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!hasStock}
          aria-label={hasStock ? `Ajouter ${product.name} au panier` : 'Produit indisponible'}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#263b5b] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1d2f49] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        >
          <ShoppingBag className="h-4 w-4" />
          {hasStock ? 'Ajouter au panier' : 'Indisponible'}
        </button>
      </div>
    </article>
  );
}
