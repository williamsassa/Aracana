/* Contenu éditorial pour Research, Solutions et Careers — traduction française. */

import type { ResearchAxis, Solution, Value, OpenRole } from "./content.en";

export const RESEARCH_FR: ResearchAxis[] = [
  {
    id: "recursive-self-improvement",
    index: "01",
    title: "Auto-amélioration récursive",
    abstract:
      "Nous étudions des systèmes d'IA capables d'améliorer leur propre processus d'apprentissage. Plutôt qu'un unique entraînement statique, un modèle ARACANA propose des ajustements à sa curation de données, à la conception de ses récompenses et à son calendrier d'optimisation, les évalue, puis intègre les changements gagnants dans l'itération suivante — une boucle contrôlée et auditable, et non un processus ouvert sans limites.",
    points: [
      "Curricula auto-curés : le modèle classe et repondère ses propres mélanges d'entraînement selon un indicateur mesurable de capacité et de sécurité.",
      "Co-entraînement du modèle de récompense, où l'évaluateur et la politique progressent ensemble sous des garde-fous explicites et des points de contrôle humains.",
      "Amélioration vérifiable : chaque auto-modification est journalisée, reproductible et soumise à des évaluations de contrôle avant d'être autorisée à persister.",
    ],
    navBlurb: "Des systèmes qui affinent leurs propres boucles d'entraînement.",
  },
  {
    id: "mechanism-informed",
    index: "02",
    title: "IA multimodale informée par les mécanismes",
    abstract:
      "Des modèles de pointe qui respectent les mécanismes du monde physique. Nous fusionnons langage, vision, signaux et simulation structurée afin qu'un modèle ARACANA raisonne à partir des lois d'un domaine — physique, chimie, biologie, contrôle — plutôt que sur de simples corrélations de surface dans le texte.",
    points: [
      "Des a priori informés par la physique et la biologie injectés directement dans l'architecture et la fonction de perte.",
      "Ancrage cross-modal : texte, image, vidéo, séries temporelles et structure moléculaire partagent un même espace latent.",
      "Des vérifications de cohérence mécanistique qui signalent les productions violant des lois de conservation connues ou des contraintes biologiques.",
    ],
    navBlurb: "Des modèles ancrés dans les mécanismes physiques.",
  },
  {
    id: "state-integrity",
    index: "03",
    title: "Intégrité et souveraineté des États",
    abstract:
      "Une IA qui renforce, plutôt qu'elle n'érode, l'autonomie des États européens. Nous concevons des modèles pouvant être entraînés, audités, hébergés et gouvernés entièrement au sein d'infrastructures souveraines, avec une traçabilité vérifiable et un déploiement sur site comme exigences de premier ordre.",
    points: [
      "Souverain par construction : entraînement, poids et inférence peuvent résider entièrement au sein d'une infrastructure nationale.",
      "Traçabilité et auditabilité des données, de la lignée du modèle et de chaque décision prise par le système.",
      "Garanties de résilience et d'intégrité pour les déploiements à fonction critique en conditions adverses.",
    ],
    navBlurb: "Une IA alignée sur la souveraineté nationale et européenne.",
  },
];

