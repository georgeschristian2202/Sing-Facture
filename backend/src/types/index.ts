export interface User {
  id: number;
  email: string;
  password: string;
  nom: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Client {
  id: number;
  nom: string;
  adresse?: string;
  tel?: string;
  email?: string;
  pays: string;
  created_at: string;
}

export interface Produit {
  id: number;
  code: string;
  label: string;
  prix: number;
  categorie: string;
  description?: string;
  actif: number;
  created_at: string;
}

export interface Document {
  id: number;
  type: 'devis' | 'facture' | 'avoir';
  numero: string;
  client_id: number;
  date: string;
  reference?: string;
  solde_ht: number;
  remise: number;
  sous_total: number;
  tps: number;
  css: number;
  net_a_payer: number;
  solde_du: number;
  statut: 'Active' | 'Payée' | 'Annulée';
  conditions_paiement?: string;
  created_at: string;
}

export interface LigneDocument {
  id: number;
  document_id: number;
  produit_id: number;
  designation: string;
  quantite: number;
  prix_unitaire: number;
  total_ht: number;
}

export interface Parametres {
  id: number;
  nom_entreprise: string;
  adresse: string;
  telephone: string;
  email: string;
  site_web: string;
  rccm: string;
  capital: string;
  taux_tps: number;
  taux_css: number;
  taux_tva: number;
  taux_remise: number;
  rib_uba: string;
  rib_afg: string;
}
