# Services Backend - SING FacturePro

Documentation des services qui reproduisent la logique VBA Excel.

## 📋 Services disponibles

### 1. **calculationService.ts**

Service de calculs financiers (TPS, CSS, remise).

**Fonctions:**

- `calculateDocument(lignes, appliquerRemise)` - Calcule tous les montants d'un document
  - Solde HT
  - Remise (9.5% par défaut)
  - Sous-total
  - TPS (9.5%)
  - CSS (1%)
  - Net à payer
  - Solde dû

- `recalculateDocument(documentId)` - Recalcule un document existant

- `calculateByCategory(documentId)` - Calcule les montants par catégorie de service

- `formatCurrency(amount)` - Formate un montant en FCFA

**Exemple:**
```typescript
const result = await calculateDocument([
  {
    produitId: 1,
    designation: 'Service Cloud',
    quantite: 1,
    prixUnitaire: 15000
  }
], true);

// result = {
//   soldeHt: 15000,
//   remise: 1425,
//   sousTotal: 13575,
//   tps: 1289.63,
//   css: 135.75,
//   netAPayer: 12149.62,
//   soldeDu: 12149.62,
//   lignes: [...]
// }
```

---

### 2. **documentNumberService.ts**

Service de génération de numéros de documents.

**Format:**
- Devis: `DEV2025/01/001`
- Bon de Commande: `BC2025/01/001`
- Bon de Livraison: `BL2025/01/001`
- Facture: `2025/01/001`

**Fonctions:**

- `generateNextReference({ type, date })` - Génère le prochain numéro
  - Auto-incrémente par mois
  - Repart à 001 chaque nouveau mois

- `validateReference(reference, type)` - Valide un numéro

**Exemple:**
```typescript
const numero = await generateNextReference({
  type: 'DEVIS',
  date: new Date('2025-01-15')
});
// Retourne: "DEV2025/01/001"
```

---

### 3. **pdfService.ts**

Service de génération de PDF.

**Fonctions:**

- `generateDocumentPDF({ documentId, type })` - Génère un PDF
  - En-tête avec infos entreprise
  - Informations client
  - Tableau des lignes
  - Totaux (HT, remise, TPS, CSS, net à payer)
  - Conditions de paiement
  - RIB bancaires

- `generateFileName(numero, type)` - Génère le nom de fichier

**Exemple:**
```typescript
const pdfBuffer = await generateDocumentPDF({
  documentId: 1,
  type: 'FACTURE'
});

// Retourne un Buffer du PDF
```

---

### 4. **recapService.ts**

Service de gestion du récapitulatif (comme dans Excel).

**Fonctions:**

- `createRecapFromFacture(factureId)` - Crée une entrée de récap depuis une facture
  - Extrait les montants
  - Répartit par catégorie de service
  - Statut par défaut: "Active"

- `getRecapitulatif(filters)` - Récupère le récapitulatif
  - Filtres: dateDebut, dateFin, statut

- `getRecapStatistics(filters)` - Statistiques du récap
  - Total factures
  - CA actif / payé
  - Montants par catégorie

- `exportRecapToCSV(recapEntries)` - Export CSV

**Exemple:**
```typescript
const recap = await getRecapitulatif({
  dateDebut: new Date('2025-01-01'),
  dateFin: new Date('2025-01-31'),
  statut: 'ACTIVE'
});

const stats = await getRecapStatistics();
// {
//   totalFactures: 10,
//   facturesActives: 7,
//   facturesPayees: 3,
//   caActif: 1500000,
//   montantsParCategorie: {
//     'SING Logiciels': 500000,
//     'SING Conseil': 300000,
//     ...
//   }
// }
```

---

## 🔌 Routes API

### Documents

**POST** `/api/documents/generate-number`
```json
{
  "type": "DEVIS",
  "date": "2025-01-15"
}
```
Retourne: `{ "numero": "DEV2025/01/001" }`

---

**POST** `/api/documents/calculate`
```json
{
  "lignes": [
    {
      "produitId": 1,
      "designation": "Service Cloud",
      "quantite": 1,
      "prixUnitaire": 15000
    }
  ],
  "appliquerRemise": true
}
```
Retourne: Tous les calculs (HT, remise, TPS, CSS, net à payer)

---

**GET** `/api/documents/:id/pdf`

Télécharge le PDF du document

---

**POST** `/api/documents/facture-with-recap`

Crée une facture ET alimente automatiquement le récapitulatif

```json
{
  "numero": "2025/01/001",
  "clientId": 1,
  "date": "2025-01-15",
  "reference": "BC-2025-001",
  "lignes": [...],
  "appliquerRemise": true,
  "conditionsPaiement": "Paiement à 30 jours"
}
```

---

### Récapitulatif

**GET** `/api/recapitulatif`

Query params: `dateDebut`, `dateFin`, `statut`

Retourne: Liste des entrées du récap

---

**GET** `/api/recapitulatif/statistics`

Query params: `dateDebut`, `dateFin`

Retourne: Statistiques complètes

---

**GET** `/api/recapitulatif/export/csv`

Query params: `dateDebut`, `dateFin`, `statut`

Télécharge un fichier CSV

---

## 🔄 Workflow complet

### Créer un devis

1. Générer le numéro: `POST /api/documents/generate-number`
2. Calculer les montants: `POST /api/documents/calculate`
3. Créer le document: `POST /api/documents`
4. Générer le PDF: `GET /api/documents/:id/pdf`

### Créer une facture

1. Générer le numéro: `POST /api/documents/generate-number`
2. Créer avec récap: `POST /api/documents/facture-with-recap`
   - Calcule automatiquement
   - Crée la facture
   - Alimente le récap
3. Générer le PDF: `GET /api/documents/:id/pdf`

### Consulter le récapitulatif

1. Statistiques: `GET /api/recapitulatif/statistics`
2. Liste: `GET /api/recapitulatif`
3. Export: `GET /api/recapitulatif/export/csv`

---

## 📊 Correspondance VBA → TypeScript

| Fonction VBA | Service TypeScript |
|--------------|-------------------|
| `NextReference()` | `documentNumberService.generateNextReference()` |
| Calculs TPS/CSS | `calculationService.calculateDocument()` |
| Export PDF | `pdfService.generateDocumentPDF()` |
| `AlimenterRecapDepuisFacture()` | `recapService.createRecapFromFacture()` |
| `GenererDevisDepuisPacks()` | Routes `/api/documents` + calculs |

---

## ✅ Fonctionnalités implémentées

- ✅ Génération automatique de numéros (DEV, BC, BL, FAC)
- ✅ Calculs financiers (TPS 9.5%, CSS 1%, remise 9.5%)
- ✅ Génération de PDF professionnels
- ✅ Alimentation automatique du récapitulatif
- ✅ Statistiques et exports CSV
- ✅ Répartition par catégorie de service
- ✅ Gestion des statuts (Active, Payée, Annulée)

---

## 🚀 Prochaines étapes

Pour utiliser ces services dans le frontend:

1. Mettre à jour `frontend/src/services/api.ts`
2. Créer les pages de création de documents
3. Implémenter la page de récapitulatif
4. Ajouter les boutons de téléchargement PDF

Tous les services sont prêts et testables via l'API! 🎉
