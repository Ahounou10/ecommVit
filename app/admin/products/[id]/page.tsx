'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

/* TYPES */
type Category = 'homme' | 'femme' | 'mixte';
type Subcategory =
  | 'tshirts'
  | 'jeans'
  | 'robes'
  | 'chaussures'
  | 'sneakers';

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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = useMemo(() => createClient(), []);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  /* FORM */
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  const [category, setCategory] = useState<Category>('femme');
  const [subcategory, setSubcategory] = useState<Subcategory>('tshirts');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [promo, setPromo] = useState<number>(0);

  /* FETCH */
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error(error);
        setProduct(null);
        setIsLoading(false);
        return;
      }

      setProduct(data);

      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(data.price || 0);
      setStock(data.stock || 0);
      setImages(data.images || (data.image_url ? [data.image_url] : []));

      setCategory(data.category || 'femme');
      setSubcategory(data.subcategory || 'tshirts');
      setSizes(data.sizes || []);
      setColors(data.colors || []);
      setPromo(data.promo_percent || 0);

      setIsLoading(false);
    };

    fetchProduct();
  }, [id, supabase]);

  /* TOGGLES */
  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  /* IMAGE UPLOAD */
  const handleUploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    setErrorMessage('');
    setIsUploading(true);
    const uploadedPaths: string[] = [];

    try {
      if (images.length + files.length > 8) {
        throw new Error('Un produit peut contenir au maximum 8 images.');
      }

      for (const file of Array.from(files)) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Format non autorisé. Utilisez JPG, PNG ou WEBP.');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Chaque image doit peser 5 Mo maximum.');
        }
      }

      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage
          .from('products')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) throw error;
        uploadedPaths.push(fileName);

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from('products').remove(uploadedPaths);
      }
      setErrorMessage(error instanceof Error ? error.message : 'Échec du téléchargement des images.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove) {
      setRemovedImageUrls((prev) => [...prev, imageToRemove]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* SAVE */
  const handleSave = async () => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Le nom du produit est obligatoire.');
      return;
    }
    if (!Number.isInteger(price) || price <= 0) {
      setErrorMessage('Le prix doit être un nombre entier supérieur à 0.');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setErrorMessage('Le stock doit être un nombre entier positif ou nul.');
      return;
    }
    if (!Number.isInteger(promo) || promo < 0 || promo > 100) {
      setErrorMessage('La promotion doit être comprise entre 0 et 100 %.');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('Ajoutez au moins une image au produit.');
      return;
    }
    if (sizes.length === 0 || colors.length === 0) {
      setErrorMessage('Sélectionnez au moins une taille et une couleur.');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || user?.id !== ADMIN_USER_ID) {
        throw new Error('Seul le compte administrateur autorisé peut modifier un produit.');
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: name.trim(),
          description: description.trim(),
          price,
          stock,
          images,
          image_url: images[0],
          category,
          subcategory,
          sizes,
          colors,
          promo_percent: promo,
        })
        .eq('id', id)
        .select('id')
        .single();

      if (error) throw error;

      const pathsToDelete = removedImageUrls
        .map(getProductStoragePath)
        .filter((path): path is string => Boolean(path));
      let storageCleanupFailed = false;

      if (pathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('products')
          .remove(pathsToDelete);
        if (storageError) {
          storageCleanupFailed = true;
          setErrorMessage('Produit enregistré, mais certaines anciennes images n’ont pas pu être supprimées du stockage.');
        } else {
          setRemovedImageUrls([]);
        }
      }

      setProduct((prev) => prev ? {
        ...prev,
        name: name.trim(), description: description.trim(), price, stock,
        images, image_url: images[0], category, subcategory, sizes, colors,
        promo_percent: promo,
      } : prev);

      if (!storageCleanupFailed) alert('Produit mis à jour avec succès.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde du produit.');
    } finally {
      setIsSaving(false);
    }
  };

  /* LOADING */
  if (isLoading) {
    return (
      <div className="p-10 text-center">Chargement...</div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center">Produit introuvable</div>
    );
  }

  /* UI */
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Modifier produit
        </h1>

        {/* IMAGES */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Images du produit
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={isUploading || isSaving}
            onChange={handleUploadImages}
          />
          <p className="mt-1 text-xs text-gray-500">JPG, PNG ou WEBP · 5 Mo maximum par image · 8 images maximum.</p>
          {isUploading && <p className="mt-2 text-sm text-gray-600">Téléchargement des images…</p>}
          {errorMessage && <p role="alert" className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <Image
                  src={img}
                  alt=""
                  width={150}
                  height={150}
                  className="rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* NOM */}
          <div>
            <label className="block font-semibold mb-1">
              Nom du produit
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* PRIX / STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">
                Prix
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) =>
                  setPrice(Number(e.target.value))
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) =>
                  setStock(Number(e.target.value))
                }
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* CATÉGORIE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Category)
                }
                className="w-full border p-2 rounded"
              >
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Sous-catégorie
              </label>
              <select
                value={subcategory}
                onChange={(e) =>
                  setSubcategory(e.target.value as Subcategory)
                }
                className="w-full border p-2 rounded"
              >
                {Object.entries(SUBCATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PROMO */}
          <div>
            <label className="block font-semibold mb-1">
              Promotion (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={promo}
              onChange={(e) =>
                setPromo(Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* SIZES */}
          <div>
            <label className="block font-semibold mb-2">
              Tailles
            </label>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1 border rounded ${
                    sizes.includes(s)
                      ? 'bg-green-500 text-white'
                      : ''
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS */}
          
          <div>
  <label className="block font-semibold mb-2">
    Couleurs
  </label>

  <div className="flex gap-2 flex-wrap">
    {COLORS.map((c) => {
      const isDark =
        c.name === 'Noir' ||
        c.name === 'Bleu' ||
        c.name === 'Vert' ||
        c.name === 'Gris' ||
        c.name === 'Rouge';

      return (
        <button
          key={c.name}
          type="button"
          onClick={() => toggleColor(c.name)}
          className={`px-3 py-1 border rounded transition ${
            colors.includes(c.name)
              ? 'ring-2 ring-green-500'
              : ''
          }`}
          style={{ backgroundColor: c.value }}
        >
          <span className={isDark ? 'text-white' : 'text-black'}>
            {c.name}
          </span>
        </button>
      );
    })}
  </div>
</div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="w-full bg-gray-900 text-white py-3 rounded disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}