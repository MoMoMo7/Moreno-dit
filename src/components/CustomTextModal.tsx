import React, { useState } from 'react';
import { FrenchItem, ItemLevel } from '../types';
import { X, Sparkles, Plus, Volume2 } from 'lucide-react';
import { speakFrenchText } from '../utils/frenchSpelling';
import { AccentKeyboard } from './AccentKeyboard';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: FrenchItem) => void;
  voiceURI?: string | null;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  voiceURI,
}) => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [note, setNote] = useState('');
  const [level, setLevel] = useState<ItemLevel>('debutant');

  if (!isOpen) return null;

  const handleTestAudio = () => {
    if (!text.trim()) return;
    speakFrenchText(text.trim(), { voiceURI });
  };

  const handleInsertChar = (char: string) => {
    setText((prev) => prev + char);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const trimmed = text.trim();
    const isPhrase = trimmed.includes(' ') || trimmed.length > 25;

    const newItem: FrenchItem = {
      id: `custom-${Date.now()}`,
      text: trimmed,
      translation: translation.trim() || undefined,
      note: note.trim() || undefined,
      level,
      type: isPhrase ? 'phrase' : 'mot',
      category: 'personnalises',
      isCustom: true,
      isFavorite: true,
    };

    onAddItem(newItem);
    setText('');
    setTranslation('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ajouter un mot ou une phrase
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Écoutez et épelez instantanément n'importe quel texte
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mot ou phrase en français *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex. château, oiseau, Bonjour comment allez-vous..."
                className="flex-1 py-2.5 px-3.5 text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleTestAudio}
                disabled={!text.trim()}
                className="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Tester l'audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Accent Helper inside modal */}
          <div>
            <AccentKeyboard onInsertChar={handleInsertChar} voiceURI={voiceURI} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Sens ou traduction (facultatif)
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Ex. castle, Définition..."
              className="w-full py-2 px-3 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Astuce orthographique ou mnémonique (facultatif)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex. Accent circonflexe sur le a..."
              className="w-full py-2 px-3 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Niveau de difficulté
            </label>
            <div className="flex gap-2">
              {(['debutant', 'intermediaire', 'avance'] as ItemLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors border ${
                    level === lvl
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Ajouter et écouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
