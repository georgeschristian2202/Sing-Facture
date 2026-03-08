# Spécification Dashboard Moderne - SING FacturePro

## 🎯 Objectif
Créer un dashboard web moderne qui remplace l'application Excel tout en conservant toute la logique métier.

## 📋 Modules Principaux

### 1. Dashboard (Accueil)
- Vue d'ensemble des statistiques
- Graphiques CA par mois
- Factures récentes
- Alertes et notifications

### 2. Gestion des Documents
#### 2.1 Devis (DEV)
- Création avec numéro automatique: DEV2025/01/001
- Sélection client
- Ajout de produits/packs
- Calculs automatiques
- Export PDF
- Conversion en commande

#### 2.2 Bons de Commande (BC)
- Création avec numéro automatique: BC2025/01/001
- Depuis devis ou création directe
- Export PDF
- Conversion en livraison

#### 2.3 Bons de Livraison (BL)
- Création avec numéro automatique: BL2025/01/001
- Depuis commande ou création directe
- Export PDF
- Conversion en facture

#### 2.4 Factures (FAC)
- Création avec numéro automatique: FAC2025/01/001
- Calculs TPS (9.5%) + CSS (1%)
- Remise
- Export PDF
- Alimentation automatique du récapitulatif

### 3. Récapitulatif
- Vue consolidée de toutes les factures
- Répartition par sous-services
- Suivi des règlements
- Calcul des soldes dus
- Filtres et recherche
- Export Excel

### 4. Gestion des Produits/Packs
- Catalogue de produits
- Système de PACKS avec détails
- Prix unitaires
- Catégories/Sous-services
- Import/Export

### 5. Gestion des Clients
- Fiche client complète
- Historique des documents
- Statistiques par client

### 6. Paramètres
- Informations entreprise
- Taux (TPS, CSS, TVA, Remise)
- Chemins d'export PDF
- RIB bancaires
- Utilisateurs

## 🎨 Design Moderne

### Couleurs SING
- Primary: #8E0B56 (Magenta)
- Secondary: #DFC52F (Jaune)
- Accent: #00758D (Turquoise)
- Tertiary: #5C4621 (Marron)

### Composants UI
- Cards avec ombres
- Tableaux interactifs
- Formulaires modernes
- Modals pour création/édition
- Notifications toast
- Graphiques Chart.js

## 🔢 Logique de Calcul

### Formules Facture
```
Solde HT = Σ (Prix Unitaire × Quantité)
Remise = Solde HT × Taux Remise (9.5%)
Sous-total 2 = Solde HT - Remise
TPS = Sous-total 2 × 9.5%
CSS = Sous-total 2 × 1%
Net à payer = Sous-total 2 + TPS + CSS
Solde dû = Net à payer - Règlement
```

### Numérotation Automatique
Format: `<PREFIX><AAAA>/<MM>/<NNN>`
- DEV2025/01/001 (Devis)
- BC2025/01/002 (Bon de Commande)
- BL2025/01/003 (Bon de Livraison)
- FAC2025/01/004 (Facture)

Compteur réinitialisé chaque mois.

## 📊 Base de Données

### Tables Existantes
- organisations
- users
- clients
- produits
- documents (devis, commandes, livraisons, factures)
- lignes_document
- parametres

### Nouvelles Tables Nécessaires
- packs (codes produits avec sous-services)
- pack_details (détails des packs)
- recapitulatif (vue consolidée factures)

## 🚀 Fonctionnalités Avancées

### Export PDF
- Template HTML/CSS
- Génération côté serveur (PDFKit)
- Logo entreprise
- Mise en page professionnelle

### Workflow Documents
```
Devis → Bon de Commande → Bon de Livraison → Facture → Récapitulatif
```

### Récapitulatif Automatique
Lors de l'enregistrement d'une facture:
1. Extraire les montants
2. Répartir par sous-service
3. Créer ligne dans récapitulatif
4. Statut: Active/Payée/Annulée

## 📱 Responsive Design
- Desktop first
- Tablette adapté
- Mobile fonctionnel

## 🔐 Sécurité
- Authentification JWT
- Permissions par rôle
- Isolation multi-tenant
- Validation des données

## 📈 Prochaines Étapes

1. ✅ Créer les nouvelles tables (packs, récapitulatif)
2. ✅ Créer les routes API backend
3. ✅ Créer les composants frontend
4. ✅ Implémenter la logique de calcul
5. ✅ Implémenter l'export PDF
6. ✅ Créer le récapitulatif
7. ✅ Tests et validation
