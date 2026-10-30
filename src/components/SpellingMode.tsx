import React, { useState, useEffect, useRef } from 'react';
import { FrenchItem, LetterSpelling, SpeechSettings } from '../types';
import {
  decomposeFrenchSpelling,
  speakLetterSpelling,
  speakFrenchText,
  stopSpeech,
} from '../utils/frenchSpelling';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
} from 'lucide-react';

interface SpellingModeProps {
  item: FrenchItem;
  speechSettings: SpeechSettings;
  onGoToDictation: () => void;
}

export const SpellingMode: React.FC<SpellingModeProps> = ({
  item,
  speechSettings,
  onGoToDictation,
}) => {
  const letters: LetterSpelling[] = decomposeFrenchSpelling(item.text);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoSpelling, setIsAutoSpelling] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(0.9); // Rate for speech
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Stop auto spelling helper
  const stopAutoSpelling = () => {
    isPlayingRef.current = false;
    setIsAutoSpelling(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopSpeech();
  };

  // Reset when item changes
  useEffect(() => {
    stopAutoSpelling();
    setActiveIndex(0);
  }, [item.id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAutoSpelling();
    };
  }, []);

  const speakSingleLetterByIndex = (index: number, onDone?: () => void) => {
    const target = letters[index];
    if (!target) {
      onDone?.();
      return;
    }

    if (target.isSpace) {
      timerRef.current = window.setTimeout(() => {
        onDone?.();
      }, 350);
      return;
    }

    speakLetterSpelling(target, {
      rate: speedMultiplier,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => {
        onDone?.();
      },
    });
  };

  const handleSelectLetter = (index: number) => {
    stopAutoSpelling();
    setActiveIndex(index);
    speakSingleLetterByIndex(index);
  };

  const handleStartAutoSpelling = () => {
    if (isAutoSpelling) {
      stopAutoSpelling();
      return;
    }

    // Set ref immediately so step function doesn't abort
    isPlayingRef.current = true;
    setIsAutoSpelling(true);

    const startIndex = activeIndex >= letters.length - 1 ? 0 : activeIndex;
    setActiveIndex(startIndex);

    const step = (idx: number) => {
      if (!isPlayingRef.current) return;
      if (idx >= letters.length) {
        stopAutoSpelling();
        return;
      }

      setActiveIndex(idx);
      speakSingleLetterByIndex(idx, () => {
        if (!isPlayingRef.current) return;
        // Pause between letters based on speed
        const pauseMs = speedMultiplier <= 0.7 ? 500 : 320;
        timerRef.current = window.setTimeout(() => {
          if (isPlayingRef.current) {
            step(idx + 1);
          }
        }, pauseMs);
      });
    };

    // Begin speaking the start index immediately
    step(startIndex);
  };

  const handleStepPrev = () => {
    stopAutoSpelling();
    const prev = Math.max(0, activeIndex - 1);
    setActiveIndex(prev);
    speakSingleLetterByIndex(prev);
  };

  const handleStepNext = () => {
    stopAutoSpelling();
    const next = Math.min(letters.length - 1, activeIndex + 1);
    setActiveIndex(next);
    speakSingleLetterByIndex(next);
  };

  const handleReplayActive = () => {
    stopAutoSpelling();
    speakSingleLetterByIndex(activeIndex);
  };

  const handlePronounceWhole = () => {
    stopAutoSpelling();
    speakFrenchText(item.text, {
      rate: speechSettings.rate,
      voiceURI: speechSettings.voiceURI,
    });
  };

  const currentLetter = letters[activeIndex] || letters[0];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Épellation de « {item.text} »
          </span>
          <span aria-hidden="true">·</span>
          <span>{letters.filter((l) => !l.isSpace).length} lettres</span>
        </div>

        <button
          onClick={handlePronounceWhole}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Écouter le mot complet</span>
        </button>
      </div>

      {/* Interactive Letter Ribbon */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center">
          Cliquez sur une lettre pour l'écouter ou lancez l'épellation continue
        </p>

        {/* Letter Cards Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mb-8">
          {letters.map((letter, idx) => {
            const isActive = activeIndex === idx;

            if (letter.isSpace) {
              return (
                <div
                  key={`space-${idx}`}
                  className="w-5 h-12 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs font-mono"
                  title="Espace"
                >
                  ␣
                </div>
              );
            }

            return (
              <button
                key={`${letter.char}-${idx}`}
                type="button"
                onClick={() => handleSelectLetter(idx)}
                className={`relative min-w-10 sm:min-w-12 h-14 sm:h-16 px-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-110 z-10 ring-2 ring-blue-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
                title={`Lettre : ${letter.spokenName}`}
              >
                <span className="text-2xl sm:text-3xl font-display font-bold leading-none">
                  {letter.char}
                </span>

                {letter.isDiacritic && (
                  <span
                    className={`text-[9px] uppercase font-semibold mt-1 leading-none ${
                      isActive ? 'text-blue-100' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    accent
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleStepPrev}
            disabled={activeIndex === 0}
            className="p-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Lettre précédente"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartAutoSpelling}
            className={`flex-1 py-3 px-6 font-semibold rounded-xl text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              isAutoSpelling
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isAutoSpelling ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Épeler en continu</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplayActive}
            className="p-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            title="Répéter la lettre courante"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStepNext}
            disabled={activeIndex === letters.length - 1}
            className="p-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Lettre suivante"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Cadence :</span>
          <button
            onClick={() => setSpeedMultiplier(0.65)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              speedMultiplier === 0.65
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Lente
          </button>
          <button
            onClick={() => setSpeedMultiplier(0.9)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              speedMultiplier === 0.9
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Normale
          </button>
          <button
            onClick={() => setSpeedMultiplier(1.15)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              speedMultiplier === 1.15
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Rapide
          </button>
        </div>
      </div>

      {/* Focus Letter Detail Inspector */}
      {currentLetter && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-display text-4xl sm:text-5xl font-bold shadow-md shadow-blue-500/20 shrink-0">
            {currentLetter.char === ' ' ? '␣' : currentLetter.char}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider mb-1">
              Prononciation officielle de cette lettre
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
              « {currentLetter.spokenName} »
            </div>

            {currentLetter.displayHint && (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Spécificité : <span className="font-medium">{currentLetter.displayHint}</span>
              </div>
            )}

            {currentLetter.isPunctuation && (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Signe de ponctuation ou symbole orthographique
              </div>
            )}
          </div>

          <button
            onClick={handleReplayActive}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Réécouter la lettre</span>
          </button>
        </div>
      )}

      {/* Transition to dictation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onGoToDictation}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
        >
          <span>Prêt pour le test ? Passer à la dictée</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
