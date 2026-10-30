import React, { useState } from 'react';
import { FrenchItem, SpeechSettings } from '../types';
import { speakFrenchText, stopSpeech } from '../utils/frenchSpelling';
import { AudioWave } from './AudioWave';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ListenModeProps {
  item: FrenchItem;
  speechSettings: SpeechSettings;
  onUpdateSpeechSettings: (settings: Partial<SpeechSettings>) => void;
  onGoToSpelling: () => void;
  onGoToDictation: () => void;
  onToggleFavorite: (id: string) => void;
  onNextItem: () => void;
  onPrevItem: () => void;
  onRecordListened?: (id: string) => void;
}

export const ListenMode: React.FC<ListenModeProps> = ({
  item,
  speechSettings,
  onUpdateSpeechSettings,
  onGoToSpelling,
  onGoToDictation,
  onToggleFavorite,
  onNextItem,
  onPrevItem,
  onRecordListened,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const handlePlayFull = (rateMultiplier: number = 1.0) => {
    setIsPlaying(true);
    setActiveWordIndex(null);
    onRecordListened?.(item.id);
    speakFrenchText(item.text, {
      rate: speechSettings.rate * rateMultiplier,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handlePlaySingleWord = (word: string, index: number) => {
    // Clean punctuation from word for speech
    const cleanWord = word.replace(/[.,?!:;«»()]/g, '');
    setIsPlaying(true);
    setActiveWordIndex(index);
    speakFrenchText(cleanWord, {
      rate: speechSettings.rate * 0.85,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => {
        setIsPlaying(false);
        setActiveWordIndex(null);
      },
      onError: () => {
        setIsPlaying(false);
        setActiveWordIndex(null);
      },
    });
  };

  const words = item.text.split(' ');

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Navigation header between items */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="capitalize font-semibold text-slate-700 dark:text-slate-200">
            {item.type === 'mot' ? 'Mot' : 'Phrase'}
          </span>
          <span aria-hidden="true">·</span>
          <span>Niveau {item.level}</span>
          {item.isCustom && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Ajouté par vous</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="p-1.5 text-slate-500 hover:text-amber-500 transition-colors rounded-md"
            title={item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {item.isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onPrevItem}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextItem}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Pronunciation Card */}
      <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Visualizer header */}
        <div className="mb-6 flex items-center justify-center">
          <AudioWave isPlaying={isPlaying} />
        </div>

        {/* Text Display with word-by-word interactive clicks */}
        <div className="mb-4 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 max-w-2xl">
          {words.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => handlePlaySingleWord(word, idx)}
              className={`text-3xl sm:text-4xl md:text-5xl font-display font-bold transition-all px-1.5 py-0.5 rounded-lg cursor-pointer ${
                activeWordIndex === idx
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 scale-105'
                  : 'text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
              }`}
              title="Cliquez pour écouter ce mot seul"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Phonetics and translation */}
        {item.phonetic && (
          <div className="text-base sm:text-lg font-mono text-slate-500 dark:text-slate-400 mb-2">
            {item.phonetic}
          </div>
        )}

        {item.translation && (
          <div className="text-sm text-slate-600 dark:text-slate-300 italic mb-6">
            « {item.translation} »
          </div>
        )}

        {/* Audio Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handlePlayFull(1.0)}
            className="flex-1 min-w-[160px] py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Écouter (1x)</span>
          </button>

          <button
            onClick={() => handlePlayFull(0.7)}
            className="py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            title="Écouter à vitesse ralentie (0.7x)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ralenti (0.7x)</span>
          </button>

          <button
            onClick={() => handlePlayFull(0.5)}
            className="py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            title="Écouter très lentement (0.5x)"
          >
            <span>0.5x</span>
          </button>
        </div>
      </div>

      {/* Orthographic / Grammatical Tip */}
      {item.note && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
              Astuce orthographique :
            </span>
            {item.note}
          </div>
        </div>
      )}

      {/* Quick Action Cards to Next Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onGoToSpelling}
          className="p-5 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all shadow-2xs group flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              Étape suivante
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-base">
              Épeler ce mot lettre par lettre
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Décomposition sonore avec identification des accents
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
        </button>

        <button
          onClick={onGoToDictation}
          className="p-5 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all shadow-2xs group flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Test d'écoute
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-base">
              Faire la dictée interactive
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Écoutez sans voir le mot et vérifiez votre saisie
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
        </button>
      </div>
    </div>
  );
};
