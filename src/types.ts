export type ItemLevel = 'debutant' | 'intermediaire' | 'avance';
export type ItemType = 'mot' | 'phrase';

export type CategoryId =
  | 'tous'
  | 'alphabet'
  | 'quotidien'
  | 'nature_animaux'
  | 'gastronomie'
  | 'phrases_usuelles'
  | 'pieges_orthographe'
  | 'personnalises';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  description: string;
}

export interface FrenchItem {
  id: string;
  text: string;
  phonetic?: string;
  translation?: string; // French meaning or simple English gloss
  level: ItemLevel;
  type: ItemType;
  category: CategoryId;
  note?: string; // Grammar or spelling tip (e.g. "Double 'm', lettre muette finale")
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface LetterSpelling {
  char: string;
  spokenName: string;
  displayHint?: string;
  isPunctuation?: boolean;
  isSpace?: boolean;
  isDiacritic?: boolean;
}

export type ActiveTab = 'ecoute' | 'epellation' | 'dictee' | 'carnet' | 'statistiques';

export interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceURI: string | null;
}

export type BadgeTierId = 'debutant' | 'intermediaire' | 'avance' | 'expert';

export interface BadgeTier {
  id: BadgeTierId;
  title: string;
  minRequired: number;
  subtitle: string;
  color: string;
}

export interface ProgressEvent {
  itemId: string;
  category: CategoryId;
  action: 'listen' | 'spell_correct';
  timestamp: number;
}

export interface UserProgress {
  listenedIds: string[];
  spelledCorrectIds: string[];
  history: ProgressEvent[];
}
