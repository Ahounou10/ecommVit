'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, SUBCATEGORIES } from '@/lib/constants';

interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string | null;
  subcategory: string | null;
  priceRange: [number, number];
  sizes: string[];
}

export default function FilterPanel({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: null,
    subcategory: null,
    priceRange: [0, 500000],
    sizes: [],
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      search: '',
      category: null,
      subcategory: null,
      priceRange: [0, 500000],
      sizes: [],
    };

    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const activeFilters = [
    filters.category,
    filters.subcategory,
    filters.sizes.length > 0 && `${filters.sizes.length} tailles`,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-6"
      >
        <Search className="w-4 h-4" />
        Filtrer {activeFilters > 0 && `(${activeFilters})`}
      </button>

      {/* Panel */}
      <div
        className={`fixed md:relative inset-0 md:inset-auto bg-white md:bg-transparent z-40 md:z-0 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="w-64 h-screen md:h-auto bg-white p-6 overflow-y-auto relative">

          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Filtres
          </h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Rechercher
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Nom du produit..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                value={filters.search}
                onChange={(e) =>
                  handleFilterChange({ search: e.target.value })
                }
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">
              Catégorie
            </h3>

            <div className="space-y-2">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === key}
                    onChange={() =>
                      handleFilterChange({ category: key })
                    }
                  />
                  <span className="ml-3 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">
              Type
            </h3>

            <div className="space-y-2">
              {Object.entries(SUBCATEGORIES).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.subcategory === key}
                    onChange={(e) =>
                      handleFilterChange({
                        subcategory: e.target.checked ? key : null,
                      })
                    }
                  />
                  <span className="ml-3 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">
              Prix
            </h3>

            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [
                    0,
                    Number(e.target.value),
                  ],
                })
              }
              className="w-full"
            />

            <div className="text-sm mt-2">
              Jusqu’à {filters.priceRange[1].toLocaleString()} FCFA
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">
              Tailles
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const updated = filters.sizes.includes(size)
                      ? filters.sizes.filter((s) => s !== size)
                      : [...filters.sizes, size];

                    handleFilterChange({ sizes: updated });
                  }}
                  className={`py-2 border rounded text-sm ${
                    filters.sizes.includes(size)
                      ? 'bg-emerald-600 text-white'
                      : ''
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 py-2 rounded"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}