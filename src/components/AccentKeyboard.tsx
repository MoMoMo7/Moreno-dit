import React from 'react';
import { speakLetterSpelling, decomposeFrenchSpelling } from '../utils/frenchSpelling';

interface AccentKeyboardProps {
  onInsertChar: (char: string) => void;
  voiceURI?: string | null;
  className?: string;
}

const ACCENT_KEYS = [
  { char: 'é', label: 'é', name: 'E accent aigu' },
  { char: 'è', label: 'è', name: 'E accent grave' },
  { char: 'ê', label: 'ê', name: 'E accent circonflexe' },
  { char: 'ë', label: 'ë', name: 'E tréma' },
  { char: 'à', label: 'à', name: 'A accent grave' },
  { char: 'â', label: 'â', name: 'A accent circonflexe' },
  { char: 'î', label: 'î', name: 'I accent circonflexe' },
  { char: 'ï', label: 'ï', name: 'I tréma' },
  { char: 'ô', label: 'ô', name: 'O accent circonflexe' },
  { char: 'ù', label: 'ù', name: 'U accent grave' },
  { char: 'û', label: 'û', name: 'U accent circonflexe' },
  { char: 'ç', label: 'ç', name: 'C cédille' },
  { char: 'œ', label: 'œ', name: "E dans l'O" },
  { char: 'æ', label: 'æ', name: "E dans l'A" },
  { char: '-', label: '-', name: 'tiret' },
  { char: "'", label: "'", name: 'apostrophe' },
];

export const AccentKeyboard: React.FC<AccentKeyboardProps> = ({
  onInsertChar,
  voiceURI,
  className = '',
}) => {
  const handleClick = (item: (typeof ACCENT_KEYS)[0]) => {
    onInsertChar(item.char);
    // Subtle audio feedback of the letter's spoken name
    const [spelling] = decomposeFrenchSpelling(item.char);
    if (spelling) {
      speakLetterSpelling(spelling, { rate: 1.1, voiceURI });
    }
  };

  return (
    <div className={`p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Caractères & accents français
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Cliquez pour insérer et entendre
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ACCENT_KEYS.map((item) => (
          <button
            key={item.char}
            type="button"
            onClick={() => handleClick(item)}
            className="w-9 h-9 sm:w-10 sm:h-10 text-base font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 hover:border-blue-400 border border-slate-200 dark:border-slate-600 rounded-lg shadow-2xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title={`${item.label} (${item.name})`}
            aria-label={`Insérer ${item.name}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
