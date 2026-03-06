# SING FacturePro - Backend API

Backend TypeScript avec PostgreSQL et Prisma ORM pour l'application de gestion de facturation SING FacturePro.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
cd backend
npm install
```

### Configuration PostgreSQL

1. Créez une base de données PostgreSQL:

```sql
CREATE DATABASE sing_facturepro;
```

2. Créez un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

3. Modifiez la variable `DATABASE_URL` dans `.env`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sing_facturepro?schema=public"
```

### Initialisation avec Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables (migration)
npm run prisma:migrate

# OU pousser le schéma directement (dev)
npm run db:push

# Peupler la base de données
npm run db:seed
```

### Démarrage du serveur

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm run build
npm start
```

## 📁 Structure du projet

```
backend/
├── prisma/
│   ├── schema.prisma    # Schéma Prisma (modèles, relations)
│   └── seed.ts          # Données initiales
├── src/
│   ├── config/
│   │   └── database.ts  # Client Prisma
│   ├── middleware/
│   │   └── auth.ts      # Authentification JWT
│   ├── routes/          # Routes API
│   │   ├── auth.ts      # Login/Register
│   │   ├── clients.ts   # CRUD clients
│   │   ├── produits.ts  # CRUD produits
│   │   ├── documents.ts # CRUD documents
│   │   └── parametres.ts # Configuration
│   ├── types/           # Types TypeScript
│   └── server.ts        # Point d'entrée
└── dist/                # Code compilé
```

## 🔑 Comptes de test

Après avoir exécuté `npm run db:seed`:

**Administrateur:**
- Email: `admin@sing.ga`
- Mot de passe: `admin123`

**Utilisateur:**
- Email: `demo@sing.ga`
- Mot de passe: `demo123`

## 📝 Scripts disponibles

### Développement
- `npm run dev` - Démarrer en mode développement avec hot-reload
- `npm run build` - Compiler TypeScript vers JavaScript
- `npm start` - Démarrer en production (nécessite build)

### Prisma
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Créer et appliquer une migration
- `npm run prisma:studio` - Ouvrir Prisma Studio (GUI)
- `npm run db:push` - Pousser le schéma sans migration (dev)
- `npm run db:seed` - Peupler la base de données
- `npm run db:reset` - Réinitialiser complètement la DB

## 🛠️ Technologies

- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur actuel

### Clients (authentifié)
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Produits (authentifié)
- `GET /api/produits` - Liste des produits (filtres: categorie, actif)
- `GET /api/produits/categories` - Liste des catégories
- `GET /api/produits/:id` - Détails d'un produit
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Supprimer un produit

### Documents (authentifié)
- `GET /api/documents` - Liste des documents (filtres: type, statut, client_id)
- `GET /api/documents/:id` - Détails d'un document avec lignes
- `GET /api/documents/stats/summary` - Statistiques
- `POST /api/documents` - Créer un document avec lignes
- `PUT /api/documents/:id` - Modifier un document
- `DELETE /api/documents/:id` - Supprimer un document

### Paramètres (authentifié)
- `GET /api/parametres` - Configuration entreprise
- `PUT /api/parametres` - Modifier configuration (admin uniquement)

## 🔒 Authentification

Toutes les routes (sauf `/api/auth/*` et `/api/health`) nécessitent un token JWT dans le header:

```
Authorization: Bearer <token>
```

## 🗄️ Prisma

### Modèles principaux

- `User` - Utilisateurs de l'application
- `Client` - Clients de l'entreprise
- `Produit` - Catalogue de produits/services
- `Document` - Devis, factures, avoirs
- `LigneDocument` - Lignes de chaque document
- `Parametres` - Configuration de l'entreprise

### Enums

- `Role` - ADMIN, USER
- `TypeDocument` - DEVIS, FACTURE, AVOIR
- `StatutDocument` - ACTIVE, PAYEE, ANNULEE

### Relations

- Un document appartient à un client
- Une ligne de document référence un produit et un document
- Les suppressions de documents suppriment en cascade les lignes
- Les clients et produits ne peuvent pas être supprimés s'ils sont référencés

### Migrations

Prisma gère automatiquement les migrations:

```bash
# Créer une nouvelle migration
npm run prisma:migrate

# Appliquer les migrations en production
npx prisma migrate deploy
```

### Prisma Studio

Interface graphique pour visualiser et éditer les données:

```bash
npm run prisma:studio
```

Ouvre http://localhost:5555

## 🚨 Gestion des erreurs

### Codes HTTP
- `200` - Succès
- `201` - Créé
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `500` - Erreur serveur

### Codes d'erreur Prisma
- `P2002` - Contrainte unique violée
- `P2003` - Contrainte de clé étrangère violée
- `P2025` - Enregistrement non trouvé

Format des erreurs:
```json
{
  "error": "Message d'erreur"
}
```

## 🔧 Développement

### Modifier le schéma

1. Éditez `prisma/schema.prisma`
2. Créez une migration: `npm run prisma:migrate`
3. Le client Prisma est régénéré automatiquement

### Ajouter des données de seed

Éditez `prisma/seed.ts` et exécutez:

```bash
npm run db:seed
```

## 📚 Documentation Prisma

- [Documentation officielle](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
