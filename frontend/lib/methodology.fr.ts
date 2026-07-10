/* Notre approche de recherche — traduction française. */

export const METHOD_FR = {
  eyebrow: "Approche",
  title: "Comment nos modèles apprennent",
  subtitle: "Apprentissage par renforcement × Causalité",
  lede: "Nous menons notre recherche autour de deux forces. L'apprentissage par renforcement permet à un modèle de progresser à partir de résultats — il propose, est noté, et renforce ce qui fonctionne. La causalité lui permet de raisonner sur la cause et l'effet, et non sur la simple corrélation — il généralise ainsi, reste robuste, et peut s'expliquer.",
  pillars: [
    {
      tag: "01",
      title: "Apprentissage par renforcement",
      body: "Le modèle propose de nombreuses réponses candidates, chacune est notée par rapport à des résultats vérifiables et à la préférence humaine, et le modèle est orienté vers ce qui obtient un bon score et éloigné de ce qui n'en obtient pas — sous supervision humaine à chaque point de contrôle.",
      points: [
        "Des récompenses ancrées dans les résultats, pas seulement dans l'opinion",
        "Échantillonner largement, renforcer les meilleurs",
        "Chaque amélioration soumise à une évaluation de contrôle",
      ],
    },
    {
      tag: "02",
      title: "Causalité",
      body: "Nous enseignons aux modèles la structure causale d'un domaine — les mécanismes derrière les données. Raisonner sur la cause, l'effet et les contrefactuels (« que se passerait-il si… ») rend le modèle robuste aux corrélations fallacieuses et capable de justifier ses décisions.",
      points: [
        "Informé par les mécanismes, pas seulement par la corrélation",
        "Raisonnement contrefactuel pour la robustesse",
        "Des décisions qui peuvent être expliquées et auditées",
      ],
    },
  ],
  loop: [
    { n: "01", title: "Proposer", body: "Le modèle génère un ensemble diversifié de réponses candidates pour chaque situation." },
    { n: "02", title: "Évaluer", body: "Chaque candidat est noté — par des vérificateurs, des simulateurs, la préférence humaine, et une vérification de cohérence causale." },
    { n: "03", title: "Renforcer", body: "Le modèle est mis à jour vers un comportement à la fois bien noté et causalement solide, puis réévalué avant promotion." },
  ],
  note: "La V1 propose un contenu de qualité production décrivant notre approche publique. Les méthodes détaillées, benchmarks et résultats de référence arriveront en V2.",
};

export const RESEARCH_LOOP_FR = [
  { n: "01", title: "Proposer", body: "Générer un ensemble diversifié d'hypothèses, de modèles ou de réponses candidates pour le problème posé." },
  { n: "02", title: "Évaluer", body: "Noter chaque candidat par rapport à des vérificateurs, des simulateurs et la préférence humaine." },
  { n: "03", title: "Analyse causale", body: "Vérifier que les candidats gagnants résistent à un examen contrefactuel et mécanistique, pas seulement corrélationnel." },
  { n: "04", title: "Renforcer", body: "Mettre à jour le modèle vers les candidats à la fois bien notés et causalement solides." },
  { n: "05", title: "Itérer", body: "Réintégrer l'amélioration vérifiée dans le cycle suivant — une boucle contrôlée et auditable." },
];
