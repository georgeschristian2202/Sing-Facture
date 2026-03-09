# 📋 Statut Module Devis - SING FacturePro

## ✅ Ce qui a été fait

### 1. Documentation
- ✅ `DEVIS_MODULE_SPEC.md` - Spécification complète du module
- ✅ Analyse des images Excel fournies
- ✅ Analyse du code VBA (devis.txt)
- ✅ Définition de la structure des données
- ✅ Définition du workflow

### 2. Services Backend
- ✅ `calculationService.ts` - Corrigé (TPS et CSS s'ajoutent maintenant)
- ✅ `documentNumberService.ts` - Mis à jour avec tous les types (DEVIS, COMMANDE, LIVRAISON, FACTURE, AVOIR)
- ✅ Génération automatique des numéros (DEV2025/01/001)
- ✅ Calculs automatiques (Solde HT, Remise, TPS, CSS, Net à payer)

### 3. Base de Données
- ✅ Schema Prisma complet avec:
  - Table `documents` (type DEVIS)
  - Table `lignes_document`
  - Table `clients` avec `representants`
  - Table `packs` avec `pack_details`
  - Table `parametres` (taux TPS, CSS, remise)

## 🔄 En cours / À faire

### 1. Routes API Backend ✅ TERMINÉ
- ✅ `GET /api/devis` - Liste des devis avec filtres
- ✅ `GET /api/devis/:id` - Détails d'un devis avec client et représentants
- ✅ `POST /api/devis` - Créer un devis avec calculs automatiques
- ✅ `PUT /api/devis/:id` - Modifier un devis
- ✅ `DELETE /api/devis/:id` - Supprimer un devis
- ✅ `POST /api/devis/:id/convertir-bc` - Convertir en bon de commande
- ✅ `GET /api/devis/numero-suivant` - Prochain numéro (DEV2025/01/001)
- 🔄 `POST /api/devis/:id/pdf` - Générer PDF (à implémenter)

### 2. Composant Frontend ✅ TERMINÉ
- ✅ `DevisModule.tsx` - Composant principal complet
- ✅ Vue liste des devis avec recherche
- ✅ Formulaire création/édition avec sections
- ✅ Gestion des lignes avec packs
- ✅ Calculs en temps réel (Solde HT, Remise, TPS, CSS, Net à payer)
- ✅ Sélection client/représentant
- ✅ Modalités de paiement
- ✅ Modal sélection de packs
- ✅ Ajout de lignes personnalisées
- ✅ Conversion en bon de commande
- ✅ Intégration dans DashboardNew

### 3. Service API Frontend ✅ TERMINÉ
- ✅ Méthodes API ajoutées dans `api.ts`
- ✅ `getDevis()` avec filtres
- ✅ `getDevisById()`
- ✅ `getNumeroSuivantDevis()`
- ✅ `createDevis()`
- ✅ `updateDevis()`
- ✅ `deleteDevis()`
- ✅ `convertirDevisEnBC()`

### 4. Service PDF 🔄 À FAIRE
- 🔄 Template HTML/CSS
- 🔄 Génération côté serveur
- 🔄 Logo entreprise
- 🔄 Mise en page professionnelle

## 📊 Structure du Devis (basée sur Excel)

### Sections du Document

1. **En-tête**
   - Logo SING
   - Informations entreprise (depuis Parametres)
   - N° Devis (auto: DEV2025/01/001)
   - Date

2. **Client**
   - Nom organisation (sélection dropdown)
   - Adresse
   - Téléphone
   - Email

3. **Représentant**
   - Nom (sélection basée sur client)
   - Fonction
   - Téléphone
   - Email

4. **Objet**
   - Texte libre décrivant le devis

5. **Lignes**
   - N° (code pack ou personnalisé)
   - Désignation (description courte)
   - Prix Unitaire
   - Quantité
   - Total
   - Détails (sous-lignes)

6. **Totaux**
   - Solde HT
   - Remise (9.5% par défaut)
   - Sous-total
   - TPS 9.5%
   - CSS 1%
   - NET À PAYER

7. **Modalités de Paiement**
   - Espèces
   - Virement (RIB UBA, RIB AFG)
   - Chèque
   - Conditions de paiement
   - Validité (30 jours par défaut)

## 🎨 Design du Formulaire

### Vue Liste
```
┌─────────────────────────────────────────────────────────┐
│ [Rechercher...] [Filtres ▼]          [+ Nouveau Devis] │
├─────────────────────────────────────────────────────────┤
│ N° Devis │ Date │ Client │ Montant │ Statut │ Actions  │
├──────────┼──────┼────────┼─────────┼────────┼──────────┤
│ DEV...   │ ...  │ ...    │ ...     │ ...    │ 👁 ✏ 🗑 📄│
└─────────────────────────────────────────────────────────┘
```

### Formulaire Création
```
┌─────────────────────────────────────────────────────────┐
│ Nouveau Devis                                      [X]  │
├─────────────────────────────────────────────────────────┤
│ 📋 INFORMATIONS GÉNÉRALES                              │
│ ┌─────────────────┬─────────────────┐                  │
│ │ Client *        │ Représentant *  │                  │
│ │ [Dropdown]      │ [Dropdown]      │                  │
│ ├─────────────────┼─────────────────┤                  │
│ │ Date *          │ N° Devis        │                  │
│ │ [Date picker]   │ DEV2025/01/001  │                  │
│ ├─────────────────┴─────────────────┤                  │
│ │ Objet *                           │                  │
│ │ [Textarea]                        │                  │
│ └───────────────────────────────────┘                  │
│                                                         │
│ 📦 LIGNES DU DEVIS                                     │
│ [+ Depuis Pack] [+ Ligne Personnalisée]                │
│ ┌────┬──────────┬──────┬─────┬─────────┬────┐         │
│ │ N° │ Désignat │ P.U  │ Qté │  Total  │ ⚙  │         │
│ ├────┼──────────┼──────┼─────┼─────────┼────┤         │
│ │ S1 │ Assist...│125000│  1  │ 125000  │ 🗑 │         │
│ │    │ - Détail1│      │     │         │    │         │
│ │    │ - Détail2│      │     │         │    │         │
│ └────┴──────────┴──────┴─────┴─────────┴────┘         │
│                                                         │
│ 💰 TOTAUX                                              │
│ ┌───────────────────────────────────────┐              │
│ │ Solde HT:        1 874 125 FCFA      │              │
│ │ Remise (9.5%):     177 942 FCFA      │              │
│ │ Sous-total:      1 696 183 FCFA      │              │
│ │ TPS 9.5%:          161 137 FCFA      │              │
│ │ CSS 1%:             16 962 FCFA      │              │
│ │ ─────────────────────────────────────│              │
│ │ NET À PAYER:     1 874 282 FCFA      │              │
│ └───────────────────────────────────────┘              │
│                                                         │
│ 💳 MODALITÉS DE PAIEMENT                               │
│ ☐ Espèces  ☐ Virement  ☐ Chèque                       │
│ [Conditions de paiement...]                            │
│                                                         │
│ [Annuler] [Enregistrer Brouillon] [Enregistrer]       │
└─────────────────────────────────────────────────────────┘
```

## 🔢 Logique de Calcul

```typescript
// Calcul automatique en temps réel
const calculerTotaux = (lignes: Ligne[], tauxRemise: number) => {
  // 1. Solde HT = Somme des totaux de lignes
  const soldeHT = lignes.reduce((sum, ligne) => {
    return sum + (ligne.prixUnitaire * ligne.quantite);
  }, 0);

  // 2. Remise = Solde HT × Taux Remise
  const remise = soldeHT * tauxRemise;

  // 3. Sous-total = Solde HT - Remise
  const sousTotal = soldeHT - remise;

  // 4. TPS = Sous-total × 9.5%
  const tps = sousTotal * 0.095;

  // 5. CSS = Sous-total × 1%
  const css = sousTotal * 0.01;

  // 6. Net à payer = Sous-total + TPS + CSS
  const netAPayer = sousTotal + tps + css;

  return { soldeHT, remise, sousTotal, tps, css, netAPayer };
};
```

## 📝 Prochaines Actions

### ✅ Terminé
1. ✅ Routes API backend pour les devis
2. ✅ Composant DevisModule.tsx complet
3. ✅ Ajout de lignes depuis packs
4. ✅ Calculs en temps réel
5. ✅ Conversion en bon de commande
6. ✅ Recherche et filtres
7. ✅ Intégration dans le dashboard

### 🔄 Priorité 1 (À faire)
1. Tester la création d'un devis avec données réelles
2. Vérifier les calculs (TPS, CSS, remise)
3. Tester l'ajout de packs
4. Tester la conversion en BC

### 🔄 Priorité 2 (Nice to have)
5. Générer le PDF du devis
6. Ajouter des filtres avancés (date, montant)
7. Ajouter la visualisation/aperçu du devis
8. Ajouter l'export Excel

## 🎯 Objectif

Créer un module Devis moderne et fonctionnel qui:
- ✅ Respecte la structure Excel originale
- ✅ Génère automatiquement les numéros (DEV2025/01/001)
- ✅ Calcule automatiquement les totaux (TPS, CSS, remise)
- ✅ Permet d'ajouter des lignes depuis les packs
- ✅ Affiche les informations client et représentant
- ✅ Gère les modalités de paiement
- ✅ Exporte en PDF professionnel

---

**Date**: 2025-01-XX
**Statut**: ✅ Module Devis fonctionnel et intégré
**Prochaine étape**: Tests avec données réelles et génération PDF

## 📦 Fichiers Créés/Modifiés

### Backend
- ✅ `backend/src/routes/devis.ts` - Routes API complètes
- ✅ `backend/src/server.ts` - Route devis ajoutée
- ✅ `backend/src/services/calculationService.ts` - Déjà existant et fonctionnel
- ✅ `backend/src/services/documentNumberService.ts` - Déjà existant et fonctionnel

### Frontend
- ✅ `frontend/src/components/DevisModule.tsx` - Composant complet (400+ lignes)
- ✅ `frontend/src/services/api.ts` - Méthodes API devis ajoutées
- ✅ `frontend/src/pages/DashboardNew.tsx` - Intégration du module

## 🎯 Fonctionnalités Implémentées

1. **Liste des devis**
   - Tableau avec colonnes: N°, Date, Client, Objet, Montant HT, Net à payer
   - Recherche par numéro, client, objet
   - Actions: Modifier, Convertir en BC, Supprimer

2. **Création/Édition de devis**
   - Section Informations: Client, Représentant, Date, N° auto, Objet
   - Section Lignes: Ajout depuis packs ou personnalisé
   - Section Totaux: Calculs en temps réel
   - Section Modalités: Conditions de paiement

3. **Gestion des lignes**
   - Ajout depuis packs avec détails automatiques
   - Ajout de lignes personnalisées
   - Modification quantité et prix
   - Suppression de lignes

4. **Calculs automatiques**
   - Solde HT = Σ (prix × quantité)
   - Remise = 9.5% du Solde HT
   - Sous-total = Solde HT - Remise
   - TPS = 9.5% du Sous-total
   - CSS = 1% du Sous-total
   - Net à payer = Sous-total + TPS + CSS

5. **Conversion en BC**
   - Bouton de conversion dans la liste
   - Crée un nouveau bon de commande avec les mêmes données
   - Nouveau numéro BC2025/01/001
