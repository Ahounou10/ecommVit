'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const getProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, [supabase]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();

        if (isActive) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Error fetching products');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [getProducts]);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setIsLoading(false);
    }
  }, [getProducts]);

  return { products, isLoading, error, refetch };
}
