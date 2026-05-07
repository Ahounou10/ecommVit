'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { Product } from '@/types';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  // ✅ Vérifie connexion admin
  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login');
    }
  }, [router, supabase]);

  // ✅ Charger produits
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits :', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // ✅ Initialisation propre
  useEffect(() => {
    async function init() {
      await checkAuth();
      await fetchProducts();
    }

    init();
  }, [checkAuth, fetchProducts]);

  // ✅ Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // ✅ Supprimer produit
  const handleDeleteProduct = async (id: string) => {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer ce produit ?'
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error('Erreur suppression :', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              B
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-sm text-gray-500">
                Gestion de la boutique
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-out hover:shadow"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-sm text-gray-500">
              Total Produits
            </p>
            <p className="text-3xl font-bold">
              {products.length}
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-sm text-gray-500">
              En stock
            </p>
            <p className="text-3xl font-bold text-green-600">
              {
                products.filter(
                  (product) => product.stock > 0
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-sm text-gray-500">
              Ruptures
            </p>
            <p className="text-3xl font-bold text-red-600">
              {
                products.filter(
                  (product) => product.stock === 0
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-sm text-gray-500">
              Promotions
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {
                products.filter(
                  (product) =>
                    product.promo_percent > 0
                ).length
              }
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="mb-6">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold transition-all duration-300 ease-out hover:shadow-lg hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Ajouter un produit
          </Link>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Produit
                  </th>
                  <th className="px-4 py-3 text-left">
                    Prix
                  </th>
                  <th className="px-4 py-3 text-left">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      Chargement...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      Aucun produit trouvé.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        {product.name}
                      </td>

                      <td className="px-4 py-4">
                        {product.price.toLocaleString()}{' '}
                        FCFA
                      </td>

                      <td className="px-4 py-4">
                        {product.stock}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-300 ease-out hover:scale-110"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-all duration-300 ease-out hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}