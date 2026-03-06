# 🎨 Guide Visuel - FacturePro

## 📱 Aperçu de l'application

### Landing Page (Page d'accueil)

```
┌─────────────────────────────────────────────────────────┐
│  🧾 FacturePro    Fonctionnalités  Tarifs  Témoignages │
│                                    [Connexion] [Essai]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│         Votre cycle commercial complet,                 │
│         du devis à la facture                           │
│                                                          │
│    📋 Devis → 📦 Commande → 🚚 Livraison → 🧾 Facture  │
│                                                          │
│         [Commencer gratuitement →]  [📺 Voir la démo]  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  FONCTIONNALITÉS                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 📋 Devis │ │ 📦 Bons  │ │ 🚚 Livr. │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 🧾 Fact. │ │ 📈 Récap │ │ ⚙️ Param │               │
│  └──────────┘ └──────────┘ └──────────┘               │
├─────────────────────────────────────────────────────────┤
│  TARIFS                                                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Starter │  │ Business │  │Enterprise│              │
│  │15 000 F │  │ 45 000 F │  │Sur devis │              │
│  └─────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Dashboard (Application)

```
┌──────────┬──────────────────────────────────────────────┐
│          │  📊 Tableau de bord                          │
│ 🧾 SING  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│          │  │Factures  │ │   CA     │ │  Solde   │    │
│ 📊 Dash  │  │    2     │ │2 075 127 │ │2 075 127 │    │
│ 📋 Devis │  └──────────┘ └──────────┘ └──────────┘    │
│ 📦 Comm. │                                              │
│ 🚚 Livr. │  🔄 Flux : Devis → Commande → Livraison →   │
│ 🧾 Fact. │                                              │
│ 📈 Récap │  ┌────────────────────────────────────────┐ │
│ 👥 Clien │  │ Dernières factures                     │ │
│ 🗂️ Catal │  │ N°          Date      Montant   Statut │ │
│ ⚙️ Param │  │ 2026/02/001 09/02  2 075 127  [Active]│ │
│          │  │ 2026/02/002 20/02  1 661 028  [Active]│ │
│          │  └────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

## 🔄 Flux de travail

### Création d'une facture (étape par étape)

```
1️⃣ SÉLECTION CLIENT
┌─────────────────────────┐
│ Client: [SING ▼]        │
│ Référence: BC-2026-001  │
└─────────────────────────┘
         ↓
2️⃣ AJOUT PRESTATIONS
┌─────────────────────────────────────────┐
│ Code  Description         Qté  Prix     │
│ [S1▼] Programme crysalis  [1]  [1119]   │
│ [+] Ajouter une ligne                   │
└─────────────────────────────────────────┘
         ↓
3️⃣ CALCULS AUTOMATIQUES
┌─────────────────────────┐
│ Solde HT      : 1 119   │
│ Remise (9,5%) : -106    │
│ Sous-total 2  : 1 013   │
│ TPS (9,5%)    : -96     │
│ CSS (1%)      : -10     │
│ ─────────────────────   │
│ Net à payer   : 907 F   │
└─────────────────────────┘
         ↓
4️⃣ ENREGISTREMENT
┌─────────────────────────┐
│ [💾 Enregistrer & PDF]  │
└─────────────────────────┘
```

## 📊 Calculs fiscaux détaillés

### Exemple avec 100 000 FCFA HT

```
┌─────────────────────────────────────────┐
│  CALCUL FISCAL GABON                    │
├─────────────────────────────────────────┤
│  Solde HT                  100 000 FCFA │
│  ├─ Remise 9,5%            -9 500 FCFA  │
│  └─ Sous-total 2           90 500 FCFA  │
│                                          │
│  Sous-total 2              90 500 FCFA  │
│  ├─ TPS 9,5%               -8 598 FCFA  │
│  └─ CSS 1%                   -905 FCFA  │
│                                          │
│  ═══════════════════════════════════════ │
│  NET À PAYER               80 997 FCFA  │
└─────────────────────────────────────────┘

Formule :
Net = HT × (1 - 0.095) × (1 - 0.095 - 0.01)
Net = HT × 0.905 × 0.895
Net = HT × 0.80997
```

## 🗂️ Structure des données

### Prestation (Produit)

```javascript
{
  code: "S1",                    // Code unique
  label: "Assistance technique", // Description courte (PDF)
  prix: 1119,                    // Prix unitaire HT
  categorie: "Programme"         // Catégorie de service
}
```

### Client

```javascript
{
  nom: "SING",                   // Nom du client
  adresse: "BP. 2280...",        // Adresse complète
  tel: "+241 74 13 71 03",       // Téléphone
  pays: "Gabon"                  // Pays
}
```

### Facture

```javascript
{
  id: "2026/02/001",             // Numéro auto (AAAA/MM/NNN)
  date: "09/02/2026",            // Date d'émission
  client: "SING",                // Nom du client
  designation: "...",            // Description
  ht: 2505965,                   // Montant HT
  statut: "Active",              // Active/Annulée
  netAPayer: 2075126.97,         // Montant net
  solde: 2075126.97              // Solde restant
}
```

