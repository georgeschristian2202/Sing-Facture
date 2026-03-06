# 🏗️ Architecture du Projet FacturePro

## Vue d'ensemble

FacturePro est une application web React de gestion commerciale complète, basée sur les spécifications du fichier ApplicationV2.xlsm de SING S.A.

## Structure des fichiers

```
Sing-Facture/
├── files/                          # Fichiers sources originaux
│   ├── SING_GestionFacturation_Web.jsx
│   ├── SING_LandingPage.jsx
│   └── SING_SpecV2_Complete.docx
├── src/
│   ├── data/
│   │   └── constants.js           # Données partagées (produits, clients, taxes)
│   ├── pages/
│   │   ├── Dashboard.jsx          # Application de gestion
│   │   └── LandingPage.jsx        # Page marketing
│   ├── utils/
│   │   └── format.js              # Fonctions utilitaires (formatage)
│   └── main.jsx                   # Point d'entrée React
├── index.html                      # Template HTML
├── package.json                    # Dépendances npm
├── vite.config.js                 # Configuration Vite
├── README.md                       # Documentation principale
├── DEMARRAGE.md                   # Guide de démarrage
└── ARCHITECTURE.md                # Ce fichier

```

## Flux de l'application

### 1. Landing Page (/)
- Page marketing avec présentation des fonctionnalités
- Sections : Hero, Features, Config, Pricing, Testimonials
- Modal d'inscription
- Navigation vers le Dashboard

### 2. Dashboard (/app)
Cycle commercial complet :

```
📋 Devis → 📦 Bon de Commande → 🚚 Bon de Livraison → 🧾 Facture → 📈 Récapitulatif
```

#### Modules du Dashboard :

1. **Tableau de bord** : Vue d'ensemble avec KPIs
2. **Devis** : Création de devis depuis le catalogue
3. **Bons de commande** : Transformation des devis
4. **Bons de livraison** : Suivi des livraisons
5. **Factures** : Génération avec calculs fiscaux
6. **Récapitulatif** : Vue consolidée et exports
7. **Clients** : Gestion de la base clients
8. **Catalogue** : Gestion des prestations
9. **Paramètres** : Configuration (taxes, RIB, logo)

## Calculs fiscaux (Gabon)

```javascript
Solde HT = Σ (Quantité × Prix unitaire)
Remise = Solde HT × 9,5%
Sous-total 2 = Solde HT - Remise
TPS = Sous-total 2 × 9,5%
CSS = Sous-total 2 × 1%
Net à payer = Sous-total 2 - TPS - CSS
```

## Données

### Constantes (src/data/constants.js)

- **COLORS** : Palette de couleurs de l'application
- **SERVICES** : 4 catégories de services (SING Logiciels, SING Conseil, Incubateur, Programme)
- **PRODUCTS** : Catalogue des prestations avec codes, prix, descriptions
- **CLIENTS** : Base de données clients
- **TAXES** : Configuration fiscale (TPS 9,5%, CSS 1%, Remise 9,5%)
- **SAMPLE_FACTURES** : Exemples de factures pour la démo

## Composants principaux

### Dashboard.jsx

- **Sidebar** : Navigation entre les modules
- **Dashboard** : Tableau de bord avec KPIs et dernières factures
- **DocumentForm** : Formulaire générique pour devis/commandes/livraisons/factures
- **RecapPage** : Récapitulatif avec tableau détaillé
- **ClientsPage** : Gestion clients
- **CataloguePage** : Catalogue des prestations
- **ParametresPage** : Configuration entreprise et fiscalité

### LandingPage.jsx

- **Navbar** : Navigation avec effet scroll
- **Hero** : Section principale avec animation du flux
- **Features** : Présentation des 6 fonctionnalités clés
- **ConfigSection** : Démo du paramétrage (onglets)
- **Pricing** : 3 plans tarifaires
- **Testimonials** : Témoignages clients
- **Modal** : Formulaire d'inscription en 2 étapes
- **Footer** : Pied de page avec liens

## Technologies

- **React 18.3** : Framework UI avec hooks
- **React Router 6** : Navigation SPA
- **Vite 5** : Build tool ultra-rapide
- **Inline Styles** : Pas de CSS externe, tout en JS

## Prochaines évolutions

### Phase 1 : Backend
- [ ] API REST (Node.js/Express ou Python/FastAPI)
- [ ] Base de données (PostgreSQL ou MongoDB)
- [ ] Authentification JWT
- [ ] Gestion des sessions

### Phase 2 : Fonctionnalités avancées
- [ ] Génération PDF (jsPDF ou PDFKit)
- [ ] Export Excel (xlsx)
- [ ] Envoi email automatique
- [ ] Notifications en temps réel
- [ ] Multi-utilisateurs avec rôles

### Phase 3 : Optimisations
- [ ] State management (Zustand ou Redux)
- [ ] Cache et optimisation des requêtes
- [ ] Tests unitaires et E2E
- [ ] CI/CD
- [ ] Déploiement cloud

## Conventions de code

- Composants en PascalCase
- Fichiers .jsx pour les composants React
- Constantes en UPPER_SNAKE_CASE
- Fonctions en camelCase
- Commentaires en français
- Inline styles pour la cohérence

## Contact

SING S.A.
- Email : info@sing.ga
- Téléphone : +241 74 13 71 03
- Adresse : BP. 2280, Centre Ville, Libreville – Gabon
