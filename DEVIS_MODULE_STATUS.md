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

### 1. Routes API Backend
- 🔄 `GET /api/devis` - Liste des devis
- 🔄 `GET /api/devis/:id` - Détails d'un devis
- 🔄 `POST /api/devis` - Créer un devis
- 🔄 `PUT /api/devis/:id` - Modifier un devis
- 🔄 `DELETE /api/devis/:id` - Supprimer un devis
- 🔄 `POST /api/devis/:id/pdf` - Générer PDF
- 🔄 `POST /api/devis/:id/convertir-bc` - Convertir en BC
- 🔄 `GET /api/devis/numero-suivant` - Prochain numéro

### 2. Composant Frontend
- 🔄 `DevisModule.tsx` - Composant principal (commencé)
- 🔄 Vue liste des devis
- 🔄 Formulaire création/édition
- 🔄 Modal aperçu
- 🔄 Gestion des lignes avec packs
- 🔄 Calculs en temps réel
- 🔄 Sélection client/représentant
- 🔄 Modalités de paiement

### 3. Service PDF
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

### Priorité 1 (Urgent)
1. Créer les routes API backend pour les devis
2. Compléter le composant DevisModule.tsx
3. Tester la création d'un devis simple

### Priorité 2 (Important)
4. Implémenter l'ajout de lignes depuis packs
5. Implémenter les calculs en temps réel
6. Tester avec des données réelles

### Priorité 3 (Nice to have)
7. Générer le PDF
8. Convertir en bon de commande
9. Filtres et recherche avancés

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
**Statut**: Services backend prêts, composant frontend à compléter
**Prochaine étape**: Créer les routes API et compléter le composant
