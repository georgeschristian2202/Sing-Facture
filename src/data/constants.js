export const COLORS = {
  primary: "#1a56db",
  primaryDark: "#1e429f",
  secondary: "#0e9f6e",
  danger: "#e02424",
  warning: "#c27803",
  bg: "#f9fafb",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  muted: "#6b7280",
};

export const SERVICES = {
  "SING Logiciels": ["Assistance Technique elab", "Développement informatique", "Service Cloud", "Gestion Messagerie", "Autres logiciels"],
  "SING Conseil": ["Innovation Day", "Retraite d'Innovation Stratégique", "Entreprise en Mode Startup", "Cellule d'Efficience Opérationnelle", "Assistance Maîtrise Ouvrage", "Autres conseil"],
  "Incubateur": ["Mise à disposition de salle", "Mise à disposition Bureaux", "Mise à Disposition Coworking", "Autres incubateur"],
  "Programme": ["Appuis à l'Exécution des Projets Techlinic", "Assistance technique Hackaton", "Assistance technique Programme Cohorte", "Autres programme"],
};

export const PRODUCTS = [
  { code: "S1", label: "Assistance technique - Programme crysalis", prix: 1119, categorie: "Programme" },
  { code: "S2", label: "Assistance technique – Programme 3 mois – 5 bénéficiaires", prix: 8886, categorie: "SING Logiciels" },
  { code: "S3", label: "Organisation comité de sélection et attribution de fonds", prix: 500074, categorie: "Programme" },
];

export const CLIENTS = [
  { nom: "SING", adresse: "BP. 2280, Centre Ville, Libreville – Gabon", tel: "+241 74 13 71 03", pays: "Gabon" },
  { nom: "Emmanuel Edgardo", adresse: "10, rue Cambacérès 75008 Paris", tel: "01 42 66 68 49", pays: "Gabon" },
  { nom: "Gracia Cestin", adresse: "BP 65054 31033 Toulouse", tel: "01 58 22 17 10", pays: "Gabon" },
];

export const TAXES = { tps: 0.095, css: 0.01, remise: 0.095 };

export const SAMPLE_FACTURES = [
  { id: "2026/02/001", date: "09/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 2505965, statut: "Active", netAPayer: 2075126.97, solde: 2075126.97 },
  { id: "2026/02/001", date: "17/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 5595, statut: "Annulée", netAPayer: 4633.08, solde: 4633.08 },
  { id: "2026/02/002", date: "20/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 2005891, statut: "Active", netAPayer: 1661028.19, solde: 1661028.19 },
];
