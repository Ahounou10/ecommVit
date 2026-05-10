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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products
        .filter((product) => product && product.id)
        .map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
    </div>
  );
}