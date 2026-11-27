import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
}

export default function CategoriesPreview() {
  const categories: CategoryItem[] = [
    { id: 'homme', name: 'Homme', description: 'T-shirts, jeans et chemises' },
    { id: 'femme', name: 'Femme', description: 'Robes, chemises et accessoires' },
    { id: 'mixte', name: 'Mixte', description: 'Des pièces à porter au quotidien' },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Explorer
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              Nos catégories
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-600">
            Retrouvez rapidement les articles selon vos envies.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/boutique?category=${category.id}`}
              className="group flex min-h-44 flex-col justify-between border border-gray-200 bg-[#fafaf9] p-6 hover:border-gray-400 hover:bg-white"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-950">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{category.description}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
                Découvrir
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
