'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { CATEGORIES, SUBCATEGORIES, SIZES, COLORS } from '@/lib/constants';
import type { Product } from '@/types';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next.js 16 : unwrap params
  const { id } = use(params);

  const router = useRouter();
  const supabase = createClient();

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

  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================
  // Charger produit
  // ========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          throw new Error();
        }

        setFormData(data);
        setImagePreview(data.image_url);
      } catch {
        setError('Produit non trouvé');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, supabase]);

  // ========================
  // Upload image
  // ========================
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('products').getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
    } catch {
      setError("Erreur lors de l'upload image");
    }
  };

  // ========================
  // Submit
  // ========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch {
      setError('Erreur lors de la modification');
    } finally {
      setIsSaving(false);
    }
  };

  // ========================
  // Toggle tailles
  // ========================
  const handleSizeToggle = (size: string) => {
    const sizes = formData.sizes || [];

    setFormData((prev) => ({
      ...prev,
      sizes: sizes.includes(size)
        ? sizes.filter((s) => s !== size)
        : [...sizes, size],
    }));
  };

  // ========================
  // Toggle couleurs
  // ========================
  const handleColorToggle = (color: string) => {
    const colors = formData.colors || [];

    setFormData((prev) => ({
      ...prev,
      colors: colors.includes(color)
        ? colors.filter((c) => c !== color)
        : [...colors, color],
    }));
  };

  // ========================
  // Loading
  // ========================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  // ========================
  // Render
  // ========================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">

        <a
          href="/admin/dashboard"
          className="text-emerald-600 font-semibold mb-4 inline-block"
        >
          ← Retour
        </a>

        <h1 className="text-3xl font-bold mb-6">
          Modifier le produit
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* IMAGE */}
          <div>
            <label className="font-bold block mb-2">Photo</label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-40 rounded mb-3"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* NAME */}
          <div>
            <label className="font-bold block mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="font-bold block mb-2">Prix</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-bold block mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="font-bold block mb-2">
              Catégorie
            </label>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            >
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY */}
          <div>
            <label className="font-bold block mb-2">
              Type
            </label>

            <select
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subcategory: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            >
              {Object.entries(SUBCATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* STOCK */}
          <div>
            <label className="font-bold block mb-2">
              Stock
            </label>

            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: Number(e.target.value),
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* PROMO */}
          <div>
            <label className="font-bold block mb-2">
              Réduction (%)
            </label>

            <input
              type="number"
              value={formData.promo_percent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promo_percent: Number(e.target.value),
                })
              }
              className="w-full border p-3 rounded"
            />
          </div>

          {/* TAILLES */}
          <div>
            <label className="font-bold block mb-2">
              Tailles
            </label>

            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`p-2 rounded ${
                    formData.sizes?.includes(size)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COULEURS */}
          <div>
            <label className="font-bold block mb-2">
              Couleurs
            </label>

            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() =>
                    handleColorToggle(color.name)
                  }
                  className={`p-2 rounded border ${
                    formData.colors?.includes(color.name)
                      ? 'border-emerald-600'
                      : 'border-gray-300'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE */}
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.checked,
                })
              }
            />

            <span>Produit actif</span>
          </div>

          {/* BTN */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white py-3 rounded font-bold"
          >
            {isSaving
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}