# API Documentation - SING FacturePro

Documentation complète des endpoints API avec exemples.

## 🔐 Authentification

Toutes les routes (sauf `/api/auth/*`) nécessitent un token JWT:

```bash
Authorization: Bearer <token>
```

---

## 📄 Documents

### 1. Créer un document depuis des codes produits

**Équivalent VBA:** `GenererFactureDepuisPacks()`

```http
POST /api/documents/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "FACTURE",
  "clientId": 1,
  "date": "2025-01-15",
  "reference": "BC-2025-001",
  "conditionsPaiement": "Paiement à 30 jours",
  "codeProduits": ["PROG-001", "LOG-003", "CONS-001"],
  "quantites": {
    "PROG-001": 2,
    "LOG-003": 1,
    "CONS-001": 3
  },
  "appliquerRemise": true
}
```

**Réponse:**
```json
{
  "id": 123,
  "type": "FACTURE",
  "numero": "2025/01/001",
  "clientId": 1,
  "date": "2025-01-15T00:00:00.000Z",
  "reference": "BC-2025-001",
  "soldeHt": 250000,
  "remise": 23750,
  "sousTotal": 226250,
  "tps": 21493.75,
  "css": 2262.5,
  "netAPayer": 202493.75,
  "soldeDu": 202493.75,
  "statut": "ACTIVE",
  "lignes": [
    {
      "id": 1,
      "produitId": 5,
      "designation": "Assistance technique - Programme Crysalis",
      "quantite": 2,
      "prixUnitaire": 1119,
      "totalHt": 2238
    }
  ]
}
```

---

### 2. Obtenir le prochain numéro de document

**Équivalent VBA:** `NextReference()`

```http
GET /api/documents/next-number/FACTURE?date=2025-01-15
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "numero": "2025/01/001"
}
```

**Types disponibles:** `DEVIS`, `FACTURE`, `AVOIR`

---

### 3. Calculer les montants d'un document

**Équivalent VBA:** Formules Excel (K60-K65)

```http
POST /api/documents/calculate
Content-Type: application/json
Authorization: Bearer <token>

{
  "soldeHt": 100000,
  "appliquerRemise": true
}
```

**Réponse:**
```json
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

### 4. Prévisualiser les lignes depuis des codes produits

```http
POST /api/documents/preview-lignes
Content-Type: application/json
Authorization: Bearer <token>

{
  "codeProduits": ["PROG-001", "LOG-003"]
}
```

**Réponse:**
```json
[
  {
    "produitId": 1,
    "code": "PROG-001",
    "designation": "Assistance technique - Programme Crysalis",
    "prixUnitaire": 1119,
    "quantite": 1,
    "totalHt": 1119,
    "isMainLine": true
  },
  {
    "produitId": 1,
    "code": "",
    "designation": "Identification entrepreneurs",
    "prixUnitaire": 0,
    "quantite": 0,
    "totalHt": 0,
    "isMainLine": false
  },
  {
    "produitId": 1,
    "code": "",
    "designation": "Sessions d'information",
    "prixUnitaire": 0,
    "quantite": 0,
    "totalHt": 0,
    "isMainLine": false
  }
]
```

---

### 5. Télécharger le PDF d'un document

**Équivalent VBA:** `Facture_Enregistrer()`

```http
GET /api/documents/123/pdf
Authorization: Bearer <token>
```

**Réponse:** Fichier PDF (Content-Type: application/pdf)

---

### 6. Récapitulatif des factures

**Équivalent VBA:** Feuille "Recap Sing"

```http
GET /api/documents/recap?dateDebut=2025-01-01&dateFin=2025-12-31&statut=ACTIVE
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "lignes": [
    {
      "id": 123,
      "dateFacture": "2025-01-15T00:00:00.000Z",
      "designation": "Assistance technique - Programme Crysalis",
      "numeroFacture": "2025/01/001",
      "numeroBC": "BC-2025-001",
      "clientNom": "SING S.A.",
      "montantsParCategorie": {
        "Programme": 50000,
        "SING Logiciels": 35000,
        "SING Conseil": 75000
      },
      "soldeHt": 160000,
      "remise": 15200,
      "sousTotal": 144800,
      "tps": 13756,
      "css": 1448,
      "netAPayer": 129596,
      "soldeDu": 129596,
      "statut": "ACTIVE"
    }
  ],
  "totaux": {
    "parCategorie": {
      "Programme": 250000,
      "SING Logiciels": 180000,
      "SING Conseil": 300000,
      "Incubateur": 50000
    },
    "soldeHt": 780000,
    "remise": 74100,
    "sousTotal": 705900,
    "tps": 67060.5,
    "css": 7059,
    "netAPayer": 631780.5,
    "soldeDu": 631780.5
  }
}
```

---

### 7. Liste des documents (existant)

```http
GET /api/documents?type=FACTURE&statut=ACTIVE&client_id=1
Authorization: Bearer <token>
```

---

### 8. Détails d'un document (existant)

```http
GET /api/documents/123
Authorization: Bearer <token>
```

---

### 9. Mettre à jour un document (existant)

```http
PUT /api/documents/123
Content-Type: application/json
Authorization: Bearer <token>

