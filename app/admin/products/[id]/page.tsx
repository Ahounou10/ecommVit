'use client';

import { use, useEffect, useState } from 'react';
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
  const supabase = createClient();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
  }, [id]);

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
    if (!files) return;

    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        uploaded.push(data.publicUrl);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* SAVE */
  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        stock,
        images,
        image_url: images[0] || null,
        category,
        subcategory,
        sizes,
        colors,
        promo_percent: promo,
      })
      .eq('id', id);

    setIsSaving(false);

    if (error) {
      console.error(error);
      alert('Erreur sauvegarde');
      return;
    }

    alert('Produit mis à jour avec succès');
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

          <input type="file" multiple onChange={handleUploadImages} />

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
            disabled={isSaving}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}