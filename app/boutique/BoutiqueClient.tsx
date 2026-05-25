'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          return;
        }

        setProducts(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
    }

    filtered = filtered.filter((p) => {
      const finalPrice = p.promo_percent
        ? p.price * (1 - p.promo_percent / 100)
        : p.price;

      return (
        finalPrice >= filters.priceRange[0] &&
        finalPrice <= filters.priceRange[1]
      );
    });

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes.some((size) => p.sizes?.includes(size))
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        filters.colors.some((color) => p.colors?.includes(color))
      );
    }

    return filtered;
  }, [products, filters]);

  return (
    <div className="relative min-h-screen">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-100/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row gap-6">

          {/* SIDEBAR */}
          <aside className="
            md:w-64 lg:w-72
            w-full
            md:sticky md:top-24
            md:self-start
           
          ">
            <div className="
              md:border md:border-gray-200
              md:rounded-2xl
              md:p-4
              md:shadow-lg
              md:bg-white
            ">
              <FilterPanel onFilterChange={setFilters} />
            </div>
          </aside>

          {/* CONTENT */}
          <main className="flex-1 min-w-0 ">

            <div className="flex justify-between items-center mb-6">
           

              <div className="text-sm bg-white px-3 py-1 rounded-full border">
                {filteredProducts.length} produits
              </div>
            </div>

            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </div>
  );
}