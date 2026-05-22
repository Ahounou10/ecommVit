'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, SUBCATEGORIES } from '@/lib/constants';

export interface FilterState {
  search: string;
  category: string | null;
  subcategory: string | null;
  priceRange: [number, number];
  sizes: string[];
  colors: string[]; // ✅ AJOUT COULEURS
}

interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

export default function FilterPanel({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: null,
    subcategory: null,
    priceRange: [0, 500000],
    sizes: [],
    colors: [], // ✅ AJOUT
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
      colors: [], // ✅ AJOUT
    };

    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const activeFilters = [
    filters.category,
    filters.subcategory,
    filters.sizes.length > 0 && `${filters.sizes.length} tailles`,
    filters.colors.length > 0 && `${filters.colors.length} couleurs`, // ✅ AJOUT
  ].filter(Boolean).length;

  const COLORS = ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert'];

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-6"
      >
        <Search className="w-4 h-4" />
        Filtrer {activeFilters > 0 && `(${activeFilters})`}
      </button>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* PANEL */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full md:h-auto w-80 md:w-64
          bg-white z-50 md:z-auto
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 h-full overflow-y-auto relative">

          {/* CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold mb-6">Filtres</h2>

          {/* SEARCH */}
          <div className="mb-6">
            <label className="text-sm font-medium">Rechercher</label>

            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

              <input
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                value={filters.search}
                onChange={(e) =>
                  handleFilterChange({ search: e.target.value })
                }
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Catégorie</h3>

            {Object.entries(CATEGORIES).map(([key, label]) => (
              <label key={key} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === key}
                  onChange={() =>
                    handleFilterChange({ category: key })
                  }
                />
                <span className="ml-2 text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* SUBCATEGORY */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Type</h3>

            {Object.entries(SUBCATEGORIES).map(([key, label]) => (
              <label key={key} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.subcategory === key}
                  onChange={(e) =>
                    handleFilterChange({
                      subcategory: e.target.checked ? key : null,
                    })
                  }
                />
                <span className="ml-2 text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Prix</h3>

            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [0, Number(e.target.value)],
                })
              }
              className="w-full"
            />

            <div className="text-sm mt-2">
              Jusqu’à {filters.priceRange[1].toLocaleString()} FCFA
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Tailles</h3>

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

          {/* COLORS ✅ AJOUTÉ */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Couleurs</h3>

            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    const updated = filters.colors.includes(color)
                      ? filters.colors.filter((c) => c !== color)
                      : [...filters.colors, color];

                    handleFilterChange({ colors: updated });
                  }}
                  className={`py-2 border rounded text-sm ${
                    filters.colors.includes(color)
                      ? 'bg-black text-white'
                      : ''
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* RESET */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 py-2 rounded"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </>
  );
}