export const SOLUTIONS_FR: Solution[] = [
  {
    id: "generative",
    title: "IA Générative",
    summary:
      "Génération souveraine de texte, d'image et de vidéo — conçue pour les langues européennes, la conformité réglementaire et une qualité de production professionnelle.",
    capabilities: [
      "Génération de texte multilingue à long contexte",
      "Synthèse et édition d'image haute fidélité",
      "Génération de vidéo contrôlable",
    ],
    status: "soon",
  },
  {
    id: "coding-agent",
    title: "Agent de Développement",
    summary:
      "Un ingénieur logiciel autonome qui planifie, modifie, teste et livre sur de vrais dépôts, avec un contrôle humain dans la boucle.",
    capabilities: [
      "Raisonnement et refactorisation à l'échelle du dépôt",
      "Exécution auto-vérifiante, pilotée par les tests",
      "Déploiement sur site / air-gapped",
    ],
    status: "soon",
  },
  {
    id: "ai-scientist",
    title: "Scientifique IA",
    summary:
      "Un moteur de recherche autonome pour la découverte scientifique — de l'hypothèse à l'analyse de candidat-médicament et de voie physiopathologique.",
    capabilities: [
      "Génération et test automatisés d'hypothèses",
      "Découverte de médicaments et conception moléculaire",
      "Identification de voies physiopathologiques et de cibles",
    ],
    status: "research",
  },
  {
    id: "space",
    title: "Espace & Très Haute Altitude",
    summary:
      "Intelligence embarquée pour satellites, plateformes stratosphériques et systèmes à très haute altitude opérant avec un calcul et une connectivité limités.",
    capabilities: [
      "Inférence en périphérie sous contraintes de puissance et de latence",
      "Pipelines d'analyse d'observation de la Terre",
      "Attribution de tâches autonome et détection d'anomalies",
    ],
    status: "research",
  },
  {
    id: "defense",
    title: "Défense Étatique",
    summary:
      "Systèmes d'aide à la décision et d'intégrité pour la défense souveraine — auditables, sur site et alignés sur les structures de commandement européennes.",
    capabilities: [
      "Déploiement souverain, air-gapped",
      "Conscience situationnelle multi-sources",
      "Aide à la décision préservant l'autorité humaine",
    ],
    status: "research",
  },
  {
    id: "multi-agent",
    title: "Systèmes Multi-Agents",
    summary:
      "Des flottes d'agents spécialisés qui coordonnent, négocient et s'auto-organisent pour résoudre des problèmes qu'aucun modèle seul ne peut résoudre.",
    capabilities: [
      "Orchestration d'agents spécialisés par rôle",
      "Mémoire partagée et communication vérifiable",
      "Planification émergente sous supervision centrale",
    ],
    status: "research",
  },
];

export const ABOUT_VALUES_FR: Value[] = [
  {
    title: "La souveraineté d'abord",
    body: "Nous construisons une IA que les États et entreprises européens peuvent posséder, auditer et exploiter selon leurs propres conditions — jamais une boîte noire louée ailleurs.",
  },
  {
    title: "De pointe, mais responsable",
    body: "Nous repoussons résolument les capacités, mais chaque boucle d'auto-amélioration est mesurable, réversible et soumise à des points de contrôle humains.",
  },
  {
    title: "Le mécanisme plutôt que le mimétisme",
    body: "Nous préférons des modèles qui comprennent les mécanismes d'un domaine à des modèles qui se contentent d'en imiter la surface.",
  },
  {
    title: "Utile dans le monde réel",
    body: "Des flux industriels à la finance en passant par les tâches quotidiennes, notre travail se juge à la valeur qu'il crée en dehors du laboratoire.",
  },
];

export const ROLES_FR: OpenRole[] = [
  {
    title: "Chercheur Scientifique — Auto-amélioration récursive",
    team: "Recherche",
    location: "Paris / Remote (UE)",
    type: "Temps plein",
  },
  {
    title: "Membre du Personnel Technique — Apprentissage par renforcement",
    team: "Entraînement",
    location: "Paris / Remote (UE)",
    type: "Temps plein",
  },
  {
    title: "Ingénieur de Recherche — Pré-entraînement multimodal",
    team: "Recherche",
    location: "Bruxelles / Remote (UE)",
    type: "Temps plein",
  },
  {
    title: "Ingénieur Logiciel — Agent de développement",
    team: "Produit",
    location: "Paris / Remote (UE)",
    type: "Temps plein",
  },
  {
    title: "Ingénieur Infrastructure — Calcul souverain",
    team: "Plateforme",
    location: "Paris / Sur site",
    type: "Temps plein",
  },
  {
    title: "Biologiste Computationnel — Scientifique IA",
    team: "Science",
    location: "Remote (UE)",
    type: "Temps plein",
  },
];

export const TEAMS_FR = [
  "Recherche",
  "Entraînement",
  "Produit",
  "Plateforme",
  "Science",
  "Opérations",
];
