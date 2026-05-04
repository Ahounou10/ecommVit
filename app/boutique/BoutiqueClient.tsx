'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

export default function BoutiqueClient({ category }: { category: string | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category,
    subcategory: null,
    priceRange: [0, 500000],
    sizes: [],
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .gt('stock', 0);

    setProducts(data || []);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = products;

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
      const price = p.promo_percent
        ? p.price * (1 - p.promo_percent / 100)
        : p.price;

      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes.some((s) => p.sizes.includes(s))
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-64">
        <FilterPanel onFilterChange={setFilters} />
      </div>

      <div className="flex-1">
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}