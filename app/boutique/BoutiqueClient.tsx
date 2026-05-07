'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

export default function BoutiqueClient({
  category,
}: {
  category?: string | null;
}) {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: category ?? null,
    subcategory: null,
    priceRange: [0, 500000],
    sizes: [],
  });

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .gt('stock', 0);

        if (error) {
          console.error('Erreur récupération produits:', error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    
    fetchProducts();
  }, [supabase]);

  // ✅ FILTER PRODUCTS (sans setState)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 🔎 Recherche
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // 🏷️ Catégorie
    if (filters.category) {
      filtered = filtered.filter(
        (p) => p.category === filters.category
      );
    }

    // 🧩 Sous-catégorie
    if (filters.subcategory) {
      filtered = filtered.filter(
        (p) => p.subcategory === filters.subcategory
      );
    }

    // 💰 Prix
    filtered = filtered.filter((p) => {
      const finalPrice = p.promo_percent
        ? p.price * (1 - p.promo_percent / 100)
        : p.price;

      return (
        finalPrice >= filters.priceRange[0] &&
        finalPrice <= filters.priceRange[1]
      );
    });

    // 👕 Tailles
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes.some((size) =>
          p.sizes.includes(size)
        )
      );
    }

    return filtered;
  }, [products, filters]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* FILTERS */}
      <div className="md:w-64">
        <FilterPanel onFilterChange={setFilters} />
      </div>

      {/* PRODUCTS */}
      <div className="flex-1">
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}