# 📋 Spécification Module Devis - SING FacturePro

## Vue d'ensemble

Le module Devis permet de créer, gérer et exporter des devis professionnels conformes à la structure Excel originale.

## Structure du Devis (basée sur les images Excel)

### En-tête du Document
```
┌─────────────────────────────────────────────────────────┐
│ LOGO SING                                    DEVIS      │
│                                                          │
│ Informations Entreprise (SING)    N°: DEV2025/01/001   │
│ - Nom                              Date: 15/01/2025     │
│ - Adresse                                               │
│ - Téléphone                                             │
│ - Email                                                 │
│ - RCCM                                                  │
│ - Capital                                               │
└─────────────────────────────────────────────────────────┘
```

### Informations Client
```
┌─────────────────────────────────────────────────────────┐
│ CLIENT                                                   │
│ Nom de l'organisation: _____________________________    │
│ Adresse: ___________________________________________    │
│ Téléphone: _________________________________________    │
│ Email: _____________________________________________    │
│                                                          │
│ REPRÉSENTANT                                            │
│ Nom: _______________________________________________    │
│ Fonction: __________________________________________    │
│ Téléphone: _________________________________________    │
│ Email: _____________________________________________    │
└─────────────────────────────────────────────────────────┘
```

### Objet du Devis
```
┌─────────────────────────────────────────────────────────┐
│ Objet: _________________________________________________ │
└─────────────────────────────────────────────────────────┘
```

### Tableau des Lignes
```
┌────┬──────────────────────────────┬──────┬─────┬─────────┐
│ N° │ DÉSIGNATION                  │ P.U  │ QTÉ │  TOTAL  │
├────┼──────────────────────────────┼──────┼─────┼─────────┤
│ S1 │ Assistance informatique      │ 1187500│ 1 │ 1187500│
│    │ - Réparation et dépannage    │      │     │         │
│    │ - Support et assistance      │      │     │         │
│    │ - Rapport et suivi           │      │     │         │
├────┼──────────────────────────────┼──────┼─────┼─────────┤
│ S2 │ Programme 3 mois             │ 686625│ 1 │  686625│
│    │ - Réalisation programme      │      │     │         │
│    │ - Suivi et accompagnement    │      │     │         │
└────┴──────────────────────────────┴──────┴─────┴─────────┘
```

### Totaux et Calculs
```
┌─────────────────────────────────────────────────────────┐
│                                    Solde HT:  1 874 125 │
│                                    Remise:      177 942 │
│                                    Sous-total: 1696 183 │
│                                    TPS 9.5%:    161 137 │
│                                    CSS 1%:       16 962 │
│                                    ─────────────────────│
│                                    NET À PAYER: 1874 282│
└─────────────────────────────────────────────────────────┘
```

### Modalités de Paiement
```
┌─────────────────────────────────────────────────────────┐
│ MODALITÉS DE PAIEMENT                                   │
│                                                          │
│ Modalité 1: Espèces                                     │
│ Modalité 2: Virement                                    │
│   - RIB UBA: ___________                                │
│   - RIB AFG: ___________                                │
│ Modalité 3: Chèque                                      │
│                                                          │
│ Validité du devis: 30 jours                             │
└─────────────────────────────────────────────────────────┘
```

## Fonctionnalités du Module

### 1. Liste des Devis
- Tableau avec colonnes:
  - N° Devis
  - Date
  - Client
  - Objet
  - Montant HT
  - Net à payer
  - Statut (Brouillon, Envoyé, Accepté, Refusé, Expiré)
  - Actions (Voir, Modifier, Supprimer, PDF, Convertir en BC)

### 2. Création/Édition de Devis

