/* Notre approche d'alignement — traduction française.
   V2 : remplace le positionnement "Reinforcement Learning × Causality" par
   "Alignment: A Mathematical Model". */

export const METHOD_FR = {
  eyebrow: "Approche",
  title: "Comment nous alignons nos modèles",
  subtitle: "Alignement : un modèle mathématique",
  lede: "Nous n'alignons pas nos modèles à l'intuition ou au réglage manuel. Chaque modèle est jugé selon une fonction objectif explicite — une formule, pas un ressenti — de sorte que ce que signifie « être bon » est écrit noir sur blanc, inspectable et réfutable avant même la première mise à jour de poids.",
  formula: {
    display: "R(x) = w₁·Résultat(x) + w₂·Cohérence(x) + w₃·Calibration(x)",
    caption: "Une forme représentative de l'objectif que le modèle optimise — les poids et termes réels sont spécifiques à chaque produit (voir les signaux ci-dessous).",
  },
  pillars: [
    {
      tag: "01",
      title: "Objectif explicite",
      body: "Chaque modèle optimise une fonction nommée et écrite de ses résultats — pas un style maison implicite. Les candidats sont notés par rapport à cette fonction, et le modèle est orienté vers ce qui obtient un bon score, sous supervision humaine à chaque point de contrôle.",
      points: [
        "L'objectif est spécifié avant l'entraînement, pas déduit après coup",
        "Chaque terme de la fonction est nommé et inspectable indépendamment",
        "Chaque amélioration est soumise à une évaluation de contrôle face à cette même fonction",
      ],
    },
    {
      tag: "02",
      title: "Structure vérifiable",
      body: "Un objectif mathématique n'est fiable que s'il résiste à l'examen — nous testons donc le comportement de chaque modèle face à des contrefactuels et des contraintes connues, pas seulement à la performance moyenne, pour repérer les objectifs qui semblent bons sur le papier mais récompensent la mauvaise chose.",
      points: [
        "Testé sous contrainte face à des contrefactuels, pas seulement des moyennes de contrôle",
        "Des vérifications de cohérence signalent les résultats qui violent des contraintes connues",
        "Chaque score est reproductible et auditable a posteriori",
      ],
    },
  ],
  loop: [
    { n: "01", title: "Formuler", body: "Définir la fonction objectif de la tâche — la formule explicite selon laquelle un candidat est noté." },
    { n: "02", title: "Optimiser", body: "Échantillonner un ensemble diversifié de candidats et noter chacun par rapport à cet objectif." },
    { n: "03", title: "Vérifier", body: "Tester la cohérence des candidats gagnants avant d'autoriser la mise à jour à persister." },
  ],
  note: "La V1 propose un contenu de qualité production décrivant notre approche publique. Les fonctions objectif exactes, benchmarks et résultats de référence arriveront en V2.",
};

export const RESEARCH_LOOP_FR = [
  { n: "01", title: "Formuler", body: "Écrire une fonction objectif explicite pour le problème posé — ce que signifie « être bon », sous forme de formule, avant tout entraînement." },
  { n: "02", title: "Évaluer", body: "Noter un ensemble diversifié de candidats par rapport à cet objectif, via des vérificateurs, des simulateurs et la préférence humaine selon les cas." },
  { n: "03", title: "Vérifier", body: "Tester la robustesse des meilleurs candidats face à des contrefactuels et des contraintes connues — pas seulement leur score moyen." },
  { n: "04", title: "Optimiser", body: "Mettre à jour le modèle vers les candidats à la fois bien notés et vérifiablement cohérents." },
  { n: "05", title: "Itérer", body: "Réintégrer l'amélioration vérifiée dans le cycle suivant — une boucle contrôlée et auditable." },
];
