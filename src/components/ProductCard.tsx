'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscountedPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const discountedPrice = getDiscountedPrice(product.price, product.promo_percent);
  const discount = product.promo_percent > 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge Promo */}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-fade-in-fast">
            -{product.promo_percent}%
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white rounded-full p-2 hover:bg-gray-100 hover:scale-110 transition-all duration-300 transform"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 transform"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 h-12 sm:h-14">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-emerald-600">
            {formatPrice(discount ? discountedPrice : product.price)}
          </span>
          {discount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="text-xs text-gray-600">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">En stock ({product.stock})</span>
          ) : (
            <span className="text-red-600 font-medium">Rupture de stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