#### Étape 1: Informations Générales
- Sélection client (dropdown avec recherche)
- Sélection représentant (basé sur le client)
- Date du devis (auto: aujourd'hui)
- Numéro automatique (DEV2025/01/001)
- Objet du devis (texte libre)
- Référence (optionnel)

#### Étape 2: Ajout de Lignes
Deux modes d'ajout:

**Mode A: Depuis Packs**
- Sélection d'un pack dans la liste
- Le pack ajoute automatiquement:
  - Ligne principale (code + description courte + prix)
  - Lignes de détails (descriptions longues)
- Quantité modifiable
- Total calculé automatiquement

**Mode B: Ligne Personnalisée**
- Code personnalisé
- Désignation libre
- Prix unitaire manuel
- Quantité
- Possibilité d'ajouter des sous-lignes de détails

#### Étape 3: Calculs Automatiques
```javascript
soldeHT = Σ (prixUnitaire × quantité)
remise = soldeHT × tauxRemise (9.5% par défaut, modifiable)
sousTotal = soldeHT - remise
tps = sousTotal × 0.095 (9.5%)
css = sousTotal × 0.01 (1%)
netAPayer = sousTotal + tps + css
```

#### Étape 4: Modalités de Paiement
- Sélection des modalités (checkboxes):
  - Espèces
  - Virement (affiche RIB UBA et AFG depuis paramètres)
  - Chèque
- Conditions de paiement (texte libre)
- Validité du devis (défaut: 30 jours)

### 3. Actions sur un Devis

#### Visualiser (Aperçu)
- Modal avec aperçu du devis formaté
- Ressemble au PDF final

#### Modifier
- Ouvre le formulaire en mode édition
- Toutes les données pré-remplies

#### Supprimer
- Confirmation requise
- Suppression en cascade des lignes

#### Export PDF
- Génération PDF côté serveur
- Template professionnel
- Logo entreprise
- Mise en page conforme à l'Excel

#### Convertir en Bon de Commande
- Crée un BC avec les mêmes données
- Nouveau numéro (BC2025/01/001)
- Lien entre DEV et BC

### 4. Filtres et Recherche
- Recherche par:
  - Numéro de devis
  - Nom client
  - Objet
- Filtres par:
  - Statut
  - Date (plage)
  - Montant (min/max)

## Interface Utilisateur

### Vue Liste
```tsx
<div>
  {/* Header */}
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <input placeholder="Rechercher..." />
    <button>+ Nouveau Devis</button>
  </div>

  {/* Filtres */}
  <div style={{ display: 'flex', gap: '16px' }}>
    <select>Statut</select>
    <input type="date" placeholder="Date début" />
    <input type="date" placeholder="Date fin" />
  </div>

  {/* Tableau */}
  <table>
    <thead>
      <tr>
        <th>N° Devis</th>
        <th>Date</th>
        <th>Client</th>
        <th>Objet</th>
        <th>Montant HT</th>
        <th>Net à payer</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* Lignes de devis */}
    </tbody>
  </table>
</div>
```

### Formulaire Création/Édition
```tsx
<Modal>
  <h2>Nouveau Devis</h2>
  
  {/* Section 1: Informations */}
  <Section title="Informations Générales">
    <Select label="Client" />
    <Select label="Représentant" />
    <Input label="Date" type="date" />
    <Input label="N° Devis" disabled />
    <Input label="Objet" />
    <Input label="Référence" />
  </Section>

  {/* Section 2: Lignes */}
  <Section title="Lignes du Devis">
    <div>
      <button>+ Ajouter depuis Pack</button>
      <button>+ Ligne Personnalisée</button>
    </div>
    
    <Table>
      {/* Lignes avec détails */}
    </Table>
  </Section>

  {/* Section 3: Totaux */}
  <Section title="Totaux">
    <div>Solde HT: {soldeHT}</div>
    <div>Remise: {remise}</div>
    <div>Sous-total: {sousTotal}</div>
    <div>TPS 9.5%: {tps}</div>
    <div>CSS 1%: {css}</div>
    <div>NET À PAYER: {netAPayer}</div>
  </div>

  {/* Section 4: Modalités */}
  <Section title="Modalités de Paiement">
    <Checkbox label="Espèces" />
    <Checkbox label="Virement" />
    {showRIB && <div>RIB UBA: ... / RIB AFG: ...</div>}
    <Checkbox label="Chèque" />
    <Textarea label="Conditions de paiement" />
  </Section>

  {/* Actions */}
  <div>
    <button>Annuler</button>
    <button>Enregistrer Brouillon</button>
    <button>Enregistrer et Envoyer</button>
  </div>
</Modal>
```

## Routes API Backend

### GET /api/devis
- Liste tous les devis de l'organisation
- Filtres: statut, date, client
- Inclut: client, représentant, lignes

### GET /api/devis/:id
- Détails complets d'un devis
- Inclut: client, représentant, lignes avec détails

### POST /api/devis
- Crée un nouveau devis
- Génère le numéro automatiquement
- Calcule les totaux
- Body:
```json
{
  "clientId": 1,
  "representantId": 1,
  "date": "2025-01-15",
  "objet": "Assistance informatique",
  "reference": "REF-2025-001",
  "lignes": [
    {
      "packId": 1,
      "code": "S1",
      "designation": "Assistance informatique",
      "prixUnitaire": 1187500,
      "quantite": 1,
      "details": ["Réparation", "Support", "Rapport"]
    }
  ],
  "tauxRemise": 0.095,
  "conditionsPaiement": "Paiement à 30 jours",
  "modalitesPaiement": ["especes", "virement", "cheque"]
}
```

### PUT /api/devis/:id
- Met à jour un devis existant
- Recalcule les totaux

### DELETE /api/devis/:id
- Supprime un devis
- Suppression en cascade des lignes

### POST /api/devis/:id/pdf
- Génère le PDF du devis
- Retourne le fichier PDF

### POST /api/devis/:id/convertir-bc
- Convertit le devis en bon de commande
- Crée un nouveau BC avec les mêmes données
- Lie le BC au devis

### GET /api/devis/numero-suivant
- Retourne le prochain numéro de devis
- Format: DEV2025/01/001

## Service de Calcul

```typescript
// backend/src/services/calculationService.ts

export function calculerDevis(lignes: Ligne[], tauxRemise: number) {
  const soldeHT = lignes.reduce((sum, ligne) => {
    return sum + (ligne.prixUnitaire * ligne.quantite);
  }, 0);

  const remise = soldeHT * tauxRemise;
  const sousTotal = soldeHT - remise;
  const tps = sousTotal * 0.095; // 9.5%
  const css = sousTotal * 0.01;  // 1%
  const netAPayer = sousTotal + tps + css;

  return {
    soldeHT,
    remise,
    sousTotal,
    tps,
    css,
    netAPayer
  };
}
```

## Service de Numérotation

```typescript
// backend/src/services/documentNumberService.ts

export async function genererNumeroDevis(
  organisationId: number,
  date: Date
): Promise<string> {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  
  // Trouver le dernier devis du mois
  const dernierDevis = await prisma.document.findFirst({
    where: {
      organisationId,
      type: 'DEVIS',
      numero: {
        startsWith: `DEV${annee}/${mois}/`
      }
    },
    orderBy: { numero: 'desc' }
  });

  let compteur = 1;
  
  if (dernierDevis) {
    const parts = dernierDevis.numero.split('/');
    if (parts.length === 3) {
      compteur = parseInt(parts[2]) + 1;
    }
  }

  return `DEV${annee}/${mois}/${String(compteur).padStart(3, '0')}`;
}
```

## Statuts du Devis

- **BROUILLON**: En cours de création
- **ENVOYE**: Envoyé au client
- **ACCEPTE**: Client a accepté
- **REFUSE**: Client a refusé
- **EXPIRE**: Dépassé la date de validité
- **CONVERTI**: Converti en bon de commande

## Workflow

```
BROUILLON → ENVOYE → ACCEPTE → CONVERTI (en BC)
                  ↓
                REFUSE
                  ↓
                EXPIRE
```

## Prochaines Étapes

1. Créer les routes API backend
2. Créer le service de calcul
3. Créer le service de numérotation
4. Créer le composant DevisModule
5. Créer le service PDF
6. Tests et validation

---

**Date**: 2025-01-XX
**Statut**: Spécification complète
