# Épelle-Moi & Écoute — Studio Audio d'Épellation et de Dictée en Français

Une application web interactive pour écouter la prononciation naturelle de mots et de phrases en français, apprendre leur orthographe exacte lettre par lettre, et s'exercer grâce à des dictées sonores interactives avec clavier d'accents français.

### User Review & Critical Decisions

> [!IMPORTANT]
> Les choix fondamentaux confirmés suite à vos retours :
> - **Public cible** : Tous niveaux, avec des catégories progressives allant de l'alphabet et des mots du quotidien jusqu'aux phrases idiomatiques et constructions grammaticales avancées.
> - **Modes d'apprentissage** : Écoute globale fluide, épellation sonore décomposée lettre par lettre avec indication des accents (ex. « é aigu », « ç cédille », « double l »), et mode dictée interactive avec validation en direct.
> - **Bibliothèque de contenu** : Bibliothèque thématique riche et organisée (vocabulaire, expressions, virelangues, phrases du quotidien) doublée d'un module d'ajout libre de mots et phrases personnalisés sauvegardés localement.

---

### 1. Overview & Core Concept

- **Ce que fait l'application** :
  - **Module d'Écoute Haute Fidélité** : Permet d'écouter n'importe quel mot ou phrase avec réglage du débit (normal, ralenti 0.75x, très lent 0.5x) et sélection de voix françaises naturelles.
  - **Mode Épellation Sonore & Visuelle Pas-à-Pas** : Décompose le mot ou la phrase lettre par lettre, épelle chaque caractère à voix haute avec ses diacritiques (« E accent aigu », « C cédille », tirets, apostrophes) tout en synchronisant l'affichage visuel en surbrillance.
  - **Atelier de Dictée & Clavier d'Accents** : L'app prononce une phrase ou un mot masqué, et l'apprenant doit l'écrire ou l'épeler avec un retour d'erreur intelligent et un clavier tactile d'accents français (`é`, `è`, `ê`, `ë`, `à`, `â`, `î`, `ï`, `ô`, `ù`, `û`, `ç`, `œ`, `æ`).
  - **Studio Personnalisé** : Permet à l'utilisateur de taper ou coller n'importe quel mot ou phrase de son choix pour l'écouter instantanément, l'analyser, et l'épeler à son rythme.
- **Public cible** : Apprenants du français langue étrangère (FLE), enfants scolarisés, adultes souhaitant perfectionner leur orthographe et leur compréhension orale, ou toute personne préparant un concours ou un examen de français.
- **Valeur clé** : Passerelle immédiate entre la sonorité orale du français (souvent piégeuse avec ses lettres muettes, liaisons et accents) et sa transcription orthographique rigoureuse.

---

### 2. User Experience & Visual Design

#### Parcours Utilisateur
1. **Accueil & Sélection de Catégorie** :
   - L'utilisateur arrive sur un écran clair présentant 4 onglets majeurs : **Découverte & Écoute**, **Épellation Guidée**, **Mode Dictée Interactive**, et **Mon Carnet de Mots**.
   - Sélecteur de niveau/thème (ex. *Alphabet & Sons*, *Objets du quotidien*, *Voyage & Ville*, *Gastronomie*, *Phrases usuelles*, *Difficultés orthographiques & Virelangues*).
2. **Écran d'Entraînement & d'Écoute** :
   - Une scène interactive épurée affiche le mot ou la phrase courante en typographie soignée avec transcription phonétique indicative.
   - Commandes audio fluides : « Écouter », « Ralentir », « Épeler lettre par lettre », « Répéter ».
   - Durant l'épellation, chaque lettre s'illumine au fur et à mesure que la synthèse vocale l'énonce en français.
