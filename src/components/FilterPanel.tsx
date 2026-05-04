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
    const cleared = {
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

      {/* Filter Panel */}
      <div
        className={`fixed md:relative inset-0 md:inset-auto bg-white md:bg-transparent z-40 md:z-0 transform md:transform-none transition-transform md:transition-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="w-64 h-screen md:h-auto bg-white md:bg-transparent p-6 md:p-0 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-gray-900 mb-6 md:mb-4">Filtres</h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nom du produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Catégorie</h3>
            <div className="space-y-2">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === key}
                    onChange={() => handleFilterChange({ category: key })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Type</h3>
            <div className="space-y-2">
              {Object.entries(SUBCATEGORIES).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.subcategory === key}
                    onChange={(e) =>
                      handleFilterChange({ subcategory: e.target.checked ? key : null })
                    }
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Prix</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange({ priceRange: [0, parseInt(e.target.value)] })
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                Jusqu'à {filters.priceRange[1].toLocaleString()} FCFA
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tailles</h3>
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
                  className={`py-2 px-3 rounded border text-sm font-medium transition-colors ${
                    filters.sizes.includes(size)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