{
  "statut": "PAYEE",
  "soldeDu": 0
}
```

---

### 10. Supprimer un document (existant)

```http
DELETE /api/documents/123
Authorization: Bearer <token>
```

---

## 📦 Produits

### Liste des produits

```http
GET /api/produits?categorie=Programme&actif=true
Authorization: Bearer <token>
```

### Catégories disponibles

```http
GET /api/produits/categories
Authorization: Bearer <token>
```

**Réponse:**
```json
[
  "Programme",
  "SING Logiciels",
  "SING Conseil",
  "Incubateur",
  "Formation",
  "Consulting",
  "Support"
]
```

---

## 👥 Clients

### Liste des clients

```http
GET /api/clients
Authorization: Bearer <token>
```

### Créer un client

```http
POST /api/clients
Content-Type: application/json
Authorization: Bearer <token>

{
  "nom": "Nouvelle Entreprise",
  "adresse": "123 Rue Example, Libreville",
  "tel": "+241 01 23 45 67",
  "email": "contact@example.ga",
  "pays": "Gabon"
}
```

---

## ⚙️ Paramètres

### Récupérer les paramètres

```http
GET /api/parametres
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "id": 1,
  "nomEntreprise": "SING S.A.",
  "adresse": "BP. 2280, Centre Ville, Libreville – Gabon",
  "telephone": "+241 74 13 71 03",
  "email": "info@sing.ga",
  "siteWeb": "https://www.sing.ga/",
  "rccm": "RG LBV 2018B22204",
  "capital": "50 000 000 FCFA",
  "tauxTps": 0.095,
  "tauxCss": 0.01,
  "tauxTva": 0.18,
  "tauxRemise": 0.095,
  "ribUba": "40025 05801 80100300296 81",
  "ribAfg": "40001 09070 07000615101 36"
}
```

### Modifier les paramètres (admin uniquement)

```http
PUT /api/parametres
Content-Type: application/json
Authorization: Bearer <token>

{
  "tauxTps": 0.10,
  "tauxCss": 0.015,
  "tauxRemise": 0.10
}
```

---

## 🔐 Authentification

### Connexion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sing.ga",
  "password": "admin123"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@sing.ga",
    "nom": "Administrateur SING",
    "role": "ADMIN"
  }
}
```

### Utilisateur actuel

```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📊 Statistiques

```http
GET /api/documents/stats/summary
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "factures_actives": 15,
  "factures_payees": 8,
  "factures_annulees": 2,
  "ca_actif": 5250000,
  "solde_du_total": 5250000,
  "ca_paye": 3800000
}
```

---

## 🚀 Exemples de workflows

### Workflow 1: Créer une facture complète

```bash
# 1. Obtenir le prochain numéro
curl -X GET "http://localhost:5000/api/documents/next-number/FACTURE" \
  -H "Authorization: Bearer <token>"

# 2. Prévisualiser les lignes
curl -X POST "http://localhost:5000/api/documents/preview-lignes" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"codeProduits": ["PROG-001", "LOG-003"]}'

# 3. Créer la facture
curl -X POST "http://localhost:5000/api/documents/generate" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "FACTURE",
    "clientId": 1,
    "codeProduits": ["PROG-001", "LOG-003"],
    "quantites": {"PROG-001": 2, "LOG-003": 1}
  }'

# 4. Télécharger le PDF
curl -X GET "http://localhost:5000/api/documents/123/pdf" \
  -H "Authorization: Bearer <token>" \
  -o facture.pdf
```

### Workflow 2: Consulter le récapitulatif

```bash
# Récap du mois en cours
curl -X GET "http://localhost:5000/api/documents/recap?dateDebut=2025-01-01&dateFin=2025-01-31" \
  -H "Authorization: Bearer <token>"
```

---

## ❌ Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide (paramètres manquants) |
| 401 | Non authentifié (token manquant/invalide) |
| 403 | Non autorisé (droits insuffisants) |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

**Format des erreurs:**
```json
{
  "error": "Message d'erreur descriptif"
}
```
