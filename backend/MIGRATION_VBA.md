# Migration VBA → TypeScript

Ce document explique comment la logique VBA Excel a été migrée vers TypeScript/Node.js.

## 📊 Vue d'ensemble

L'application Excel utilisait des macros VBA pour gérer:
- Génération automatique de numéros de documents
- Création de documents depuis des codes PACKS
- Calculs financiers (TPS, CSS, remise)
- Export PDF
- Alimentation automatique du récapitulatif

## 🔄 Correspondances VBA → TypeScript

### 1. Génération de numéros (NextReference)

**VBA:**
```vba
Private Function NextReference( _
    ByVal ws As Worksheet, _
    ByVal refAddress As String, _
    ByVal docDate As Date, _
    ByVal prefix As String _
) As String
    ' Format: PREFIX + AAAA/MM/NNN
    ' Incrémente par mois
End Function
```

**TypeScript:**
```typescript
// backend/src/services/documentService.ts
static async generateNextNumber(
  type: 'DEVIS' | 'FACTURE' | 'AVOIR',
  date: Date = new Date()
): Promise<string>
```

**Utilisation API:**
```bash
GET /api/documents/next-number/DEVIS?date=2025-01-15
# Retourne: { "numero": "DEV2025/01/001" }
```

---

### 2. Génération depuis codes PACKS (GenererFactureDepuisPacks)

**VBA:**
```vba
Public Sub GenererFactureDepuisPacks()
    ' Lit les codes dans A19:A30
    ' Cherche dans T_PACKS
    ' Génère lignes principales + détails
    ' Style: Gras pour principales, Normal pour détails
End Sub
```

**TypeScript:**
```typescript
// backend/src/services/documentService.ts
static async generateLignesFromProduits(
  codeProduits: string[]
): Promise<Array<LigneDocument>>
```

**Utilisation API:**
```bash
POST /api/documents/generate
{
  "type": "FACTURE",
  "clientId": 1,
  "codeProduits": ["PROG-001", "LOG-003"],
  "quantites": {
    "PROG-001": 2,
    "LOG-003": 1
  }
}
```

---

### 3. Calculs financiers

**VBA:**
```vba
' Dans les cellules Excel:
' K60: Solde HT = SOMME(lignes)
' K61: Remise = K60 * 9.5%
' K62: Sous-total = K60 - K61
' K63: TPS = K62 * 9.5%
' K64: CSS = K62 * 1%
' K65: Net à payer = K62 - K63 - K64
```

**TypeScript:**
```typescript
// backend/src/services/documentService.ts
static calculateAmounts(
  soldeHt: number,
  tauxRemise: number = 0.095,
  tauxTps: number = 0.095,
  tauxCss: number = 0.01,
  appliquerRemise: boolean = true
)
```

**Utilisation API:**
```bash
POST /api/documents/calculate
{
  "soldeHt": 100000,
  "appliquerRemise": true
}

# Retourne:
{
  "soldeHt": 100000,
  "remise": 9500,
  "sousTotal": 90500,
  "tps": 8597.5,
  "css": 905,
  "netAPayer": 80997.5,
  "soldeDu": 80997.5
}
```

---

### 4. Export PDF (Devis_Sing_Imprimer, Facture_Enregistrer)

**VBA:**
```vba
Sub Facture_Enregistrer()
    ' Configure la page
    ' Export en PDF
    ' Sauvegarde dans dossier Parameters!K12
    ' Ouvre automatiquement
End Sub
```

**TypeScript:**
```typescript
// backend/src/services/pdfService.ts
static async generateDocumentPDF(documentId: number): Promise<Buffer>
```

**Utilisation API:**
```bash
GET /api/documents/123/pdf
# Télécharge: 2025-01-001.pdf
```

---

### 5. Alimentation du RECAP (AlimenterRecapDepuisFacture)

**VBA:**
```vba
Private Sub AlimenterRecapDepuisFacture(ByVal wsFacture As Worksheet)
    ' Parcourt les codes PACKS
    ' Groupe par SOUS_SERVICE
    ' Récupère les montants exacts
    ' Insère dans Recap Sing
End Sub
```

**TypeScript:**
```typescript
// backend/src/services/recapService.ts
static async alimenterDepuisFacture(factureId: number)
```

