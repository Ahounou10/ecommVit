'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Upload, X } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES, SIZES, COLORS } from '@/lib/constants';
import type { Product } from '@/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: 'femme',
    subcategory: 'tshirts',
    sizes: ['M'],
    colors: ['Noir'],
    stock: 0,
    promo_percent: 0,
    image_url: '',
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setFormData(data);
      setImagePreview(data.image_url);
    } catch (error) {
      setError('Produit non trouvé');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        setFormData({ ...formData, image_url: publicUrl });
      } catch (error) {
        setError('Erreur lors du téléchargement de l\'image');
      }
    }
  };

  const handleSizeToggle = (size: string) => {
    const sizes = (formData.sizes || []) as string[];
    setFormData({
      ...formData,
      sizes: sizes.includes(size)
        ? sizes.filter((s) => s !== size)
        : [...sizes, size],
    });
  };

  const handleColorToggle = (color: string) => {
    const colors = (formData.colors || []) as string[];
    setFormData({
      ...formData,
      colors: colors.includes(color)
        ? colors.filter((c) => c !== color)
        : [...colors, color],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-4 inline-block"
          >
            ← Retour
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">Photo</label>
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
              {imagePreview && (
                <div className="relative w-full max-w-xs mx-auto">
                  <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4 w-full" />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Prix (FCFA)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">Type</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as any })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
              >
                {Object.entries(SUBCATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Promo */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">Réduction (%)</label>
              <input
                type="number"
                value={formData.promo_percent}
                onChange={(e) => setFormData({ ...formData, promo_percent: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">Tailles</label>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    (formData.sizes as string[]).includes(size)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">Couleurs</label>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorToggle(color.name)}
                  className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                    (formData.colors as string[]).includes(color.name)
                      ? 'ring-4 ring-emerald-600'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-6 h-6 rounded"
            />
            <label className="text-lg font-bold text-gray-900">Produit actif</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 text-lg rounded-lg"
          >
            {isSaving ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
