import React from 'react';
import { ActiveTab } from '../types';
import { Volume2, Moon, Sun, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark with official logo */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <img
            src="/assets/aistudio/Capture_d__cran_2026-09-02_155535_9c4cb97e.png"
            alt="Logo Moreno dit..."
            className="w-10 h-10 object-contain rounded-xl p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
          />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Moreno dit...
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onTabChange('ecoute')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'ecoute'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Écoute & Prononciation
          </button>

          <button
            onClick={() => onTabChange('epellation')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'epellation'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Épellation Guidée
          </button>

          <button
            onClick={() => onTabChange('dictee')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'dictee'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Dictée Interactive
          </button>

          <button
            onClick={() => onTabChange('carnet')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'carnet'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Mon Carnet
          </button>

          <button
            onClick={() => onTabChange('statistiques')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'statistiques'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Statistiques
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap"
            title="Ajouter un mot ou une phrase"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau mot</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            aria-label="Basculer le thème"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          onClick={() => onTabChange('ecoute')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'ecoute'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Écoute
        </button>
        <button
          onClick={() => onTabChange('epellation')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'epellation'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Épellation
        </button>
        <button
          onClick={() => onTabChange('dictee')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'dictee'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Dictée
        </button>
        <button
          onClick={() => onTabChange('carnet')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'carnet'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Carnet
        </button>
        <button
          onClick={() => onTabChange('statistiques')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'statistiques'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Stats
        </button>
      </div>
    </header>
  );
};
