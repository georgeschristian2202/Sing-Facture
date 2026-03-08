# ✅ Correction: Structure Client-Représentant

## Problème Identifié par l'Utilisateur

L'utilisateur a correctement identifié que dans les images Excel et la documentation, un **Client** est une **organisation** (entreprise) qui possède des **représentants** (personnes de contact). Cette structure importante n'était pas implémentée dans la première version.

## Ce qui a été corrigé

### 1. Schema Prisma (backend/prisma/schema.prisma)

#### Ajout de la table Representant
```prisma
model Representant {
  id        Int      @id @default(autoincrement())
  clientId  Int      @map("client_id")
  client    Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  nom       String   // Nom complet du représentant
  fonction  String?  // Poste/Fonction
  tel       String?  // Téléphone direct
  email     String?  // Email direct
  principal Boolean  @default(false) // Représentant principal
  createdAt DateTime @default(now()) @map("created_at")

  @@index([clientId])
  @@map("representants")
}
```

#### Modification de la table Client
```prisma
model Client {
  // ... champs existants
  representants  Representant[] // ✅ AJOUTÉ
}
```

### 2. Routes Backend (backend/src/routes/clients.ts)

#### GET /api/clients
- Inclut maintenant les représentants dans la réponse
- Tri par représentant principal en premier

#### POST /api/clients
- Accepte un tableau `representants` dans le body
- Crée le client et ses représentants en une seule transaction

#### PUT /api/clients/:id
- Met à jour le client
- Remplace tous les représentants (supprime les anciens, crée les nouveaux)

#### GET /api/clients/:id
- Retourne le client avec ses représentants et documents

### 3. Module Frontend (frontend/src/components/ClientsModule.tsx)

#### Formulaire Amélioré
Deux sections distinctes:

**Section 1: Informations Organisation**
- Nom de l'organisation (requis)
- Adresse complète
- Téléphone général (standard)
- Email général
- Pays

**Section 2: Représentants / Personnes de contact**
- Gestion dynamique des représentants
- Bouton "+ Ajouter un représentant"
- Pour chaque représentant:
  - Nom complet (requis pour le premier)
  - Fonction/Poste
  - Téléphone direct
  - Email direct
  - Checkbox "Principal" (un seul peut être principal)
- Bouton "Supprimer" pour retirer un représentant
- Design visuel différent pour le représentant principal (fond jaune SING)

#### Affichage Liste
- **Colonne "Organisation"**: Nom + adresse du client
- **Colonne "Représentant Principal"**: Nom + fonction du contact principal
- **Colonne "Contact"**: Téléphone + email du représentant (ou du client si pas de représentant)
- **Colonne "Pays"**: Pays du client
- **Colonne "Documents"**: Nombre de documents liés
- **Colonne "Actions"**: Modifier / Supprimer

#### Recherche Améliorée
Recherche dans:
- Nom du client (organisation)
- Email du client
- Téléphone du client
- Nom des représentants
- Email des représentants

## Exemple de Données

### Création d'un client avec représentants
```json
{
  "nom": "SING SARL",
  "adresse": "Quartier Batterie IV, Libreville",
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
    },
    {
      "nom": "Marie Martin",
      "fonction": "Responsable Achats",
      "tel": "+241 07 44 55 66",
      "email": "m.martin@sing.ga",
      "principal": false
    }
  ]
}
```

### Réponse API
```json
{
  "id": 1,
  "nom": "SING SARL",
  "adresse": "Quartier Batterie IV, Libreville",
  "tel": "+241 01 23 45 67",
  "email": "contact@sing.ga",
  "pays": "Gabon",
  "organisationId": 1,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "representants": [
    {
      "id": 1,
      "clientId": 1,
      "nom": "Jean Dupont",
      "fonction": "Directeur Général",
      "tel": "+241 07 11 22 33",
      "email": "j.dupont@sing.ga",
      "principal": true,
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "clientId": 1,
      "nom": "Marie Martin",
      "fonction": "Responsable Achats",
      "tel": "+241 07 44 55 66",
      "email": "m.martin@sing.ga",
      "principal": false,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "_count": {
    "documents": 5
  }
}
```

## Migration Nécessaire

### Commandes à exécuter

```bash
# 1. Arrêter le backend (Ctrl+C)

# 2. Appliquer les modifications du schema
cd backend
npx prisma db push

# 3. Régénérer le client Prisma
npx prisma generate

# 4. Redémarrer le backend
npm run dev
```

## Impact sur les Données Existantes

- ✅ Les clients existants restent intacts
- ✅ Ils n'auront simplement pas de représentants au début
- ✅ Vous pouvez les éditer pour ajouter des représentants
- ✅ Aucune perte de données

## Utilisation Future dans les Documents

Lors de la création d'un document (Devis, Facture, etc.):
1. Sélectionner le client (organisation)
2. Choisir le représentant destinataire
3. Le document PDF affichera:
   - Nom de l'organisation cliente
   - Nom et fonction du représentant
   - Coordonnées du représentant

## Conformité avec l'Application Excel

✅ **Client = Organisation** (comme dans Excel)
✅ **Représentants = Personnes de contact** (comme dans Excel)
✅ **Un représentant principal** (comme dans Excel)
✅ **Plusieurs représentants possibles** (comme dans Excel)
✅ **Coordonnées séparées** (organisation vs représentant)

## Fichiers Modifiés

1. `backend/prisma/schema.prisma` - Ajout table Representant
2. `backend/src/routes/clients.ts` - Routes mises à jour
3. `frontend/src/components/ClientsModule.tsx` - Module réécrit
4. `MIGRATION_REPRESENTANTS.md` - Documentation migration
5. `CORRECTION_CLIENTS_REPRESENTANTS.md` - Ce fichier

## Statut

✅ Schema Prisma corrigé
✅ Routes backend mises à jour
✅ Module frontend réécrit
✅ Aucune erreur de diagnostic
🔄 Migration à exécuter par l'utilisateur
🔄 Tests à effectuer après migration

---

**Merci à l'utilisateur d'avoir identifié cette erreur importante !**

La structure est maintenant conforme à la documentation et aux images Excel fournies.
