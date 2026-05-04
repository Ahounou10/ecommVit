'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Upload, X } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES, SIZES, COLORS } from '@/lib/constants';

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'femme',
    subcategory: 'tshirts',
    sizes: ['M'],
    colors: ['Noir'],
    stock: '',
    promo_percent: '0',
    image_url: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📷 UPLOAD IMAGE
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();

      if (!fileExt || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExt)) {
        throw new Error("Format d'image non supporté");
      }

      // ✅ ICI CORRIGÉ : bucket = products
      const bucket = 'products';

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        image_url: data.publicUrl,
      }));

    } catch (err) {
      console.error(err);
      setError("Erreur lors du téléchargement de l'image");
      setImagePreview('');
      setFormData((prev) => ({ ...prev, image_url: '' }));
    } finally {
      setIsUploading(false);
    }
  };

  // tailles
  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // couleurs
  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  // submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.image_url) {
        throw new Error("Veuillez ajouter une image");
      }

      const { error } = await supabase.from('products').insert([
        {
          name: formData.name,
          price: Number(formData.price),
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          sizes: formData.sizes,
          colors: formData.colors,
          stock: Number(formData.stock),
          promo_percent: Number(formData.promo_percent),
          image_url: formData.image_url,
          is_active: true,
        },
      ]);

      if (error) throw error;

      router.push('/admin/dashboard');

    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du produit");
    } finally {
      setIsLoading(false);
    }
  }, [formData, supabase, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-2">Ajouter un produit</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">

          {/* IMAGE */}
          <div className="mb-6">
            <label className="font-bold block mb-2">Image</label>

            {imagePreview && (
              <img src={imagePreview} className="w-40 mb-2 rounded" />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />

            {isUploading && (
              <p className="text-sm text-gray-500">Upload en cours...</p>
            )}
          </div>

          {/* NAME */}
          <input
            className="w-full border p-2 mb-3"
            placeholder="Nom du produit"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          {/* PRICE */}
          <input
            type="number"
            className="w-full border p-2 mb-3"
            placeholder="Prix"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            {isLoading ? "Publication..." : "Publier"}
          </button>

        </form>
      </div>
    </div>
  );
}