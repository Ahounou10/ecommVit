'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/supabase/client';
import type { Product } from '@/types';

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

  // FORM STATES
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  // IMAGES
  const [images, setImages] = useState<string[]>([]);

  // FETCH PRODUIT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);
          setProduct(null);
          return;
        }

        setProduct(data);

        // remplir formulaire
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(data.price || 0);
        setStock(data.stock || 0);

        // images
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
        } else if (data.image_url) {
          setImages([data.image_url]);
        }

      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // UPLOAD IMAGE
  const handleUploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (error) {
          console.error(error);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE IMAGE
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // SAVE
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('products')
        .update({
          name,
          description,
          price,
          stock,
          image_url: images[0] || null,
          images,
        })
        .eq('id', id);

      if (error) {
        console.error(error);
        alert('Erreur sauvegarde');
        return;
      }

      alert('Produit mis à jour avec succès');

    } catch (err) {
      console.error(err);
      alert('Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Produit introuvable
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Modifier le produit
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT */}
        <div>

          {/* IMAGES */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">
              Images produit
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUploadImages}
              className="mb-4"
            />

            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* NOM */}
          <div>
            <label className="block font-semibold mb-2">
              Nom
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* PRIX */}
          <div>
            <label className="block font-semibold mb-2">
              Prix
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block font-semibold mb-2">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* SAVE */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {isSaving
              ? 'Sauvegarde...'
              : 'Enregistrer les modifications'}
          </button>

        </div>
      </div>
    </div>
  );
}