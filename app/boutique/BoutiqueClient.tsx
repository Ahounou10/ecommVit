'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel, {
  type FilterState,
} from '@/components/FilterPanel';

import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

const supabase = createClient();

export default function BoutiqueClient({
  category,
}: {
  category?: string | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: category ?? null,
    subcategory: null,
    priceRange: [0, 500000],
    sizes: [],
    colors: [],
  });

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

        if (error) {
          console.error(
            'Erreur récupération produits:',
            error
          );

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
  }, []);

  // 🔥 FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // SEARCH
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    // CATEGORY
    if (filters.category) {
      filtered = filtered.filter(
        (p) => p.category === filters.category
      );
    }

    // SUBCATEGORY
    if (filters.subcategory) {
      filtered = filtered.filter(
        (p) =>
          p.subcategory === filters.subcategory
      );
    }

    // PRICE
    filtered = filtered.filter((p) => {
      const finalPrice = p.promo_percent
        ? p.price *
          (1 - p.promo_percent / 100)
        : p.price;

      return (
        finalPrice >= filters.priceRange[0] &&
        finalPrice <= filters.priceRange[1]
      );
    });

    // SIZES
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes.some((size) =>
          p.sizes?.includes(size)
        )
      );
    }

    // COLORS
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        filters.colors.some((color) =>
          p.colors?.includes(color)
        )
      );
    }

    return filtered;
  }, [products, filters]);

  return (
    <section className="relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-200/40">
            <FilterPanel
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Boutique
              </h1>

              <p className="text-slate-500 mt-1">
                Découvrez notre collection
                exclusive.
              </p>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 text-slate-700 font-medium shadow-sm">
              {filteredProducts.length} produit
              {filteredProducts.length > 1
                ? 's'
                : ''}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="rounded-3xl">
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}