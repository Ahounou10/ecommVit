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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 font-medium">Produit introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Modifier le produit
          </h1>
          <p className="text-gray-500">Mettez à jour les détails et les images du produit</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">

            {/* IMAGES */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100">
              <label className="block font-bold text-lg mb-4 text-gray-900">
                Images du produit
              </label>

              <label className="block mb-6 p-8 border-2 border-dashed border-amber-300 rounded-2xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadImages}
                  className="hidden"
                />
                <p className="text-amber-700 font-semibold">+ Ajouter des images</p>
                <p className="text-sm text-gray-500 mt-1">Cliquez ou déposez des fichiers</p>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-amber-400 transition-all duration-300 group"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* NOM */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
              <label className="block font-bold mb-3 text-gray-900">
                Nom du produit
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-gray-900 font-medium"
                placeholder="Entrez le nom du produit"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
              <label className="block font-bold mb-3 text-gray-900">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-gray-900 font-medium resize-none"
                placeholder="Décrivez le produit"
              />
            </div>

            {/* PRIX & STOCK */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
                <label className="block font-bold mb-3 text-gray-900 text-sm">
                  Prix (DH)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-gray-900 font-bold text-lg"
                  placeholder="0"
                />
              </div>

              <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
                <label className="block font-bold mb-3 text-gray-900 text-sm">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-gray-900 font-bold text-lg"
                  placeholder="0"
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                isSaving ? 'opacity-75 scale-100' : ''
              }`}
            >
              {isSaving
                ? '⟳ Sauvegarde en cours...'
                : '✓ Enregistrer les modifications'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}