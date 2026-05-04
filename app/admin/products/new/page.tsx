'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Upload, X } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES, SIZES, COLORS } from '@/lib/constants';

export default function NewProductPage() {
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

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
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
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size)
        ? formData.sizes.filter((s) => s !== size)
        : [...formData.sizes, size],
    });
  };

  const handleColorToggle = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.includes(color)
        ? formData.colors.filter((c) => c !== color)
        : [...formData.colors, color],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.image_url) {
        throw new Error('Veuillez ajouter une image');
      }

      const { error } = await supabase.from('products').insert([
        {
          name: formData.name,
          price: parseInt(formData.price),
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          sizes: formData.sizes,
          colors: formData.colors,
          stock: parseInt(formData.stock),
          promo_percent: parseInt(formData.promo_percent),
          image_url: formData.image_url,
          is_active: true,
        },
      ]);

      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du produit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin/dashboard"
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-4 inline-block"
          >
            ← Retour
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un produit</h1>
          <p className="text-gray-600 mt-2">Remplissez les informations ci-dessous</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              📷 Photo du produit
            </label>
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50">
              {imagePreview ? (
                <div className="relative w-full max-w-xs mx-auto">
                  <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image_url: '' });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-gray-600 font-medium">Cliquez pour ajouter une photo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 w-full"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Nom du produit
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="Ex: T-shirt Premium Noir"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Prix (FCFA)
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="15000"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="Décrivez votre produit..."
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Type
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              {Object.entries(SUBCATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Tailles disponibles
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`py-3 rounded-lg font-bold text-lg transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Couleurs disponibles
            </label>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorToggle(color.name)}
                  className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                    formData.colors.includes(color.name)
                      ? 'ring-4 ring-emerald-600 bg-gray-100'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border-2 border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Quantité en stock
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="10"
            />
          </div>

          {/* Promotion */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Réduction (%) - Optionnel
            </label>
            <input
              type="number"
              value={formData.promo_percent}
              onChange={(e) => setFormData({ ...formData, promo_percent: e.target.value })}
              min="0"
              max="100"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="0"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 text-lg rounded-lg transition-colors"
          >
            {isLoading ? 'Publication en cours...' : '✨ Publier le produit'}
          </button>
        </form>
      </div>
    </div>
  );
}