**Utilisation API:**
```bash
# Automatique lors de la création d'une facture
POST /api/documents/generate
{ "type": "FACTURE", ... }

# Ou récupérer le récap complet:
GET /api/documents/recap?dateDebut=2025-01-01&dateFin=2025-12-31
```

---

## 🎯 Nouvelles routes API

### Documents

| Méthode | Route | Description | Équivalent VBA |
|---------|-------|-------------|----------------|
| POST | `/api/documents/generate` | Créer document depuis codes | `GenererFactureDepuisPacks()` |
| GET | `/api/documents/next-number/:type` | Prochain numéro | `NextReference()` |
| POST | `/api/documents/calculate` | Calculer montants | Formules Excel |
| POST | `/api/documents/preview-lignes` | Prévisualiser lignes | Génération lignes VBA |
| GET | `/api/documents/:id/pdf` | Télécharger PDF | `Facture_Enregistrer()` |
| GET | `/api/documents/recap` | Récapitulatif | Feuille "Recap Sing" |

### Workflow complet

```typescript
// 1. Obtenir le prochain numéro
GET /api/documents/next-number/FACTURE
→ { "numero": "2025/01/001" }

// 2. Prévisualiser les lignes
POST /api/documents/preview-lignes
{ "codeProduits": ["PROG-001", "LOG-003"] }
→ [ { ligne principale }, { détail 1 }, { détail 2 }, ... ]

// 3. Calculer les montants
POST /api/documents/calculate
{ "soldeHt": 100000 }
→ { remise, tps, css, netAPayer, ... }

// 4. Créer le document
POST /api/documents/generate
{
  "type": "FACTURE",
  "clientId": 1,
  "codeProduits": ["PROG-001"],
  "quantites": { "PROG-001": 2 }
}
→ Document créé + Recap alimenté automatiquement

// 5. Télécharger le PDF
GET /api/documents/123/pdf
→ Fichier PDF
```

---

## 📋 Tables de données

### T_PACKS (VBA) → Table `produits` (Prisma)

| VBA | Prisma | Description |
|-----|--------|-------------|
| CODE_PACK | code | Code unique |
| DESC_COURTE2 | label | Description courte (ligne principale) |
| PRIX_UNIT | prix | Prix unitaire |
| SOUS_SERVICE | categorie | Catégorie pour le récap |

### T_PACKS_DETAILS (VBA) → Champ `description` (Prisma)

Les détails sont stockés dans le champ `description` du produit, séparés par des points ou retours à la ligne.

---

## 🔧 Configuration

### Paramètres (Parameters!K9-K12 en VBA)

**VBA:**
- K9: Dossier Devis
- K10: Dossier Commandes
- K11: Dossier Livraisons
- K12: Dossier Factures

**TypeScript:**
Les PDF sont générés à la demande et téléchargés directement. Pas besoin de dossiers configurés.

### Taux (Parameters en VBA)

**VBA:**
- Taux TPS: 9.5%
- Taux CSS: 1%
- Taux Remise: 9.5%

**TypeScript:**
Stockés dans la table `parametres` (id=1), modifiables via:
```bash
PUT /api/parametres
{
  "tauxTps": 0.095,
  "tauxCss": 0.01,
  "tauxRemise": 0.095
}
```

---

## ✅ Avantages de la migration

1. **Multi-utilisateurs**: Plusieurs personnes peuvent travailler simultanément
2. **Accessibilité**: Accessible depuis n'importe quel navigateur
3. **Sécurité**: Authentification JWT, rôles admin/user
4. **Traçabilité**: Historique complet dans PostgreSQL
5. **Performance**: Calculs côté serveur, pas de limite Excel
6. **Évolutivité**: Facile d'ajouter de nouvelles fonctionnalités
7. **Backup**: Sauvegardes automatiques de la base de données
8. **API**: Intégration possible avec d'autres systèmes

---

## 🚀 Prochaines étapes

- [ ] Implémenter l'export Excel du récapitulatif
- [ ] Ajouter la gestion des acomptes/règlements
- [ ] Créer des templates PDF personnalisables
- [ ] Ajouter des notifications email
- [ ] Implémenter un système de workflow (validation, approbation)
- [ ] Créer des rapports et statistiques avancés