## 🎨 Palette de couleurs

```
┌─────────────────────────────────────────┐
│  COULEURS PRINCIPALES                   │
├─────────────────────────────────────────┤
│  🔵 Bleu primaire    #3b82f6            │
│  🟣 Violet           #8b5cf6            │
│  🟢 Vert (succès)    #10b981            │
│  🔴 Rouge (danger)   #ef4444            │
│  🟡 Orange (warning) #f59e0b            │
│  ⚫ Dark background  #0a0e1a            │
│  ⚪ Texte clair      #f1f5f9            │
│  🔘 Texte muted      #64748b            │
└─────────────────────────────────────────┘
```

## 📁 Organisation des fichiers

```
src/
├── main.jsx                    # 🚀 Point d'entrée
│   └─> Routes (/, /app)
│
├── pages/
│   ├── LandingPage.jsx         # 🏠 Page marketing
│   │   ├─> Navbar
│   │   ├─> Hero
│   │   ├─> Features
│   │   ├─> ConfigSection
│   │   ├─> Pricing
│   │   ├─> Testimonials
│   │   ├─> Modal
│   │   └─> Footer
│   │
│   └── Dashboard.jsx           # 📊 Application
│       ├─> Sidebar
│       ├─> Dashboard (KPIs)
│       ├─> DocumentForm
│       ├─> RecapPage
│       ├─> ClientsPage
│       ├─> CataloguePage
│       └─> ParametresPage
│
├── data/
│   └── constants.js            # 📦 Données
│       ├─> COLORS
│       ├─> SERVICES
│       ├─> PRODUCTS
│       ├─> CLIENTS
│       ├─> TAXES
│       └─> SAMPLE_FACTURES
│
└── utils/
    └── format.js               # 🔧 Utilitaires
        └─> fmt() - Format FCFA
```

## 🔐 Modules du Dashboard

```
┌────────────────────────────────────────┐
│  MODULE          FONCTION              │
├────────────────────────────────────────┤
│  📊 Dashboard    Vue d'ensemble + KPIs │
│  📋 Devis        Création devis        │
│  📦 Commandes    Bons de commande      │
│  🚚 Livraisons   Bons de livraison     │
│  🧾 Factures     Facturation           │
│  📈 Récap        Vue consolidée        │
│  👥 Clients      Gestion clients       │
│  🗂️ Catalogue    Prestations           │
│  ⚙️ Paramètres   Configuration         │
└────────────────────────────────────────┘
```

## 📈 KPIs affichés

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Factures actives│  CA net          │  Solde en attente│
│       2          │  2 075 127 F     │  2 075 127 F     │
└──────────────────┴──────────────────┴──────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│  TPS 9,5%        │  CSS 1%          │  Remise 9,5%     │
│  Taxe services   │  Solidarité      │  Par défaut      │
└──────────────────┴──────────────────┴──────────────────┘
```

## 🎯 Catégories de services

```
┌─────────────────────────────────────────┐
│  SING Logiciels                         │
│  • Assistance Technique elab            │
│  • Développement informatique           │
│  • Service Cloud                        │
│  • Gestion Messagerie                   │
│  • Autres logiciels                     │
├─────────────────────────────────────────┤
│  SING Conseil                           │
│  • Innovation Day                       │
│  • Retraite d'Innovation Stratégique    │
│  • Entreprise en Mode Startup           │
│  • Cellule d'Efficience Opérationnelle  │
│  • Assistance Maîtrise Ouvrage          │
│  • Autres conseil                       │
├─────────────────────────────────────────┤
│  Incubateur                             │
│  • Mise à disposition de salle          │
│  • Mise à disposition Bureaux           │
│  • Mise à Disposition Coworking         │
│  • Autres incubateur                    │
├─────────────────────────────────────────┤
│  Programme                              │
│  • Appuis Exécution Projets Techlinic   │
│  • Assistance technique Hackaton        │
│  • Assistance technique Programme       │
│  • Autres programme                     │
└─────────────────────────────────────────┘
```

## 🚀 Commandes rapides

```bash
# Installation
npm install

# Développement
npm run dev          # → http://localhost:3000

# Production
npm run build        # → dist/
npm run preview      # Test du build

# Maintenance
npm update           # Mise à jour
npm outdated         # Vérifier versions
```

## 📞 Informations entreprise

```
┌─────────────────────────────────────────┐
│  SING S.A.                              │
├─────────────────────────────────────────┤
│  📍 BP. 2280, Centre Ville              │
│     Libreville – Gabon                  │
│  📞 +241 74 13 71 03                    │
│  📧 info@sing.ga                        │
│  🌐 https://www.sing.ga/                │
│  🏢 RCCM : RG LBV 2018B22204            │
│  💰 Capital : 50 000 000 FCFA           │
├─────────────────────────────────────────┤
│  🏦 RIB Bancaires                       │
│  • UBA Gabon                            │
│    40025 05801 80100300296 81           │
│  • AFG Bank                             │
│    40001 09070 07000615101 36           │
└─────────────────────────────────────────┘
```

---

**Guide visuel FacturePro - Pour une compréhension rapide ! 🎨**
