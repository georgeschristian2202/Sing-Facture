# 🚀 Guide de Démarrage Rapide

## Installation des dépendances

```bash
npm install
```

## Lancement en mode développement

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur **http://localhost:3000**

## Structure de l'application

### Routes disponibles

- **/** : Page d'accueil (Landing Page marketing)
- **/app** : Application de gestion (Dashboard)

### Pages principales

1. **Landing Page** (`src/pages/LandingPage.jsx`)
   - Page marketing avec présentation des fonctionnalités
   - Formulaire d'inscription
   - Tarifs et témoignages

2. **Dashboard** (`src/pages/Dashboard.jsx`)
   - Tableau de bord avec KPIs
   - Gestion des devis, commandes, livraisons, factures
   - Récapitulatif financier
   - Gestion clients et catalogue
   - Paramètres (taxes, RIB, logo)

### Données

Les données de démonstration sont dans `src/data/constants.js` :
- Catalogue de prestations (PRODUCTS)
- Clients (CLIENTS)
- Factures exemples (SAMPLE_FACTURES)
- Services par catégorie (SERVICES)
- Configuration fiscale (TAXES)

## Fonctionnalités implémentées

✅ Navigation entre Landing Page et Dashboard
✅ Tableau de bord avec statistiques
✅ Création de devis/commandes/livraisons/factures
✅ Calculs automatiques (TPS 9,5% + CSS 1% + Remise 9,5%)
✅ Récapitulatif avec export
✅ Gestion clients
✅ Catalogue de prestations
✅ Paramètres personnalisables

## Prochaines étapes

Pour aller plus loin, vous pouvez :
- Connecter à une vraie base de données
- Ajouter l'authentification utilisateur
- Implémenter la génération de PDF
- Ajouter l'export Excel
- Créer une API backend

## Technologies utilisées

- **React 18** : Framework UI
- **Vite** : Build tool rapide
- **React Router** : Navigation
- **Inline Styles** : Pas de dépendances CSS externes

## Support

Pour toute question : info@sing.ga
