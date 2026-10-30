import React from 'react';
import { CATEGORIES } from '../data/frenchDataset';
import { CategoryId, ItemLevel, ItemType } from '../types';
import { Search, Filter, Bookmark, Sparkles } from 'lucide-react';

interface ItemSelectorBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedLevel: 'all' | ItemLevel;
  onSelectLevel: (lvl: 'all' | ItemLevel) => void;
  selectedType: 'all' | ItemType;
  onSelectType: (type: 'all' | ItemType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalFilteredCount: number;
}

export const ItemSelectorBar: React.FC<ItemSelectorBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  totalFilteredCount,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
      
      {/* Category Pills (Functional filter buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un mot, un accent, une phrase..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

        {/* Level and Type Selectors */}
        <div className="flex items-center gap-2 text-xs">
          {/* Level Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-slate-600 dark:text-slate-300">
            {(['all', 'debutant', 'intermediaire', 'avance'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-2 py-1 rounded-md capitalize font-medium transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'Niveaux' : lvl}
              </button>
            ))}
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-slate-600 dark:text-slate-300">
            {(['all', 'mot', 'phrase'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onSelectType(t)}
                className={`px-2 py-1 rounded-md capitalize font-medium transition-colors ${
                  selectedType === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t === 'all' ? 'Tous' : t === 'mot' ? 'Mots' : 'Phrases'}
              </button>
            ))}
          </div>

          {/* Results count (clean unboxed text) */}
          <span className="text-xs text-slate-500 dark:text-slate-400 pl-2">
            {totalFilteredCount} {totalFilteredCount > 1 ? 'éléments' : 'élément'}
          </span>
        </div>
      </div>
    </div>
  );
};
