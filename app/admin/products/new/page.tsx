'use client';

import { useState, useCallback, useMemo } from 'react';
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
  images: string[];
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

const ADMIN_USER_ID = '68f37f7e-f4c0-406e-8e05-1cec82f261f0';

function getProductStoragePath(publicUrl: string): string | null {
  const marker = '/storage/v1/object/public/products/';
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return null;
  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length).split('?')[0]);
}

const SUBCATEGORIES = {
  tshirts: 'T-Shirts',
  jeans: 'Jeans',
  robes: 'Robes',
  chaussures: 'Chaussures',
  sneakers: 'Sneakers',
};

export default function NewProductPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

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
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setError('');
      setSuccess('');
      setIsUploading(true);
      const uploadedPaths: string[] = [];
      const newPreviews: string[] = [];

      try {
        const uploadedUrls: string[] = [];

        if (imagePreviews.length + files.length > 8) {
          throw new Error('Vous pouvez ajouter au maximum 8 images à la fois.');
        }

        for (const file of Array.from(files)) {
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            throw new Error('Format non autorisé. Utilisez JPG, PNG ou WEBP.');
          }
          if (file.size > 5 * 1024 * 1024) {
            throw new Error('Chaque image doit peser 5 Mo maximum.');
          }
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
          const localPreview = URL.createObjectURL(file);
          newPreviews.push(localPreview);

          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${i}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;
          uploadedPaths.push(fileName);

          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          uploadedUrls.push(data.publicUrl);
        }

        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));

        setSuccess(
          `${files.length} image(s) téléchargée(s) avec succès.`
        );
      } catch (err: unknown) {
        if (uploadedPaths.length > 0) {
          await supabase.storage.from('products').remove(uploadedPaths);
        }
        newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setError(getErrorMessage(err));
      } finally {
        setIsUploading(false);
        e.target.value = '';
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

        const price = Number(formData.price);
        const stock = Number(formData.stock);
        const promo = Number(formData.promo_percent);

        if (!Number.isInteger(price) || price <= 0) {
          throw new Error('Le prix doit être un nombre entier supérieur à 0.');
        }

        if (formData.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
          throw new Error('Le stock doit être un nombre entier positif ou nul.');
        }

        if (!Number.isInteger(promo) || promo < 0 || promo > 100) {
          throw new Error('La promotion doit être comprise entre 0 et 100 %.');
        }

        if (formData.images.length === 0) {
          throw new Error('Veuillez ajouter au moins une image.');
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

        if (!session || session.user.id !== ADMIN_USER_ID) {
          throw new Error('Seul le compte administrateur autorisé peut ajouter un produit.');
        }

        const payload = {
          name: formData.name.trim(),
          price,
          description: formData.description.trim() || null,
          category: formData.category,
          subcategory: formData.subcategory,
          sizes: formData.sizes,
          colors: formData.colors,
          stock,
          promo_percent: promo,
          images: formData.images,
          image_url: formData.images[0],
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
  
  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-6 md:p-8">
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
          {/* IMAGES */}
          <div>
            <label className="block font-semibold mb-3">
              Images du produit (plusieurs)
            </label>

            {imagePreviews.length > 0 ? (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-full aspect-square">
                    <Image
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <div className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const imageUrl = formData.images[idx];
                        const storagePath = imageUrl ? getProductStoragePath(imageUrl) : null;
                        if (storagePath) {
                          void supabase.storage.from('products').remove([storagePath]).then(({ error }) => {
                            if (error) setError('L’image a été retirée du formulaire, mais pas du stockage.');
                          });
                        }

                        URL.revokeObjectURL(imagePreviews[idx]);
                        const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                        const newImages = formData.images.filter((_, i) => i !== idx);
                        setImagePreviews(newPreviews);
                        setFormData((prev) => ({
                          ...prev,
                          images: newImages,
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-xl p-8 text-center bg-gray-50">
                <Upload className="mx-auto mb-2 text-emerald-600" />
                <p className="text-sm text-gray-500">
                  JPG / PNG / WEBP (5MB max par image)
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
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
              min="1"
              step="1"
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
                      ? 'bg-gray-950 text-white'
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
                      ? 'ring-2 ring-gray-900'
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
                min="0"
                step="1"
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
                min="0"
                max="100"
                step="1"
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
            className="w-full bg-gray-950 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
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