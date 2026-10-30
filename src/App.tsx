/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, CategoryId, FrenchItem, ItemLevel, ItemType, SpeechSettings, UserProgress, ProgressEvent } from './types';
import { INITIAL_FRENCH_ITEMS, CATEGORIES } from './data/frenchDataset';
import { getFrenchVoices, stopSpeech } from './utils/frenchSpelling';
import { Header } from './components/Header';
import { ListenMode } from './components/ListenMode';
import { SpellingMode } from './components/SpellingMode';
import { DictationMode } from './components/DictationMode';
import { NotebookView } from './components/NotebookView';
import { StatsView } from './components/StatsView';
import { ItemSelectorBar } from './components/ItemSelectorBar';
import { CustomTextModal } from './components/CustomTextModal';
import { AchievementCard } from './components/AchievementCard';
import { Volume2, SpellCheck, PenLine, Bookmark, Sparkles, ChevronRight, Check } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'epelle_moi_french_items_v1';
const PROGRESS_STORAGE_KEY = 'epelle_moi_user_progress_v1';
const THEME_KEY = 'epelle_moi_theme';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Speech settings
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    rate: 0.9,
    pitch: 1.0,
    voiceURI: null,
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = getFrenchVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !speechSettings.voiceURI) {
        // Prefer French France or first French
        const best = voices.find((v) => v.lang.toLowerCase() === 'fr-fr') || voices[0];
        setSpeechSettings((prev) => ({ ...prev, voiceURI: best.voiceURI }));
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Items State (default dataset + local storage custom items)
  const [items, setItems] = useState<FrenchItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed: FrenchItem[] = JSON.parse(stored);
          // Merge defaults with custom/favorite flags
          const customOnly = parsed.filter((p) => p.isCustom);
          const favMap = new Map(parsed.map((p) => [p.id, p.isFavorite]));

          const mergedDefaults = INITIAL_FRENCH_ITEMS.map((item) => ({
            ...item,
            isFavorite: favMap.has(item.id) ? !!favMap.get(item.id) : false,
          }));

          return [...mergedDefaults, ...customOnly];
        }
      } catch (e) {
        console.error('Failed to load items from localStorage', e);
      }
    }
    return INITIAL_FRENCH_ITEMS;
  });

  // Save to localStorage when items update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items', e);
    }
  }, [items]);

  // User Progress for Gamification Badges
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            listenedIds: parsed.listenedIds || [],
            spelledCorrectIds: parsed.spelledCorrectIds || [],
            history: parsed.history || [],
          };
        }
      } catch (e) {
        console.error('Failed to load user progress', e);
      }
    }
    return {
      listenedIds: [],
      spelledCorrectIds: [],
      history: [],
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [userProgress]);

  const handleRecordListened = (id: string) => {
    const item = items.find((i) => i.id === id);
    const newEvent: ProgressEvent = {
      itemId: id,
      category: item?.category || 'quotidien',
      action: 'listen',
      timestamp: Date.now(),
    };

    setUserProgress((prev) => {
      const alreadyListened = prev.listenedIds.includes(id);
      return {
        ...prev,
        listenedIds: alreadyListened ? prev.listenedIds : [...prev.listenedIds, id],
        history: [...(prev.history || []), newEvent],
      };
    });
  };

  const handleRecordSpelledCorrect = (id: string) => {
    const item = items.find((i) => i.id === id);
    const newEvent: ProgressEvent = {
      itemId: id,
      category: item?.category || 'quotidien',
      action: 'spell_correct',
      timestamp: Date.now(),
    };

    setUserProgress((prev) => {
      const alreadySpelled = prev.spelledCorrectIds.includes(id);
      return {
        ...prev,
        spelledCorrectIds: alreadySpelled ? prev.spelledCorrectIds : [...prev.spelledCorrectIds, id],
        history: [...(prev.history || []), newEvent],
      };
    });
  };

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<ActiveTab>('ecoute');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('tous');
  const [selectedLevel, setSelectedLevel] = useState<'all' | ItemLevel>('all');
  const [selectedType, setSelectedType] = useState<'all' | ItemType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Active selected item
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || 'alpha-1');

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory === 'personnalises' && !item.isCustom && !item.isFavorite) {
        return false;
      } else if (
        selectedCategory !== 'tous' &&
        selectedCategory !== 'personnalises' &&
        item.category !== selectedCategory
      ) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchText = item.text.toLowerCase().includes(q);
        const matchTrans = item.translation?.toLowerCase().includes(q);
        const matchNote = item.note?.toLowerCase().includes(q);
        return matchText || matchTrans || matchNote;
      }

      return true;
    });
  }, [items, selectedCategory, selectedLevel, selectedType, searchQuery]);

  // Keep selected item valid
  const currentItem = useMemo(() => {
    const found = items.find((i) => i.id === selectedItemId);
    return found || filteredItems[0] || items[0];
  }, [items, selectedItemId, filteredItems]);

  const currentIndexInFiltered = filteredItems.findIndex((i) => i.id === currentItem.id);

  const handleNextItem = () => {
    stopSpeech();
    if (filteredItems.length === 0) return;
    const nextIdx = (currentIndexInFiltered + 1) % filteredItems.length;
    setSelectedItemId(filteredItems[nextIdx].id);
  };

  const handlePrevItem = () => {
    stopSpeech();
    if (filteredItems.length === 0) return;
    const prevIdx =
      (currentIndexInFiltered - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItemId(filteredItems[prevIdx].id);
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleAddCustomItem = (newItem: FrenchItem) => {
    setItems((prev) => [newItem, ...prev]);
    setSelectedItemId(newItem.id);
    setSelectedCategory('personnalises');
    setActiveTab('ecoute');
  };

  const handleRemoveCustomItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(items[0]?.id || 'alpha-1');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          stopSpeech();
          setActiveTab(tab);
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Voice Bar (Subtle audio settings bar below header) */}
      {availableVoices.length > 1 && (
        <div className="bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 py-1.5 px-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Voix française détectée :</span>
              <select
                value={speechSettings.voiceURI || ''}
                onChange={(e) =>
                  setSpeechSettings((prev) => ({ ...prev, voiceURI: e.target.value }))
                }
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-500">
              <span>Raccourcis : Utilisez la barre d'espace ou Entrée pour réécouter</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Explorer Library (Hidden on 'carnet' & 'statistiques' tabs for full focus) */}
        {activeTab !== 'carnet' && activeTab !== 'statistiques' && (
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            {/* Badges de réussite au-dessus de la liste d'entraînement */}
            <AchievementCard progress={userProgress} />

            {/* Filter and Search Bar */}
            <ItemSelectorBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              selectedLevel={selectedLevel}
              onSelectLevel={(lvl) => setSelectedLevel(lvl)}
              selectedType={selectedType}
              onSelectType={(t) => setSelectedType(t)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              totalFilteredCount={filteredItems.length}
            />

            {/* List of items */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[580px] shadow-2xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Liste d'entraînement ({filteredItems.length})</span>
                <span className="text-slate-400 font-normal">Cliquez pour charger</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    Aucun résultat trouvé pour votre recherche.
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isSelected = item.id === currentItem.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          stopSpeech();
                          setSelectedItemId(item.id);
                        }}
                        className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-l-4 border-l-blue-600'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm truncate">
                              {item.text}
                            </span>
                            {item.isFavorite && (
                              <span className="text-amber-500 text-xs" title="Favori">
                                ★
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="capitalize">{item.level}</span>
                            {item.phonetic && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono">{item.phonetic}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Right Column: Active Interactive Workspace */}
        <section className="flex-1 flex flex-col justify-start">
          {activeTab === 'ecoute' && currentItem && (
            <ListenMode
              item={currentItem}
              speechSettings={speechSettings}
              onUpdateSpeechSettings={(newSettings) =>
                setSpeechSettings((prev) => ({ ...prev, ...newSettings }))
              }
              onGoToSpelling={() => setActiveTab('epellation')}
              onGoToDictation={() => setActiveTab('dictee')}
              onToggleFavorite={handleToggleFavorite}
              onNextItem={handleNextItem}
              onPrevItem={handlePrevItem}
              onRecordListened={handleRecordListened}
            />
          )}

          {activeTab === 'epellation' && currentItem && (
            <SpellingMode
              item={currentItem}
              speechSettings={speechSettings}
              onGoToDictation={() => setActiveTab('dictee')}
            />
          )}

          {activeTab === 'dictee' && currentItem && (
            <DictationMode
              item={currentItem}
              speechSettings={speechSettings}
              onNextItem={handleNextItem}
              onGoToSpelling={() => setActiveTab('epellation')}
              onRecordSpelledCorrect={handleRecordSpelledCorrect}
            />
          )}

          {activeTab === 'carnet' && (
            <NotebookView
              items={items}
              speechSettings={speechSettings}
              onSelectItem={(item) => {
                setSelectedItemId(item.id);
                setActiveTab('ecoute');
              }}
              onRemoveCustomItem={handleRemoveCustomItem}
              onToggleFavorite={handleToggleFavorite}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onGoToSpelling={(item) => {
                setSelectedItemId(item.id);
                setActiveTab('epellation');
              }}
              onGoToDictation={(item) => {
                setSelectedItemId(item.id);
                setActiveTab('dictee');
              }}
            />
          )}

          {activeTab === 'statistiques' && (
            <StatsView
              progress={userProgress}
              items={items}
            />
          )}
        </section>

      </main>

      {/* Custom Word / Phrase Modal */}
      <CustomTextModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddCustomItem}
        voiceURI={speechSettings.voiceURI}
      />
    </div>
  );
}
