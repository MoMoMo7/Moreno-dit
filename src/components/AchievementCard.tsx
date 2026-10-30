import React, { useState } from 'react';
import { BadgeTier, BadgeTierId, UserProgress } from '../types';
import { Award, Trophy, Star, CheckCircle, Lock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface AchievementCardProps {
  progress: UserProgress;
  className?: string;
}

export const BADGE_TIERS: BadgeTier[] = [
  {
    id: 'debutant',
    title: 'Débutant',
    minRequired: 0,
    subtitle: 'Premier pas en français',
    color: 'emerald',
  },
  {
    id: 'intermediaire',
    title: 'Intermédiaire',
    minRequired: 5,
    subtitle: 'Explorateur des sonorités',
    color: 'blue',
  },
  {
    id: 'avance',
    title: 'Avancé',
    minRequired: 15,
    subtitle: 'Maître des accents',
    color: 'violet',
  },
  {
    id: 'expert',
    title: 'Expert',
    minRequired: 30,
    subtitle: 'Champion de l’orthographe',
    color: 'amber',
  },
];

export const AchievementCard: React.FC<AchievementCardProps> = ({
  progress,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Total unique mastered items (distinct union of listened and spelled)
  const allMasteredSet = new Set([
    ...progress.listenedIds,
    ...progress.spelledCorrectIds,
  ]);
  const totalMastered = allMasteredSet.size;

  // Determine current tier
  let currentTierIndex = 0;
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (totalMastered >= BADGE_TIERS[i].minRequired) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = BADGE_TIERS[currentTierIndex];
  const nextTier = BADGE_TIERS[currentTierIndex + 1] || null;

  // Progress percentage to next tier
  let progressPercent = 100;
  let remainingForNext = 0;

  if (nextTier) {
    const prevRequired = currentTier.minRequired;
    const nextRequired = nextTier.minRequired;
    const range = nextRequired - prevRequired;
    const progressInRange = Math.max(0, totalMastered - prevRequired);
    progressPercent = Math.min(100, Math.round((progressInRange / range) * 100));
    remainingForNext = nextRequired - totalMastered;
  }

  const getTierIcon = (id: BadgeTierId, unlocked: boolean) => {
    if (!unlocked) return <Lock className="w-3.5 h-3.5 text-slate-400" />;
    switch (id) {
      case 'debutant':
        return <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />;
      case 'intermediaire':
        return <Award className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />;
      case 'avance':
        return <Sparkles className="w-3.5 h-3.5 text-violet-500 fill-violet-500" />;
      case 'expert':
        return <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />;
    }
  };

  return (
    <div
      className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-all ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Badge actuel
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{currentTier.title}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                ({currentTier.subtitle})
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title={isExpanded ? 'Réduire' : 'Voir tous les badges'}
          aria-label="Afficher les détails des badges"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar to next level */}
      {nextTier ? (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span>
              Objectif : <strong className="text-slate-700 dark:text-slate-300">{nextTier.title}</strong>
            </span>
            <span>
              {remainingForNext} {remainingForNext > 1 ? 'mots restants' : 'mot restant'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-3 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Félicitations ! Vous avez atteint le rang suprême d'Expert.</span>
        </div>
      )}

      {/* Row of Badges Status */}
      <div className="grid grid-cols-4 gap-1.5 pt-1">
        {BADGE_TIERS.map((tier, idx) => {
          const isUnlocked = totalMastered >= tier.minRequired;
          const isCurrent = tier.id === currentTier.id;

          return (
            <div
              key={tier.id}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center border transition-all ${
                isCurrent
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 ring-1 ring-blue-400'
                  : isUnlocked
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60 text-slate-400'
              }`}
              title={`${tier.title} (${tier.minRequired} mots requis)`}
            >
              <div className="mb-1">{getTierIcon(tier.id, isUnlocked)}</div>
              <span className="text-[10px] font-bold truncate w-full">
                {tier.title}
              </span>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                {tier.minRequired === 0 ? '0+' : `${tier.minRequired}+`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats summary (clean unboxed text) */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
        <span>Écoutés : <strong className="text-slate-700 dark:text-slate-200">{progress.listenedIds.length}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Épelés sans faute : <strong className="text-emerald-600 dark:text-emerald-400">{progress.spelledCorrectIds.length}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Total : <strong className="text-blue-600 dark:text-blue-400">{totalMastered}</strong></span>
      </div>

      {/* Expanded details list */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
            Paliers de progression :
          </div>
          {BADGE_TIERS.map((tier) => {
            const isUnlocked = totalMastered >= tier.minRequired;
            return (
              <div
                key={`detail-${tier.id}`}
                className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400"
              >
                <div className="flex items-center gap-1.5">
                  {getTierIcon(tier.id, isUnlocked)}
                  <span className={isUnlocked ? 'font-semibold text-slate-900 dark:text-white' : ''}>
                    {tier.title}
                  </span>
                  <span className="text-slate-400 italic">· {tier.subtitle}</span>
                </div>
                <span className="font-mono text-slate-500">
                  {isUnlocked ? 'Débloqué' : `${tier.minRequired} requis`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
