# Guide Complet - Modalités, Conditions et RIB dans le Module Devis

## Vue d'ensemble

Le module Devis a été amélioré pour inclure 3 sections distinctes de gestion des informations de paiement, similaires à l'interface Excel. Toutes les données sont récupérées depuis la base de données (table `parametres`).

## Les 3 Sections

### 1. Modalités de Paiement Espèces à l'ordre de SING

Cette section permet de sélectionner les **moyens de paiement** acceptés:
- Espèces
- Chèque
- Virement
- Carte bancaire
- etc.

**Source des données**: `parametres.modalitesPaiement` (JSON array)

### 2. Conditions de Paiement

Cette section permet de définir les **conditions et échéances** de paiement:
- Paiement à 30 jours
- Paiement à 60 jours
- Paiement comptant
- Acompte 30% dès validation de l'offre
- Solde 50% - livrable final
- etc.

**Source des données**: `parametres.conditionsPaiement` (JSON array)

### 3. Coordonnées Bancaires (RIB)

Cette section permet de sélectionner les **RIB** à afficher sur le devis:
- UBA Gabon: 40001 03001 00100200296 81
- AFG Bank: 50002 04002 00200300397 92
- etc.

**Source des données**: `parametres.ribs` (JSON array)

## Fonctionnalités Communes

Chaque section offre les mêmes fonctionnalités:

### Sélection depuis la liste
- Liste déroulante avec les options prédéfinies depuis la base de données
- Sélection multiple possible
- Prévention des doublons automatique

### Ajout manuel
1. Cliquez sur le bouton "+"
2. Saisissez votre texte personnalisé
3. Cliquez sur "OK" pour valider ou "✕" pour annuler

### Gestion des éléments sélectionnés
- Affichage dans une liste claire
- Suppression individuelle avec le bouton "✕"
- Ordre de sélection préservé

## Format d'enregistrement

Lors de l'enregistrement du devis, les 3 sections sont combinées dans le champ `conditionsPaiement` avec le format suivant:

```
Modalités: Espèces, Chèque | Conditions: Paiement à 30 jours, Acompte 30% | RIB: UBA Gabon: 40001 03001 00100200296 81
```

**Format**: `Modalités: [liste] | Conditions: [liste] | RIB: [liste]`

- Les éléments de chaque section sont séparés par des virgules (`, `)
- Les sections sont séparées par des pipes (` | `)

## Édition d'un devis existant

Lors de l'édition d'un devis:
1. Le texte du champ `conditionsPaiement` est automatiquement parsé
2. Les éléments sont répartis dans les 3 sections appropriées
3. Vous pouvez ajouter ou supprimer des éléments
4. Le nouveau texte est reconstruit lors de la sauvegarde

## Configuration des paramètres

Pour ajouter ou modifier les options disponibles, vous devez mettre à jour la table `parametres`:

```sql
-- Exemple de mise à jour des modalités de paiement
UPDATE parametres 
SET modalites_paiement = '["Espèces","Chèque","Virement","Carte bancaire"]'
WHERE organisation_id = 1;

-- Exemple de mise à jour des conditions
UPDATE parametres 
SET conditions_paiement = '["Paiement à 30 jours","Paiement à 60 jours","Paiement comptant","Acompte 30%"]'
WHERE organisation_id = 1;

-- Exemple de mise à jour des RIBs
UPDATE parametres 
SET ribs = '["UBA Gabon: 40001 03001 00100200296 81","AFG Bank: 50002 04002 00200300397 92"]'
WHERE organisation_id = 1;
```

## Interface utilisateur

```
┌─────────────────────────────────────────────────────────┐
│ Modalités de Paiement Espèces à l'ordre de SING        │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • Espèces                                      [✕]  │ │
│ │ • Chèque                                       [✕]  │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Sélectionner une modalité ▼]                    [+]   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Conditions de Paiement                                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • Paiement à 30 jours                          [✕]  │ │
│ │ • Acompte 30% dès validation de l'offre        [✕]  │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Sélectionner une condition ▼]                    [+]   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Coordonnées Bancaires (RIB)                             │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • UBA Gabon: 40001 03001 00100200296 81        [✕]  │ │
│ └─────────────────────────────────────────────────────┘ │
│ [Sélectionner un RIB ▼]                           [+]   │
└─────────────────────────────────────────────────────────┘
```

## Exemple d'utilisation

1. Ouvrez le formulaire de création de devis
2. Remplissez les informations du client et les lignes
3. Dans "Modalités de Paiement":
   - Sélectionnez "Espèces"
   - Sélectionnez "Chèque"
4. Dans "Conditions de Paiement":
   - Sélectionnez "Acompte 30% dès validation de l'offre"
   - Cliquez sur "+" et ajoutez "Solde 70% à la livraison"
5. Dans "RIB":
   - Sélectionnez "UBA Gabon: 40001 03001 00100200296 81"
6. Enregistrez le devis

Le devis sera enregistré avec:
```
conditionsPaiement: "Modalités: Espèces, Chèque | Conditions: Acompte 30% dès validation de l'offre, Solde 70% à la livraison | RIB: UBA Gabon: 40001 03001 00100200296 81"
```

## Notes techniques

- **États React**: 
  - `modalitesSelectionnees` (string[])
  - `conditionsSelectionnees` (string[])
  - `ribsSelectionnes` (string[])

- **Parsing lors du chargement**: Le texte est splitté par ` | ` puis chaque section est identifiée par son préfixe (`Modalités: `, `Conditions: `, `RIB: `)

- **Construction lors de la sauvegarde**: Les 3 tableaux sont combinés avec leurs préfixes respectifs

- **Validation**: Les doublons sont automatiquement évités dans chaque section
