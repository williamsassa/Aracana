/* Catalogue produits ARACANA AI — traduction française.
   Doit rester structurellement identique à products.en.ts (mêmes slugs,
   codenames, status, background — voir products.ts pour l'invariant). */

import type { Product } from "./products.en";

export const PRODUCTS_FR: Product[] = [
  {
    slug: "generative-model",
    name: "Modèle Génératif",
    codename: "GENESIS",
    fullName: "ARACANA Generative Model",
    modality: "Texte · Image · Vidéo",
    status: "soon",
    background: false,
    tagline: "Génération souveraine de texte, d'image et de vidéo.",
    summary:
      "Un modèle génératif multimodal unifié, conçu pour les langues européennes, la conformité réglementaire et une qualité de production professionnelle — texte, image et vidéo depuis un seul système souverain.",
    overview: [
      "L'ARACANA Generative Model est un système multimodal unique qui rédige, illustre et anime. Il traite le texte, l'image et la vidéo comme une seule représentation partagée, permettant à un prompt de passer sans rupture d'un brief écrit à une séquence visuelle finalisée.",
      "Il est construit souveraineté d'abord : il peut être entraîné, hébergé et audité entièrement au sein d'infrastructures européennes, avec une traçabilité complète de ses données d'entraînement et de ses productions. Cela le rend adapté aux secteurs réglementés — finance, secteur public, médias — où la résidence des données et l'auditabilité ne sont pas négociables.",
      "La qualité est alignée par apprentissage par renforcement sur un mélange de récompenses fondées sur les préférences humaines et sur des règles, de sorte que le modèle apprend un ton de marque, un ancrage factuel et une fidélité visuelle plutôt que des moyennes génériques.",
    ],
    capabilities: [
      { title: "Texte multilingue à long contexte", desc: "Rédaction, réécriture et raisonnement à travers les langues européennes avec un contexte de document long." },
      { title: "Synthèse d'image haute fidélité", desc: "Génération et édition précise avec contraintes de mise en page, de style et de marque." },
      { title: "Vidéo contrôlable", desc: "Génération de vidéos courtes avec personnages, mouvements et plans cohérents et contrôlables." },
      { title: "Ancré et sourcé", desc: "Ancrage optionnel par recherche documentaire pour tracer le texte généré jusqu'à ses sources." },
    ],
    specs: [
      { label: "Modalités", value: "Texte, Image, Vidéo" },
      { label: "Contexte", value: "Contexte long (objectif 128K+ tokens)" },
      { label: "Alignement", value: "Apprentissage par renforcement + préférence humaine" },
      { label: "Déploiement", value: "Cloud / On-prem / Souverain" },
      { label: "Statut", value: "Bientôt" },
    ],
    rewardIntro:
      "En génération, aucun vérificateur unique ne peut affirmer qu'une réponse est « correcte ». Nous combinons donc plusieurs signaux de récompense sur un lot de candidats échantillonnés.",
    rewardComponents: [
      { signal: "Modèle de récompense par préférence humaine", weight: "0,50", desc: "Appris à partir d'annotateurs européens classant des paires de résultats selon leur utilité et leur ton." },
      { signal: "Vérification de l'ancrage factuel", weight: "0,20", desc: "Récompense les affirmations soutenues par des sources récupérées ; pénalise les hallucinations." },
      { signal: "Modèle esthétique / fidélité", weight: "0,20", desc: "Pour l'image et la vidéo : évalue la résolution, la cohérence et l'alignement au prompt." },
      { signal: "Filtre de sécurité et de conformité", weight: "0,10", desc: "Pénalité forte pour tout contenu dangereux ou non conforme." },
    ],
    rewardExample:
      "Exemple : pour un prompt donné, nous échantillonnons 16 légendes pour une image. Chaque légende est notée par le modèle de préférence et la vérification d'ancrage, les scores sont combinés et comparés entre les 16 candidats. La légende à la fois bien écrite et fidèle à l'image obtient le meilleur score et est renforcée.",
  },
  {
    slug: "coding-agent-model",
    name: "Agent de Développement",
    codename: "FORGE",
    fullName: "ARACANA Coding Agent Model",
    modality: "Ingénierie logicielle autonome",
    status: "soon",
    background: false,
    tagline: "Un ingénieur logiciel autonome, exécutable sur site.",
    summary:
      "Un agent de développement qui planifie, modifie, exécute et teste de vraies bases de code — vérifiant son propre travail par les tests et le typage avant de proposer un changement.",
    overview: [
      "L'ARACANA Coding Agent Model est entraîné pour opérer sur de vrais dépôts, pas sur des extraits isolés. Il lit le projet, planifie un changement, modifie plusieurs fichiers, exécute la suite de tests, lit les échecs et itère — avec un humain dans la boucle à chaque étape de validation.",
      "Parce que la correction en logiciel est vérifiable (ça compile ou non ; les tests passent ou non), c'est une cible idéale pour l'apprentissage par renforcement : la récompense est ancrée dans une exécution déterministe plutôt que dans une opinion, ce qui produit un signal d'entraînement propre et peu bruité.",
      "Il est conçu pour les environnements sensibles : il peut fonctionner entièrement hors ligne (air-gapped), afin que le code source propriétaire ou classifié ne quitte jamais l'infrastructure souveraine.",
    ],
    capabilities: [
      { title: "Raisonnement à l'échelle du dépôt", desc: "Comprend et modifie de nombreux fichiers et modules à la fois." },
      { title: "Exécution auto-vérifiante", desc: "Exécute builds, tests et vérifications de types et lit leurs résultats pour se corriger." },
      { title: "Planifier → agir → réviser", desc: "Produit un plan et un diff auditables pour approbation humaine avant fusion." },
      { title: "Déploiement air-gapped", desc: "Fonctionne sur site sans aucun appel externe pour les bases de code classifiées." },
    ],
    specs: [
      { label: "Interface", value: "CLI · IDE · API" },
      { label: "Vérification", value: "Build + tests + vérification de types" },
      { label: "Alignement", value: "Apprentissage par renforcement (exécution)" },
      { label: "Déploiement", value: "On-prem / Air-gapped" },
      { label: "Statut", value: "Bientôt" },
    ],
    rewardIntro:
      "Le code est vérifiable, donc la récompense est presque entièrement fondée sur des règles — le signal de renforcement le plus propre possible. Nous échantillonnons de nombreux correctifs candidats et exécutons chacun d'eux.",
    rewardComponents: [
      { signal: "Tests réussis", weight: "0,55", desc: "Fraction de la suite de tests pertinente qui passe du rouge au vert." },
      { signal: "Compile / se type-vérifie", weight: "0,20", desc: "Porte binaire : le correctif doit compiler et passer la vérification de types." },
      { signal: "Absence de régression", weight: "0,15", desc: "Pénalité pour tout test précédemment réussi que le correctif casse." },
      { signal: "Minimalité et style du diff", weight: "0,10", desc: "Récompense les changements petits, idiomatiques et conformes au lint plutôt que les changements étendus." },
    ],
    rewardExample:
      "Exemple : un ticket de bug sert de prompt. Nous échantillonnons 8 correctifs candidats, appliquons chacun dans un bac à sable, et lançons la suite de tests. Le correctif o₃ corrige le bug sans rien casser (R = 1,0) ; le correctif o₅ le corrige mais casse deux autres tests (R = 0,4) ; le correctif o₇ ne compile pas (R = 0). Le modèle est renforcé vers o₃ et éloigné de o₇ — sans étiquette humaine requise.",
  },
  {
    slug: "state-space-sovereignty-model",
    name: "Modèle Souverain d'État",
    codename: "AEGIS",
    fullName: "ARACANA State Space Sovereignty Model",
    modality: "Intelligence décisionnelle souveraine",
    status: "soon",
    background: false,
    tagline: "Intelligence décisionnelle auditable pour institutions souveraines.",
    summary:
      "Un modèle à espace d'états à très long horizon pour l'aide à la décision souveraine — efficace sur des séquences très longues, auditable de bout en bout, et déployable entièrement sur une infrastructure nationale.",
    overview: [
      "L'ARACANA State Space Sovereignty Model repose sur une architecture à espace d'états, lui conférant une mise à l'échelle quasi linéaire sur des séquences extrêmement longues — des mois de signaux, de flux de capteurs ou de documents tenus dans un seul contexte. Cela le rend particulièrement adapté à la conscience situationnelle et à l'aide à la décision à long horizon.",
      "Chaque inférence est traçable. Le modèle expose les preuves et l'état intermédiaire derrière chaque recommandation, afin qu'une autorité humaine puisse auditer pourquoi une conclusion a été atteinte — une exigence incontournable pour la défense, les infrastructures critiques et le secteur public.",
      "Il est souverain par construction : poids, entraînement et inférence peuvent être hébergés entièrement au sein d'une infrastructure nationale, sans dépendance à un cloud étranger, et alignés sur les structures de commandement et de responsabilité européennes.",
    ],
    capabilities: [
      { title: "Contexte à très long horizon", desc: "Architecture à espace d'états qui s'étend de façon quasi linéaire sur des séquences très longues." },
      { title: "Décisions auditables", desc: "Expose les preuves à l'appui et l'état interne pour révision humaine." },
      { title: "Fusion multi-sources", desc: "Intègre documents, signaux et séries temporelles en une image situationnelle unique." },
      { title: "Déploiement souverain", desc: "Entièrement sur site, air-gapped, sans dépendance à un cloud étranger." },
    ],
    specs: [
      { label: "Architecture", value: "Espace d'états (temps linéaire)" },
      { label: "Contexte", value: "Horizon ultra-long" },
      { label: "Alignement", value: "Apprentissage par renforcement + modélisation causale" },
      { label: "Déploiement", value: "Souverain / Air-gapped" },
      { label: "Statut", value: "Bientôt" },
    ],
    rewardIntro:
      "L'aide à la décision souveraine doit être à la fois correcte ET responsable. La récompense combine donc la précision des résultats avec une forte prime à la traçabilité et à la préservation de l'autorité humaine.",
    rewardComponents: [
      { signal: "Précision de la décision", weight: "0,40", desc: "Exactitude par rapport à des résultats historiques ou simulés vérifiés." },
      { signal: "Fidélité des preuves", weight: "0,30", desc: "Chaque recommandation doit citer un état/une preuve à l'appui qui se vérifie." },
      { signal: "Calibration", weight: "0,20", desc: "Récompense une confiance bien calibrée ; pénalise les erreurs de surconfiance." },
      { signal: "Préservation de l'autorité", weight: "0,10", desc: "Pénalise les résultats qui contournent l'approbation humaine requise." },
    ],
    rewardExample:
      "Exemple : sur un scénario historique rejoué, nous échantillonnons 12 évaluations candidates. Chacune est notée selon qu'elle correspond au résultat connu, que ses preuves citées sont réelles, et que sa confiance était bien calibrée. Le modèle est renforcé vers les évaluations à la fois justes et honnêtement étayées — pas simplement confiantes.",
  },
  {
    slug: "multi-agent-system",
    name: "Système Multi-Agents",
    codename: "SWARM",
    fullName: "ARACANA Multi-Agent System",
    modality: "Flottes d'agents orchestrées",
    status: "development",
    background: true,
    tagline: "Des flottes d'agents spécialisés qui résolvent ce qu'un seul modèle ne peut pas.",
    summary:
      "Une couche d'orchestration où des agents spécialisés planifient, négocient et s'auto-organisent sous supervision centrale — en développement actif.",
    overview: [
      "L'ARACANA Multi-Agent System coordonne de nombreux agents spécialisés — chercheurs, développeurs, vérificateurs, planificateurs — en une seule flotte de résolution de problèmes. Un orchestrateur central décompose un objectif, attribue des rôles et concilie les résultats.",
      "Les agents partagent une mémoire vérifiable et communiquent sur un canal auditable, de sorte que le raisonnement de l'ensemble du système puisse être inspecté a posteriori. La supervision centrale maintient les comportements émergents dans des limites définies.",
      "Ce système est en développement actif et sous-tend nos autres produits en leur permettant de se solliciter mutuellement. Sa disponibilité publique sera annoncée séparément.",
    ],
    capabilities: [
      { title: "Agents spécialisés par rôle", desc: "Chaque agent est ajusté pour une fonction étroite et bien définie." },
      { title: "Communication vérifiable", desc: "Tous les messages inter-agents sont journalisés et auditables." },
      { title: "Mémoire partagée", desc: "Une mémoire commune et cohérente maintient la flotte coordonnée." },
      { title: "Supervision centrale", desc: "Un orchestrateur borne les comportements émergents et garde les humains aux commandes." },
    ],
    specs: [
      { label: "Modèle", value: "Orchestrateur + spécialistes" },
      { label: "Communications", value: "Auditables, journalisées" },
      { label: "Alignement", value: "Apprentissage par renforcement (agent + système)" },
      { label: "Déploiement", value: "Cloud / On-prem" },
      { label: "Statut", value: "En développement" },
    ],
    rewardIntro:
      "L'entraînement multi-agents ajoute une récompense au niveau système, en plus du propre signal de renforcement de chaque agent : la flotte est récompensée pour la qualité du résultat final produit conjointement.",
    rewardComponents: [
      { signal: "Réussite de la tâche (système)", weight: "0,50", desc: "La flotte a-t-elle résolu l'objectif global, vérifié de bout en bout ?" },
      { signal: "Contribution par agent", weight: "0,25", desc: "Attribution du mérite : à quel point la production de chaque agent a aidé." },
      { signal: "Efficacité de communication", weight: "0,15", desc: "Récompense l'atteinte de l'objectif avec moins de messages, plus clairs." },
      { signal: "Sécurité et supervision", weight: "0,10", desc: "Pénalité pour toute action qui échappe aux limites de l'orchestrateur." },
    ],
    rewardExample:
      "Exemple : une flotte de 4 agents s'attaque à une tâche de recherche et de développement. Nous échantillonnons plusieurs déroulements complets de la flotte, notons chaque déroulement selon que l'artefact final a passé la vérification, puis comparons entre les déroulements. Les agents dont les déroulements ont réussi sont renforcés, le mérite étant partagé selon leur contribution mesurée.",
  },
  {
    slug: "ai-scientist",
    name: "Scientifique IA",
    codename: "CURIE",
    fullName: "ARACANA AI Scientist",
    modality: "Découverte scientifique autonome",
    status: "development",
    background: true,
    tagline: "De l'hypothèse au candidat-médicament, jusqu'à la voie physiopathologique.",
    summary:
      "Un moteur de recherche autonome pour la découverte scientifique — générant des hypothèses, concevant des molécules et cartographiant des voies physiopathologiques — en développement actif.",
    overview: [
      "L'ARACANA AI Scientist referme la boucle scientifique : il propose des hypothèses, conçoit des expériences ou des molécules, évalue les résultats face à des simulateurs et à la littérature, puis affine sa prochaine proposition. Il vise directement la découverte de médicaments et la compréhension des maladies.",
      "Il est informé par les mécanismes : plutôt que de faire du pattern-matching sur des chaînes chimiques, il raisonne à partir de la biologie et de la physique sous-jacentes — mécanismes de liaison, voies métaboliques, lois de conservation — de sorte que ses propositions sont physiquement plausibles, pas seulement statistiquement probables.",
      "Ce système est en développement actif. Ses productions sont destinées à assister, accélérer et être vérifiées par des scientifiques humains, jamais à remplacer la revue d'experts et réglementaire.",
    ],
    capabilities: [
      { title: "Génération d'hypothèses", desc: "Propose et classe des hypothèses scientifiques testables." },
      { title: "Conception moléculaire", desc: "Conçoit des molécules candidates sous contraintes de « drug-likeness » et de synthèse." },
      { title: "Analyse de voies métaboliques", desc: "Cartographie les mécanismes de maladies et identifie des cibles prometteuses." },
      { title: "Ancré aux simulateurs", desc: "Évalue les propositions face à des simulateurs physiques/biologiques avant de les suggérer." },
    ],
    specs: [
      { label: "Domaines", value: "Découverte de médicaments · Biologie" },
      { label: "Ancrage", value: "Simulateurs + littérature" },
      { label: "Alignement", value: "Apprentissage par renforcement (simulateur)" },
      { label: "Déploiement", value: "Souverain / On-prem" },
      { label: "Statut", value: "En développement" },
    ],
    rewardIntro:
      "Les propositions scientifiques peuvent être partiellement vérifiées par simulation et contraintes connues, ce qui fournit un signal de récompense fort et ancré dans les mécanismes, sans attendre les résultats de laboratoire.",
    rewardComponents: [
      { signal: "Efficacité simulée", weight: "0,40", desc: "Liaison / activité prédite par des simulateurs fondés sur la physique." },
      { signal: "Drug-likeness et sécurité", weight: "0,25", desc: "Proxys ADMET et de toxicité ; pénalité forte pour les candidats dangereux." },
      { signal: "Synthétisabilité", weight: "0,20", desc: "Récompense les molécules pouvant plausiblement être synthétisées." },
      { signal: "Nouveauté", weight: "0,15", desc: "Récompense les candidats véritablement nouveaux plutôt que les redécouvertes." },
    ],
    rewardExample:
      "Exemple : pour une cible donnée, le modèle propose 32 molécules candidates. Chacune est notée par un simulateur d'arrimage moléculaire, un modèle de toxicité et un prédicteur de voie de synthèse. Le score combiné est comparé entre les 32 candidates, renforçant celles qui sont à la fois puissantes, sûres et réalisables — les molécules qui méritent d'être transmises à un laboratoire humain.",
  },
];
