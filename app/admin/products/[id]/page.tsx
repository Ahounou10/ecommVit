'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // ✅ STATE MANQUANT (corrige ton erreur setProduct)
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (err) {
        console.error('Erreur produit:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, supabase]);

  // 🔥 LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // 🔥 PRODUIT INEXISTANT
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Produit introuvable 
      </div>
    );
  }

  // 🔥 RENDER SIMPLE (à adapter après)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-emerald-600 font-bold">
        {product.price} FCFA
      </p>
    </div>
  );
}