import React, { useState, useEffect, useRef } from 'react';
import { FrenchItem, SpeechSettings } from '../types';
import { speakFrenchText, speakLetterSpelling, decomposeFrenchSpelling, stopSpeech } from '../utils/frenchSpelling';
import { AccentKeyboard } from './AccentKeyboard';
import { AudioWave } from './AudioWave';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Eye,
  ArrowRight,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

interface DictationModeProps {
  item: FrenchItem;
  speechSettings: SpeechSettings;
  onNextItem: () => void;
  onGoToSpelling: () => void;
  onRecordSpelledCorrect?: (id: string) => void;
}

interface LetterComparison {
  targetChar: string;
  userChar: string | null;
  status: 'correct' | 'wrong-accent' | 'incorrect' | 'missing';
  explanation?: string;
}

export const DictationMode: React.FC<DictationModeProps> = ({
  item,
  speechSettings,
  onNextItem,
  onGoToSpelling,
  onRecordSpelledCorrect,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [revealedCharsCount, setRevealedCharsCount] = useState<number>(0);
  const [comparisons, setComparisons] = useState<LetterComparison[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Play audio on item change
  useEffect(() => {
    stopSpeech();
    setUserInput('');
    setIsSubmitted(false);
    setIsSuccess(false);
    setRevealedCharsCount(0);
    setComparisons([]);

    // Automatically trigger initial speech after brief delay so user immediately hears what to spell
    const timer = setTimeout(() => {
      handlePlay(1.0);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [item.id]);

  const handlePlay = (rateMultiplier: number = 1.0) => {
    setIsPlaying(true);
    speakFrenchText(item.text, {
      rate: speechSettings.rate * rateMultiplier,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleInsertChar = (char: string) => {
    setUserInput((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Compare user input against target with accent sensitivity
  const evaluateAnswer = () => {
    const target = item.text.trim();
    const user = userInput.trim();

    // Check exact match (case insensitive comparison for first letter, but preserve accents)
    const normalizeBase = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const comp: LetterComparison[] = [];
    let allCorrect = true;

    for (let i = 0; i < target.length; i++) {
      const tChar = target[i];
      const uChar = user[i] || null;

      if (!uChar) {
        comp.push({ targetChar: tChar, userChar: null, status: 'missing' });
        allCorrect = false;
      } else if (tChar.toLowerCase() === uChar.toLowerCase()) {
        comp.push({ targetChar: tChar, userChar: uChar, status: 'correct' });
      } else if (normalizeBase(tChar).toLowerCase() === normalizeBase(uChar).toLowerCase()) {
        // Same letter base, but accent error (e.g. 'e' instead of 'é')
        comp.push({
          targetChar: tChar,
          userChar: uChar,
          status: 'wrong-accent',
          explanation: `Accent manquant ou différent sur « ${tChar} »`,
        });
        allCorrect = false;
      } else {
        comp.push({ targetChar: tChar, userChar: uChar, status: 'incorrect' });
        allCorrect = false;
      }
    }

    setComparisons(comp);
    setIsSubmitted(true);
    setIsSuccess(allCorrect);

    if (allCorrect) {
      onRecordSpelledCorrect?.(item.id);
      speakFrenchText('Bravo ! Orthographe exacte.', {
        rate: 1.0,
        voiceURI: speechSettings.voiceURI,
      });
    } else {
      speakFrenchText('Écoutez et vérifiez les lettres signalées.', {
        rate: 1.0,
        voiceURI: speechSettings.voiceURI,
      });
    }
  };

  const handleRevealFirstHint = () => {
    const target = item.text;
    const newCount = Math.min(target.length, revealedCharsCount + 2);
    setRevealedCharsCount(newCount);

    // Speak the revealed letters
    const decomp = decomposeFrenchSpelling(target.slice(0, newCount));
    decomp.forEach((d, idx) => {
      setTimeout(() => {
        speakLetterSpelling(d, { voiceURI: speechSettings.voiceURI });
      }, idx * 450);
    });
  };

  const handleRevealAll = () => {
    setUserInput(item.text);
    setRevealedCharsCount(item.text.length);
    evaluateAnswer();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      evaluateAnswer();
    }
  };

  // Build placeholder masks
  const maskedDisplay = item.text.split('').map((char, index) => {
    if (char === ' ') return ' ';
    if (index < revealedCharsCount) return char;
    return '_';
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Exercice de dictée sonore
          </span>
          <span aria-hidden="true">·</span>
          <span>{item.type === 'mot' ? 'Un mot' : 'Une phrase'}</span>
          <span aria-hidden="true">·</span>
          <span>Niveau {item.level}</span>
        </div>

        <button
          onClick={onGoToSpelling}
          className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Voir l'épellation
        </button>
      </div>

      {/* Main Dictation Card */}
      <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
        
        {/* Audio Wave and Play Button */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <AudioWave isPlaying={isPlaying} />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlay(1.0)}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Écoutez ce que Moreno dit</span>
            </button>

            <button
              onClick={() => handlePlay(0.7)}
              className="py-3 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all text-xs font-semibold"
              title="Écouter au ralenti (0.7x)"
            >
              0.7x
            </button>
          </div>
        </div>

        {/* Masked Slots Preview */}
        <div className="mb-6 font-mono tracking-widest text-xl sm:text-2xl text-slate-500 dark:text-slate-400 flex flex-wrap justify-center gap-1 select-none">
          {maskedDisplay.map((ch, idx) => (
            <span
              key={`mask-${idx}`}
              className={`inline-block min-w-5 text-center ${
                ch !== '_' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Input Field */}
        <div className="w-full max-w-lg mb-4">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 text-center">
            Écrivez ce que Moreno dit ci-dessous :
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez le mot ou la phrase..."
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full py-3.5 px-4 text-center text-lg sm:text-xl font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Virtual French Accents Keyboard */}
        <div className="w-full max-w-lg mb-6">
          <AccentKeyboard
            onInsertChar={handleInsertChar}
            voiceURI={speechSettings.voiceURI}
          />
        </div>

        {/* Action Buttons: Verify & Hints */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
          <button
            onClick={evaluateAnswer}
            disabled={userInput.trim().length === 0}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Vérifier l'orthographe</span>
          </button>

          <button
            onClick={handleRevealFirstHint}
            className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Révéler les premières lettres"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Indice</span>
          </button>

          <button
            onClick={handleRevealAll}
            className="py-3 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Révéler la solution"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Result Feedback */}
        {isSubmitted && (
          <div className="w-full max-w-lg mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {isSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-base mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Excellent ! Orthographe parfaite.</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Vous avez épelé « {item.text} » sans aucune faute.
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={onNextItem}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Mot suivant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm mb-3">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Analyse détaillée de votre orthographe :</span>
                </div>

                {/* Letter by letter comparison tiles */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                  {comparisons.map((c, idx) => {
                    let style = 'bg-slate-100 text-slate-600';
                    if (c.status === 'correct') {
                      style = 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300';
                    } else if (c.status === 'wrong-accent') {
                      style = 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-400 ring-1 ring-amber-400';
                    } else {
                      style = 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 border-red-300';
                    }

                    return (
                      <div
                        key={`comp-${idx}`}
                        className={`min-w-7 h-9 px-1 rounded-md border flex flex-col items-center justify-center font-mono text-sm font-bold ${style}`}
                        title={c.explanation || `Lettre attendue : ${c.targetChar}`}
                      >
                        <span>{c.userChar || '␣'}</span>
                        <span className="text-[9px] font-normal opacity-70">
                          {c.targetChar}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-amber-800 dark:text-amber-200 flex flex-col gap-1">
                  <div>
                    <span className="font-semibold">Légende :</span> vert = exact, ambre = accent à corriger, rouge = lettre erronée.
                  </div>
                  <div>
                    <span className="font-semibold">Orthographe exacte :</span> «{' '}
                    <span className="font-bold underline">{item.text}</span> »
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setUserInput('');
                      setIsSubmitted(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réessayer</span>
                  </button>

                  <button
                    onClick={onNextItem}
                    className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
