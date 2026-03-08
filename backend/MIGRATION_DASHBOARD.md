# Migration Dashboard Moderne - SING FacturePro

## 🎯 Objectif
Migrer vers le nouveau dashboard avec support complet des fonctionnalités Excel.

## 📋 Nouvelles Fonctionnalités

### 1. Types de Documents Étendus
- ✅ DEVIS (existant)
- ✅ FACTURE (existant)
- 🆕 COMMANDE (Bon de commande)
- 🆕 LIVRAISON (Bon de livraison)
- ✅ AVOIR (existant)

### 2. Système de PACKS
Remplace le système simple de produits par un système de packs avec :
- Code pack (ex: S1, S2, S3)
- Description courte
- Prix unitaire
- Sous-service (catégorie)
- Détails multiples (lignes de description)

### 3. Récapitulatif Automatique
Vue consolidée de toutes les factures avec :
- Répartition par sous-services
- Calculs automatiques (TPS, CSS, Remise)
- Suivi des règlements
- Calcul des soldes dus

## 🔄 Étapes de Migration

### Étape 1 : Sauvegarder la Base de Données
```bash
cd backend
npx prisma db pull
# Créer une sauvegarde
pg_dump -U postgres -d sing-gest-facture > backup_$(date +%Y%m%d).sql
```

### Étape 2 : Appliquer les Migrations
```bash
cd backend

# Générer la migration
npx prisma migrate dev --name add_dashboard_features

# Ou forcer la mise à jour du schema
npx prisma db push
```

### Étape 3 : Régénérer le Client Prisma
```bash
npx prisma generate
```

### Étape 4 : Seed Initial (Optionnel)
Créer des données de test pour les packs :

```bash
npx tsx prisma/seed-packs.ts
```

### Étape 5 : Redémarrer le Backend
```bash
npm run dev
```

## 📊 Structure des Nouvelles Tables

### Table `packs`
```sql
CREATE TABLE packs (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  desc_courte VARCHAR(255) NOT NULL,
  prix_unitaire DECIMAL(15,2) NOT NULL,
  sous_service VARCHAR(100) NOT NULL,
  organisation_id INTEGER NOT NULL,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(code, organisation_id)
);
```

### Table `pack_details`
```sql
CREATE TABLE pack_details (
  id SERIAL PRIMARY KEY,
  pack_id INTEGER NOT NULL REFERENCES packs(id) ON DELETE CASCADE,
  ordre INTEGER DEFAULT 0,
  description_longue TEXT NOT NULL
);
```

### Table `recapitulatif`
```sql
CREATE TABLE recapitulatif (
  id SERIAL PRIMARY KEY,
  organisation_id INTEGER NOT NULL,
  document_id INTEGER,
  date_facture DATE NOT NULL,
  designation VARCHAR(255) NOT NULL,
  numero_facture VARCHAR(100) NOT NULL,
  numero_bc VARCHAR(100),
  montant_services JSONB NOT NULL,
  solde_ht DECIMAL(15,2) NOT NULL,
  remise DECIMAL(15,2) DEFAULT 0,
  sous_total_2 DECIMAL(15,2) NOT NULL,
  tps DECIMAL(15,2) NOT NULL,
  css DECIMAL(15,2) NOT NULL,
  net_a_payer DECIMAL(15,2) NOT NULL,
  reglement DECIMAL(15,2),
  solde_du DECIMAL(15,2),
  date_reglement DATE,
  etat VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Configuration Post-Migration

### 1. Créer des Packs de Test
```typescript
// Exemple de packs basés sur les captures d'écran
const packs = [
  {
    code: 'S1',
    descCourte: 'Assistance informatique - SING Réseau',
    prixUnitaire: 1187500,
    sousService: 'Assistance informatique',
    details: [
      'Assistance Economique web',
      'Développement informatique',
      'Service Conseil',
      'Gestion Messagerie',
      'Autre logiciel'
    ]
  },
  {
    code: 'S2',
    descCourte: 'Assistance technique - SING conseil',
    prixUnitaire: 836875,
    sousService: 'Assistance technique',
    details: [
      'Mobilisation Day',
      'Mise d\'application Conseil',
      'Mise d\'application Expertise',
      'Mise d\'application Consulting',
      'Assistance technique Programme Culture'
    ]
  },
  // ... autres packs
];
```

### 2. Configurer les Sous-Services
Les sous-services correspondent aux colonnes du récapitulatif :
- Assistance informatique - SING Réseau
- Assistance technique - SING conseil
- Immatriculation - mise à disposition assurance
- Assistance technique Programme

## 🧪 Tests de Validation

### Test 1 : Création d'un Pack
```bash
curl -X POST http://localhost:5005/api/packs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "code": "S1",
    "descCourte": "Assistance informatique",
    "prixUnitaire": 1187500,
    "sousService": "Assistance informatique",
    "details": ["Detail 1", "Detail 2"]
  }'
```

### Test 2 : Création d'une Facture avec Packs
```bash
curl -X POST http://localhost:5005/api/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "FACTURE",
    "clientId": 1,
    "date": "2025-01-15",
    "lignes": [
      {
        "packCode": "S1",
        "quantite": 1
      }
    ]
  }'
```

### Test 3 : Récupérer le Récapitulatif
```bash
curl http://localhost:5005/api/recapitulatif \
  -H "Authorization: Bearer <token>"
```

## 📝 Checklist de Migration

- [ ] Sauvegarder la base de données
- [ ] Appliquer les migrations Prisma
- [ ] Régénérer le client Prisma
- [ ] Créer les routes API pour les packs
- [ ] Créer les routes API pour le récapitulatif
- [ ] Tester la création de documents avec packs
- [ ] Tester l'alimentation automatique du récapitulatif
- [ ] Vérifier les calculs (TPS, CSS, Remise)
- [ ] Tester l'export PDF
- [ ] Valider avec des données réelles

## 🚨 Rollback en Cas de Problème

Si la migration échoue :

```bash
# Restaurer la sauvegarde
psql -U postgres -d sing-gest-facture < backup_YYYYMMDD.sql

# Revenir à l'ancien schema
cd backend
git checkout HEAD -- prisma/schema.prisma
npx prisma generate
```

## 📞 Support

En cas de problème :
1. Vérifier les logs du backend
2. Vérifier que Prisma Client est à jour
3. Vérifier les permissions de la base de données
4. Consulter la documentation Prisma

## 🎉 Après la Migration

Une fois la migration réussie :
1. Le nouveau dashboard sera accessible sur `/dashboard`
2. L'ancien dashboard reste accessible sur `/dashboard-old`
3. Toutes les données existantes sont préservées
4. Les nouvelles fonctionnalités sont disponibles
