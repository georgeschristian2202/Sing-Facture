# 🔄 Migration: Ajout des Représentants Clients

## Problème Identifié

Dans l'application Excel originale, un **Client** est une **organisation** (entreprise) qui a des **représentants** (personnes de contact). Cette structure n'était pas correctement implémentée dans la première version.

## Solution

Ajout d'une table `Representant` pour gérer les personnes de contact de chaque client.

## Modifications du Schema Prisma

### Table Client (modifiée)
```prisma
model Client {
  id             Int           @id @default(autoincrement())
  nom            String        // Nom de l'organisation cliente
  adresse        String?
  tel            String?       // Téléphone principal de l'organisation
  email          String?       // Email principal de l'organisation
  pays           String        @default("Gabon")
  organisationId Int           @map("organisation_id")
  organisation   Organisation  @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  createdAt      DateTime      @default(now()) @map("created_at")
  documents      Document[]
  representants  Representant[] // ✅ NOUVEAU: Personnes de contact

  @@index([organisationId])
  @@map("clients")
}
```

### Table Representant (nouvelle)
```prisma
model Representant {
  id        Int      @id @default(autoincrement())
  clientId  Int      @map("client_id")
  client    Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  nom       String   // Nom complet du représentant
  fonction  String?  // Poste/Fonction (ex: Directeur, Responsable Achats)
  tel       String?  // Téléphone direct du représentant
  email     String?  // Email du représentant
  principal Boolean  @default(false) // Représentant principal
  createdAt DateTime @default(now()) @map("created_at")

  @@index([clientId])
  @@map("representants")
}
```

## Structure Logique

```
Client (Organisation)
├── nom: "SING SARL"
├── adresse: "Libreville, Gabon"
├── tel: "+241 01 23 45 67" (standard)
├── email: "contact@sing.ga" (général)
└── Représentants:
    ├── Représentant 1 (Principal)
    │   ├── nom: "Jean Dupont"
    │   ├── fonction: "Directeur Général"
    │   ├── tel: "+241 07 11 22 33"
    │   └── email: "j.dupont@sing.ga"
    └── Représentant 2
        ├── nom: "Marie Martin"
        ├── fonction: "Responsable Achats"
        ├── tel: "+241 07 44 55 66"
        └── email: "m.martin@sing.ga"
```

## Modifications Backend

### Routes API (backend/src/routes/clients.ts)

#### GET /api/clients
Retourne maintenant les clients avec leurs représentants:
```typescript
include: {
  representants: {
    orderBy: { principal: 'desc' } // Principal en premier
  },
  _count: {
    select: { documents: true }
  }
}
```

#### POST /api/clients
Accepte un tableau de représentants:
```json
{
  "nom": "SING SARL",
  "adresse": "Libreville",
  "tel": "+241 01 23 45 67",
  "email": "contact@sing.ga",
  "pays": "Gabon",
  "representants": [
    {
      "nom": "Jean Dupont",
      "fonction": "Directeur Général",
      "tel": "+241 07 11 22 33",
      "email": "j.dupont@sing.ga",
      "principal": true
    }
  ]
}
```

#### PUT /api/clients/:id
Met à jour le client et remplace tous les représentants:
- Supprime les anciens représentants
- Crée les nouveaux représentants

## Modifications Frontend

### ClientsModule.tsx

#### Affichage Liste
- Colonne "Organisation" : Nom du client + adresse
- Colonne "Représentant Principal" : Nom + fonction du représentant principal
- Colonne "Contact" : Téléphone + email du représentant principal (ou du client si pas de représentant)

#### Formulaire Création/Édition
Deux sections:
1. **Informations Organisation**
   - Nom de l'organisation (requis)
   - Adresse
   - Téléphone général
   - Email général
   - Pays

2. **Représentants / Personnes de contact**
   - Liste dynamique de représentants
   - Bouton "Ajouter un représentant"
   - Pour chaque représentant:
     - Nom complet (requis pour le premier)
     - Fonction
     - Téléphone direct
     - Email direct
     - Checkbox "Principal"
   - Bouton "Supprimer" (si plus d'un représentant)

#### Recherche
La recherche fonctionne sur:
- Nom du client
- Email du client
- Téléphone du client
- Nom des représentants
- Email des représentants

## Migration de la Base de Données

### Étape 1: Appliquer le nouveau schema
```bash
cd backend
npx prisma db push
```

### Étape 2: Régénérer le client Prisma
```bash
npx prisma generate
```

### Étape 3: Redémarrer le backend
```bash
npm run dev
```

## Données Existantes

Si vous avez déjà des clients dans la base:
- Ils resteront intacts
- Ils n'auront simplement pas de représentants au début
- Vous pouvez les éditer pour ajouter des représentants

## Utilisation dans les Documents

Lors de la création d'un document (Devis, Facture, etc.), vous pourrez:
1. Sélectionner le client (organisation)
2. Choisir le représentant à qui adresser le document
3. Les coordonnées du représentant apparaîtront sur le document PDF

## Avantages

✅ Structure conforme à l'application Excel originale
✅ Un client peut avoir plusieurs personnes de contact
✅ Identification claire du représentant principal
✅ Meilleure gestion des relations commerciales
✅ Historique des contacts par organisation
✅ Flexibilité pour les grandes organisations avec plusieurs interlocuteurs

## Prochaines Étapes

1. ✅ Schema Prisma mis à jour
2. ✅ Routes backend mises à jour
3. ✅ Module frontend mis à jour
4. 🔄 À faire: Intégrer la sélection du représentant dans les formulaires de documents
5. 🔄 À faire: Afficher le représentant sur les PDF générés

---

**Date**: 2025-01-XX
**Statut**: ✅ Prêt pour migration
