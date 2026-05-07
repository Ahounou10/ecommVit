'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import Image from 'next/image';
import { Upload, X, ChevronRight } from 'lucide-react';

type Category = 'homme' | 'femme' | 'mixte';
type Subcategory =
  | 'tshirts'
  | 'jeans'
  | 'robes'
  | 'chaussures'
  | 'sneakers';

interface FormDataType {
  name: string;
  price: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  sizes: string[];
  colors: string[];
  stock: string;
  promo_percent: string;
  image_url: string;
}

interface ErrorLike {
  message?: string;
  details?: string;
  hint?: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Rouge', value: '#ff0000' },
  { name: 'Bleu', value: '#0000ff' },
  { name: 'Vert', value: '#008000' },
  { name: 'Gris', value: '#808080' },
];

const CATEGORIES = {
  homme: 'Homme',
  femme: 'Femme',
  mixte: 'Mixte',
};

const SUBCATEGORIES = {
  tshirts: 'T-Shirts',
  jeans: 'Jeans',
  robes: 'Robes',
  chaussures: 'Chaussures',
  sneakers: 'Sneakers',
};

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    price: '',
    description: '',
    category: 'femme',
    subcategory: 'tshirts',
    sizes: [],
    colors: [],
    stock: '',
    promo_percent: '0',
    image_url: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;

    if (typeof err === 'object' && err !== null) {
      const e = err as ErrorLike;

      if (e.message) return e.message;
      if (e.details) return e.details;
      if (e.hint) return e.hint;
    }

    return 'Une erreur inconnue est survenue.';
  }

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError('');
      setSuccess('');
      setIsUploading(true);

      try {
        const ext = file.name.split('.').pop()?.toLowerCase();

        if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
          throw new Error(
            'Format non autorisé. Utilisez JPG, JPEG, PNG ou WEBP.'
          );
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image trop lourde. Maximum 5MB.');
        }

        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        setFormData((prev) => ({
          ...prev,
          image_url: data.publicUrl,
        }));

        setSuccess('Image téléchargée avec succès.');
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        setImagePreview('');
        setFormData((prev) => ({
          ...prev,
          image_url: '',
        }));
      } finally {
        setIsUploading(false);
      }
    },
    [supabase]
  );

  function toggleSize(size: string) {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  function toggleColor(color: string) {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setError('');
      setSuccess('');

      try {
        if (!formData.name.trim()) {
          throw new Error('Le nom du produit est requis.');
        }

        if (!formData.price || Number(formData.price) <= 0) {
          throw new Error('Le prix doit être supérieur à 0.');
        }

        if (!formData.stock || Number(formData.stock) < 0) {
          throw new Error('Le stock est invalide.');
        }

        if (!formData.image_url) {
          throw new Error('Veuillez ajouter une image.');
        }

        if (formData.sizes.length === 0) {
          throw new Error('Choisissez au moins une taille.');
        }

        if (formData.colors.length === 0) {
          throw new Error('Choisissez au moins une couleur.');
        }

        setIsLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error(
            'Vous devez être connecté en admin pour ajouter un produit.'
          );
        }

        const payload = {
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description.trim() || null,
          category: formData.category,
          subcategory: formData.subcategory,
          sizes: formData.sizes,
          colors: formData.colors,
          stock: Number(formData.stock),
          promo_percent: Number(formData.promo_percent) || 0,
          image_url: formData.image_url,
          is_active: true,
        };

        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);

        if (insertError) throw insertError;

        setSuccess('Produit ajouté avec succès.');

        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1200);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router, supabase]
  );
  <h1 style={{color:'red'}}>TEST YASSINE</h1>
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2">Ajouter un produit</h1>
        <p className="text-gray-500 mb-8">
          Remplissez les informations du produit
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-100 text-green-700 px-4 py-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* IMAGE */}
          <div>
            <label className="block font-semibold mb-3">
              Image du produit
            </label>

            {imagePreview ? (
              <div className="relative w-40 h-40 mb-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-xl border"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData((prev) => ({
                      ...prev,
                      image_url: '',
                    }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-xl p-8 text-center bg-gray-50">
                <Upload className="mx-auto mb-2 text-emerald-600" />
                <p className="text-sm text-gray-500">
                  JPG / PNG / WEBP (5MB max)
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="mt-4 block w-full text-sm"
            />

            {isUploading && (
              <p className="text-sm text-emerald-600 mt-2">
                Upload en cours...
              </p>
            )}
          </div>

          {/* NOM */}
          <div>
            <label className="block font-semibold mb-2">
              Nom du produit
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* PRIX */}
          <div>
            <label className="block font-semibold mb-2">Prix</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* CATEGORY */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-2">
                Catégorie
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as Category,
                  }))
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Sous-catégorie
              </label>

              <select
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: e.target.value as Subcategory,
                  }))
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                {Object.entries(SUBCATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SIZES */}
          <div>
            <label className="block font-semibold mb-2">Tailles</label>

            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.sizes.includes(size)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div>
            <label className="block font-semibold mb-2">
              Couleurs
            </label>

            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.colors.includes(color.name)
                      ? 'ring-2 ring-emerald-600'
                      : ''
                  }`}
                  style={{
                    backgroundColor: color.value,
                    color:
                      color.name === 'Blanc' ? '#000' : '#fff',
                  }}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* STOCK + PROMO */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Promotion %
              </label>
              <input
                type="number"
                value={formData.promo_percent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    promo_percent: e.target.value,
                  }))
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {isLoading ? (
              'Publication...'
            ) : (
              <>
                Publier le produit
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}