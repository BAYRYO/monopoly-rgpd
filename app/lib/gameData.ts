export type TileType = "PROPERTY" | "CORNER" | "CHANCE" | "TAX";

export interface TileData {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  color?: string; // Tailwind color class or hex
  description?: string;
}

export const BOARD_SIZE = 40; // Standard Monopoly size

export const GAME_BOARD: TileData[] = [
  // Bottom Row (0-10)
  {
    id: 0,
    name: "Départ",
    type: "CORNER",
    description: "Recevez 200 Crédits de Conformité",
  },
  {
    id: 1,
    name: "Données Personnelles",
    type: "PROPERTY",
    price: 60,
    color: "bg-amber-700",
  }, // Brown
  { id: 2, name: "Coffre de Communauté", type: "CHANCE" },
  {
    id: 3,
    name: "Données Sensibles",
    type: "PROPERTY",
    price: 60,
    color: "bg-amber-700",
  }, // Brown
  {
    id: 4,
    name: "Taxe CNIL",
    type: "TAX",
    price: 200,
    description: "Amende pour non-conformité",
  },
  {
    id: 5,
    name: "Serveur Ouest",
    type: "PROPERTY",
    price: 200,
    description: "Hébergement de données",
  }, // Station
  {
    id: 6,
    name: "Droit d'accès",
    type: "PROPERTY",
    price: 100,
    color: "bg-sky-400",
  }, // Light Blue
  { id: 7, name: "Chance", type: "CHANCE" },
  {
    id: 8,
    name: "Droit de rectification",
    type: "PROPERTY",
    price: 100,
    color: "bg-sky-400",
  }, // Light Blue
  {
    id: 9,
    name: "Droit à l'effacement",
    type: "PROPERTY",
    price: 120,
    color: "bg-sky-400",
  }, // Light Blue

  // Left Row (10-20)
  {
    id: 10,
    name: "Audit (Prison)",
    type: "CORNER",
    description: "Juste visite ou en redressement",
  },
  {
    id: 11,
    name: "Consentement",
    type: "PROPERTY",
    price: 140,
    color: "bg-fuchsia-600",
  }, // Pink
  {
    id: 12,
    name: "Compagnie d'Électricité",
    type: "PROPERTY",
    price: 150,
    description: "Infrastructure",
  }, // Utility
  {
    id: 13,
    name: "Transparence",
    type: "PROPERTY",
    price: 140,
    color: "bg-fuchsia-600",
  }, // Pink
  {
    id: 14,
    name: "Droit à la limitation",
    type: "PROPERTY",
    price: 160,
    color: "bg-fuchsia-600",
  }, // Pink
  {
    id: 15,
    name: "Serveur Nord",
    type: "PROPERTY",
    price: 200,
    description: "Hébergement de données",
  }, // Station
  {
    id: 16,
    name: "Minimisation",
    type: "PROPERTY",
    price: 180,
    color: "bg-orange-500",
  }, // Orange
  { id: 17, name: "Coffre de Communauté", type: "CHANCE" },
  {
    id: 18,
    name: "Exactitude",
    type: "PROPERTY",
    price: 180,
    color: "bg-orange-500",
  }, // Orange
  {
    id: 19,
    name: "Limitation conservation",
    type: "PROPERTY",
    price: 200,
    color: "bg-orange-500",
  }, // Orange

  // Top Row (20-30)
  { id: 20, name: "Parc Gratuit", type: "CORNER", description: "Pause café" },
  {
    id: 21,
    name: "Sécurité",
    type: "PROPERTY",
    price: 220,
    color: "bg-red-600",
  }, // Red
  { id: 22, name: "Chance", type: "CHANCE" },
  {
    id: 23,
    name: "Confidentialité",
    type: "PROPERTY",
    price: 220,
    color: "bg-red-600",
  }, // Red
  {
    id: 24,
    name: "Intégrité",
    type: "PROPERTY",
    price: 240,
    color: "bg-red-600",
  }, // Red
  {
    id: 25,
    name: "Serveur Est",
    type: "PROPERTY",
    price: 200,
    description: "Hébergement de données",
  }, // Station
  { id: 26, name: "DPO", type: "PROPERTY", price: 260, color: "bg-yellow-400" }, // Yellow
  {
    id: 27,
    name: "Déchiffrement",
    type: "PROPERTY",
    price: 260,
    color: "bg-yellow-400",
  }, // Yellow
  {
    id: 28,
    name: "Compagnie des Eaux",
    type: "PROPERTY",
    price: 150,
    description: "Refroidissement",
  }, // Utility
  {
    id: 29,
    name: "Registre",
    type: "PROPERTY",
    price: 280,
    color: "bg-yellow-400",
  }, // Yellow

  // Right Row (30-40)
  {
    id: 30,
    name: "Allez en Audit",
    type: "CORNER",
    description: "Non-conformité grave !",
  },
  {
    id: 31,
    name: "Analyse d'Impact",
    type: "PROPERTY",
    price: 300,
    color: "bg-emerald-500",
  }, // Green
  {
    id: 32,
    name: "Droit d'opposition",
    type: "PROPERTY",
    price: 300,
    color: "bg-emerald-500",
  }, // Green
  { id: 33, name: "Coffre de Communauté", type: "CHANCE" },
  {
    id: 34,
    name: "Profilage",
    type: "PROPERTY",
    price: 320,
    color: "bg-emerald-500",
  }, // Green
  {
    id: 35,
    name: "Serveur Sud",
    type: "PROPERTY",
    price: 200,
    description: "Hébergement de données",
  }, // Station
  { id: 36, name: "Chance", type: "CHANCE" },
  {
    id: 37,
    name: "Fuite de données",
    type: "PROPERTY",
    price: 350,
    color: "bg-blue-800",
  }, // Dark Blue
  {
    id: 38,
    name: "Taxe de Luxe",
    type: "TAX",
    price: 100,
    description: "Formation coûteuse",
  },
  {
    id: 39,
    name: "Sanction Administrative",
    type: "PROPERTY",
    price: 400,
    color: "bg-blue-800",
  }, // Dark Blue
];

export const CORNER_IDS = [0, 10, 20, 30];
