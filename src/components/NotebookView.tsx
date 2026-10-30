import React from 'react';
import { FrenchItem, SpeechSettings } from '../types';
import { Volume2, SpellCheck, Trash2, BookmarkCheck, Plus, ArrowRight } from 'lucide-react';
import { speakFrenchText } from '../utils/frenchSpelling';

interface NotebookViewProps {
  items: FrenchItem[];
  speechSettings: SpeechSettings;
  onSelectItem: (item: FrenchItem) => void;
  onRemoveCustomItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
  onGoToSpelling: (item: FrenchItem) => void;
  onGoToDictation: (item: FrenchItem) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  items,
  speechSettings,
  onSelectItem,
  onRemoveCustomItem,
  onToggleFavorite,
  onOpenAddModal,
  onGoToSpelling,
  onGoToDictation,
}) => {
  const favoriteItems = items.filter((i) => i.isFavorite || i.isCustom);

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakFrenchText(text, {
      rate: speechSettings.rate,
      voiceURI: speechSettings.voiceURI,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Mon Carnet de Vocabulaire
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Retrouvez tous vos mots favoris et ceux que vous avez ajoutés personnellement.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un mot personnalisé</span>
        </button>
      </div>

      {/* Items list */}
      {favoriteItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookmarkCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Votre carnet est vide pour le moment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            Ajoutez n'importe quel mot ou phrase avec le bouton ci-dessous ou cliquez sur l'icône de marque-page dans la bibliothèque.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Ajouter un premier mot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {favoriteItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="p-4 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.text}
                  </span>
                  {item.phonetic && (
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      {item.phonetic}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="capitalize">{item.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.level}</span>
                  {item.translation && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="italic">« {item.translation} »</span>
                    </>
                  )}
                </div>

                {item.note && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                    {item.note}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleSpeak(item.text, e)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Écouter la prononciation"
                >
                  <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToSpelling(item);
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                  title="Épeler"
                >
                  Épeler
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToDictation(item);
                  }}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
                  title="Dictée"
                >
                  Dictée
                </button>

                {item.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomItem(item.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Supprimer ce mot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
