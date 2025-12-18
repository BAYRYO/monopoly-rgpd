export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Quelle est la signification de l'acronyme RGPD ?",
    options: [
      "Règlement Général sur la Protection des Données",
      "Régime Global de Protection des Données",
      "Règlement Gouvernemental de Protection des Dossiers",
    ],
    correctIndex: 0,
    explanation:
      "Le RGPD (Règlement Général sur la Protection des Données) est le texte de référence européen.",
  },
  {
    id: 2,
    question: "Quel est l'âge de la majorité numérique en France ?",
    options: ["13 ans", "15 ans", "18 ans"],
    correctIndex: 1,
    explanation:
      "En France, un mineur peut consentir seul au traitement de ses données à partir de 15 ans.",
  },
  {
    id: 3,
    question: "Quel est le délai maximum pour répondre à une demande d'accès ?",
    options: ["72 heures", "1 mois", "2 mois"],
    correctIndex: 1,
    explanation:
      "Le responsable de traitement a 1 mois pour répondre. Ce délai peut être prolongé de 2 mois si la demande est complexe.",
  },
  {
    id: 4,
    question: "Qui est l'autorité de contrôle en France ?",
    options: ["L'ANSSI", "La CNIL", "La DGCCRF"],
    correctIndex: 1,
    explanation:
      "La Commission Nationale de l'Informatique et des Libertés (CNIL) est le régulateur des données personnelles.",
  },
  {
    id: 5,
    question: "Qu'est-ce qu'une donnée sensible ?",
    options: [
      "Un numéro de téléphone",
      "Une opinion politique",
      "Une adresse email professionnelle",
    ],
    correctIndex: 1,
    explanation:
      "Les opinions politiques, données de santé, ou croyances religieuses sont des données sensibles (article 9).",
  },
  {
    id: 6,
    question: "Combien de temps peut-on conserver des données ?",
    options: [
      "Indéfiniment",
      "10 ans pour tout",
      "Une durée limitée et proportionnée à la finalité",
    ],
    correctIndex: 2,
    explanation:
      "Le principe de limitation de conservation impose de ne pas garder les données plus longtemps que nécessaire.",
  },
  {
    id: 7,
    question: "Qu'est-ce que le 'Privacy by Design' ?",
    options: [
      "Protéger les données dès la conception du produit",
      "Un design de site web minimaliste",
      "Crypter toutes les données",
    ],
    correctIndex: 0,
    explanation:
      "Cela signifie intégrer la protection des données dès les premières étapes de conception d'un projet.",
  },
  {
    id: 8,
    question:
      "Dans quel cas une analyse d'impact (AIPD) est-elle obligatoire ?",
    options: [
      "Pour tout traitement de données",
      "Si le traitement présente un risque élevé pour les personnes",
      "Uniquement pour les entreprises de +250 salariés",
    ],
    correctIndex: 1,
    explanation:
      "L'AIPD est requise lorsque le traitement est susceptible d'engendrer un risque élevé pour les droits et libertés.",
  },
];