3. **Session de Dictée Interactive** :
   - Le mot/phrase est masqué (ou affiché sous forme d'espaces réservés `_ _ _ _`).
   - L'utilisateur écoute à volonté, puis saisit la réponse.
   - Boutons d'assistance : « Premier indice », « Épeler les 2 premières lettres », « Révéler ».
   - Clavier virtuel intégré pour les caractères accentués français, idéal sur mobile et ordinateur sans configuration azerty complexe.
   - Bilan immédiat avec mise en exergue des lettres corrigées (vert pour exact, ambre pour accent manquant, rouge pour lettre erronée).

#### Identité Visuelle & Thème
- **Direction esthétique** : Inspirée des studios d'apprentissage modernes et de la typographie éditoriale française (élégant, épuré, studieux et chaleureux).
- **Palette de couleurs** :
  - Fond dominant (60%) : Ardoise douce / Papier velin clair (`#F8FAFC` en mode clair, `#0F172A` en mode sombre).
  - Surfaces structurelles (30%) : Cartes blanches pures (`#FFFFFF` / `#1E293B`) avec bordures très fines (`border-slate-200 / border-slate-800`).
  - Accents d'action (10%) : Bleu cobalt français (`#2563EB`) pour la lecture audio, Émeraude (`#059669`) pour la validation orthographique exacte, Ambre chaud (`#D97706`) pour l'épellation pas-à-pas.
- **Typographie** :
  - Titres et mots vedettes : *Plus Jakarta Sans* / *Outfit* en graisse SemiBold bien lisible.
  - Mots épelés et lettres : Caractères larges à espacement équilibré (`tracking-wider`, grandes lettres claires avec cartes de lettres individuelles).
- **Interactions & Animations** :
  - Surbrillance lettre par lettre synchronisée avec le tempo de la voix.
  - Vagues audio interactives animées quand la voix parle.
  - Pas de badges en pilules superflus, zéro éléments parasites.

---

### 3. Key Product Decisions & Trade-Offs

- **Moteur Audio : Web Speech API (speechSynthesis) optimisé pour le français** :
  - *Choix* : Utilisation prioritaire de l'API native `window.speechSynthesis` avec détection et sélection des meilleures voix françaises installées (voix naturelles `fr-FR`, `fr-CA`), avec fallback de prononciation phonétique et décomposition des règles d'épellation en français.
  - *Pourquoi* : Zéro latence, fonctionne sans quota serveur, supporte le contrôle précis de la vitesse (`playbackRate` de 0.5x à 1.2x) et permet une cadence programmable pour l'épellation caractère par caractère.
- **Règles d'Épellation Française Complète** :
  - *Choix* : Décomposition spécifique à la langue française :
    - `é` -> « E accent aigu »
    - `è` -> « E accent grave »
    - `ê` -> « E accent circonflexe »
    - `ë` -> « E tréma »
    - `ç` -> « C cédille »
    - `œ` / `æ` -> « E dans l'O » / « E dans l'A »
    - Tirets, apostrophes et espaces nommés distinctement (« tiret », « apostrophe », « espace »).
- **Persistance locale (localStorage)** :
  - Sauvegarde de l'historique des mots personnalisés de l'utilisateur, des favoris et du score d'entraînement sans nécessiter d'inscription ni de compte lourd.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Bar (Brand & Mode Nav)                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌─────────────────────────────────────────┐   ┌───────────────────────────────────────────┐
│        Zone Bibliothèque & Thèmes       │   │        Zone Interactive Principale        │
│  - Catégories prédéfinies (Débutant ->  │   │  - Mode 1: Écoute & Prononciation         │
│    Avancé, Mots & Phrases usuelles)     │   │  - Mode 2: Épellation Visuelle & Vocale   │
│  - Carnet personnalisé (Ajout de texte) │   │  - Mode 3: Dictée & Clavier d'accents     │
│  - Filtre par niveau / favoris          │   │  - Vitesse: 0.5x, 0.75x, 1x               │
└─────────────────────────────────────────┘   └───────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           Moteur d'Épellation & Audio Français (Web Speech API)        │
│  - Décomposition phonétique des caractères diacritiques                │
│  - Métronome de synchronisation lettre par lettre                      │
│  - Voix FR sélectionnables & Réglages audio                            │
└────────────────────────────────────────────────────────────────────────┘
```

#### Modèle de Données & États
- `FrenchItem` : `{ id, text, translation?, category, level: 'debutant' | 'intermediaire' | 'avance', type: 'mot' | 'phrase', phonetic?: string, note?: string }`
- `SpellingProgress` : `{ currentLetterIndex, isPlaying, isSpelling, speed, voice }`
- `DictationState` : `{ userInput, status: 'typing' | 'checked' | 'revealed', score, hintsUsed }`
- `CustomLibrary` : persistance dans `localStorage` pour les phrases ajoutées par l'utilisateur.
