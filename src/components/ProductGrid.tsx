'use client';

import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Chargement des produits...
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        Aucun produit disponible
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
      {products
        .filter((product) => product && product.id)
        .map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
    </div>
  );
}