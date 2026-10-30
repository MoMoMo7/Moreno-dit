import { LetterSpelling } from '../types';

/**
 * Complete phonetic map for letter-by-letter French spelling.
 * Accents and special characters are named precisely according to French orthography standards.
 */
const SPELLING_DICTIONARY: Record<string, { spokenName: string; displayHint?: string }> = {
  // Voyelles et consonnes standard majuscules / minuscules
  a: { spokenName: 'A' },
  b: { spokenName: 'B' },
  c: { spokenName: 'C' },
  d: { spokenName: 'D' },
  e: { spokenName: 'E' },
  f: { spokenName: 'F' },
  g: { spokenName: 'G' },
  h: { spokenName: 'H' },
  i: { spokenName: 'I' },
  j: { spokenName: 'J' },
  k: { spokenName: 'K' },
  l: { spokenName: 'L' },
  m: { spokenName: 'M' },
  n: { spokenName: 'N' },
  o: { spokenName: 'O' },
  p: { spokenName: 'P' },
  q: { spokenName: 'Q' },
  r: { spokenName: 'R' },
  s: { spokenName: 'S' },
  t: { spokenName: 'T' },
  u: { spokenName: 'U' },
  v: { spokenName: 'V' },
  w: { spokenName: 'Double V', displayHint: 'double V' },
  x: { spokenName: 'X' },
  y: { spokenName: 'I grec', displayHint: 'i grec' },
  z: { spokenName: 'Z' },

  // Voyelles accentuées
  é: { spokenName: 'E accent aigu', displayHint: 'accent aigu' },
  è: { spokenName: 'E accent grave', displayHint: 'accent grave' },
  ê: { spokenName: 'E accent circonflexe', displayHint: 'accent circonflexe' },
  ë: { spokenName: 'E tréma', displayHint: 'tréma' },

  à: { spokenName: 'A accent grave', displayHint: 'accent grave' },
  â: { spokenName: 'A accent circonflexe', displayHint: 'accent circonflexe' },
  ä: { spokenName: 'A tréma', displayHint: 'tréma' },

  î: { spokenName: 'I accent circonflexe', displayHint: 'accent circonflexe' },
  ï: { spokenName: 'I tréma', displayHint: 'tréma' },

  ô: { spokenName: 'O accent circonflexe', displayHint: 'accent circonflexe' },
  ö: { spokenName: 'O tréma', displayHint: 'tréma' },

  ù: { spokenName: 'U accent grave', displayHint: 'accent grave' },
  û: { spokenName: 'U accent circonflexe', displayHint: 'accent circonflexe' },
  ü: { spokenName: 'U tréma', displayHint: 'tréma' },

  // Cédille
  ç: { spokenName: 'C cédille', displayHint: 'cédille' },

  // Ligatures françaises
  œ: { spokenName: "E dans l'O", displayHint: 'ligature œ' },
  æ: { spokenName: "E dans l'A", displayHint: 'ligature æ' },

  // Ponctuation et signes
  ' ': { spokenName: 'espace', displayHint: 'espace' },
  '-': { spokenName: 'tiret', displayHint: 'tiret d’union' },
  "'": { spokenName: 'apostrophe', displayHint: 'apostrophe' },
  '’': { spokenName: 'apostrophe', displayHint: 'apostrophe' },
  '.': { spokenName: 'point', displayHint: 'point final' },
  ',': { spokenName: 'virgule', displayHint: 'virgule' },
  '?': { spokenName: "point d'interrogation", displayHint: 'point d’interrogation' },
  '!': { spokenName: "point d'exclamation", displayHint: 'point d’exclamation' },
  ':': { spokenName: 'deux-points', displayHint: 'deux points' },
  ';': { spokenName: 'point-virgule', displayHint: 'point-virgule' },
  '«': { spokenName: 'guillemet ouvrant', displayHint: 'guillemet' },
  '»': { spokenName: 'guillemet fermant', displayHint: 'guillemet' },
  '(': { spokenName: 'parenthèse ouvrante', displayHint: 'parenthèse' },
  ')': { spokenName: 'parenthèse fermante', displayHint: 'parenthèse' },
};

/**
 * Break down any French string into decomposed LetterSpelling objects
 */
export function decomposeFrenchSpelling(text: string): LetterSpelling[] {
  const result: LetterSpelling[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const lower = rawChar.toLowerCase();
    const entry = SPELLING_DICTIONARY[lower];

    const isSpace = rawChar === ' ';
    const isPunctuation = "-'’.,?!:;«»()".includes(rawChar);
    const isDiacritic = 'éèêëàâäîïôöùûüçœæ'.includes(lower);

    if (entry) {
      result.push({
        char: rawChar,
        spokenName: entry.spokenName,
        displayHint: entry.displayHint,
        isPunctuation,
        isSpace,
        isDiacritic,
      });
    } else {
      // Fallback for numbers or unrecognized symbols
      result.push({
        char: rawChar,
        spokenName: rawChar,
        isPunctuation,
        isSpace,
      });
    }
  }

  return result;
}

/**
 * Get available French voices in browser
 */
export function getFrenchVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices();
  const frenchVoices = allVoices.filter(
    (v) => v.lang.startsWith('fr') || v.lang.startsWith('FR')
  );

  return frenchVoices.length > 0 ? frenchVoices : allVoices;
}

// Global reference to prevent Chrome/Safari garbage-collecting utterances prematurely
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak full text in French using native Web Speech API
 */
export function speakFrenchText(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    voiceURI?: string | null;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.(new Error('SpeechSynthesis non supporté sur ce navigateur'));
    options.onEnd?.();
    return null;
  }

  // Resume speech synthesis queue if browser suspended it
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  if (typeof window !== 'undefined') {
    (window as any).__currentUtterance = utterance;
  }

  utterance.lang = 'fr-FR';
  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 1.0;

  if (options.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const chosen = voices.find((v) => v.voiceURI === options.voiceURI);
    if (chosen) utterance.voice = chosen;
  } else {
    // Pick the best default French voice
    const frVoices = getFrenchVoices();
    const defaultFr = frVoices.find((v) => v.lang.toLowerCase() === 'fr-fr') || frVoices[0];
    if (defaultFr) utterance.voice = defaultFr;
  }

  let isFinished = false;
  const finish = () => {
    if (isFinished) return;
    isFinished = true;
    options.onEnd?.();
  };

  utterance.onend = () => {
    finish();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled') {
      options.onError?.(e);
    }
    finish();
  };

  // Browser safety fallback: if onend is swallowed by browser, advance reliably
  const safeDurationMs = Math.max(650, (text.length * 220) / (options.rate ?? 0.9)) + 300;
  setTimeout(() => {
    if (!isFinished && activeUtterance === utterance) {
      finish();
    }
  }, safeDurationMs);

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Speak a single letter's French name (e.g. "E accent aigu", "C cédille", "B")
 */
export function speakLetterSpelling(
  spelling: LetterSpelling,
  options: {
    rate?: number;
    voiceURI?: string | null;
    onEnd?: () => void;
  } = {}
) {
  if (spelling.isSpace) {
    setTimeout(() => {
      options.onEnd?.();
    }, 300);
    return;
  }

  speakFrenchText(spelling.spokenName, {
    rate: options.rate ?? 0.9,
    pitch: 1.05,
    voiceURI: options.voiceURI,
    onEnd: options.onEnd,
  });
}

/**
 * Stop any current speech playback
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
