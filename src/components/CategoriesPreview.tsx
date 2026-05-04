'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export default function CategoriesPreview() {
  const categories: CategoryItem[] = [
    { id: 'homme', name: 'Pour Homme', emoji: '👔', description: 'T-shirts, jeans, chemises' },
    { id: 'femme', name: 'Pour Femme', emoji: '👗', description: 'Robes, chemises, accessoires' },
    { id: 'mixte', name: 'Mixte', emoji: '👕', description: 'Pièces unisexe tendance' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Catégories
          </h2>
          <p className="text-lg text-gray-600">
            Trouvez exactement ce que vous cherchez
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300"
            >
              <div className="text-5xl mb-4">{cat.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
              
              <div className="inline-flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                Découvrir
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>

              {/* Hover effect background */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
