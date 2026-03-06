# SING FacturePro

Application web complète de gestion commerciale pour SING S.A. avec PostgreSQL, Prisma ORM et architecture frontend/backend séparée.

## 🏗️ Architecture

- **Backend**: API REST Node.js + TypeScript + PostgreSQL + Prisma ORM
- **Frontend**: Application React + TypeScript + Vite
- **Base de données**: PostgreSQL avec Prisma pour les migrations et le typage
- **Authentification**: JWT avec bcrypt

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd sing-facture-pro
```

### 2. Configuration PostgreSQL

Créez une base de données PostgreSQL:

```sql
CREATE DATABASE sing_facturepro;
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditez .env avec votre DATABASE_URL PostgreSQL
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Le serveur démarre sur http://localhost:5000

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

L'application démarre sur http://localhost:5173

## 🔑 Comptes de test

Après `npm run db:seed`:

**Administrateur:**
- Email: `admin@sing.ga`
- Mot de passe: `admin123`

**Utilisateur:**
- Email: `demo@sing.ga`
- Mot de passe: `demo123`

## 📁 Structure du projet

```
sing-facture-pro/
├── backend/              # API Node.js + TypeScript + Prisma
│   ├── prisma/
│   │   ├── schema.prisma # Schéma Prisma (modèles)
│   │   └── seed.ts       # Données initiales
│   ├── src/
│   │   ├── config/       # Client Prisma
│   │   ├── middleware/   # Auth JWT
│   │   ├── routes/       # Routes API
│   │   ├── types/        # Types TypeScript
│   │   └── server.ts     # Point d'entrée
│   └── package.json
│
└── frontend/             # React + TypeScript + Vite
    ├── src/
    │   ├── pages/        # Pages React
    │   ├── services/     # API client
    │   ├── App.tsx       # Composant principal
    │   └── main.tsx      # Point d'entrée
    └── package.json
```

## 🛠️ Technologies

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM (migrations, typage, queries)
- JWT + bcryptjs
- Dotenv

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- Fetch API

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur actuel

### Clients (authentifié)
- `GET /api/clients` - Liste
- `POST /api/clients` - Créer
- `PUT /api/clients/:id` - Modifier
- `DELETE /api/clients/:id` - Supprimer

### Produits (authentifié)
- `GET /api/produits` - Liste (filtres: categorie, actif)
- `GET /api/produits/categories` - Catégories
- `POST /api/produits` - Créer
- `PUT /api/produits/:id` - Modifier
- `DELETE /api/produits/:id` - Supprimer

### Documents (authentifié)
- `GET /api/documents` - Liste (filtres: type, statut, client_id)
- `GET /api/documents/:id` - Détails avec lignes
- `GET /api/documents/stats/summary` - Statistiques
- `POST /api/documents` - Créer avec lignes
- `PUT /api/documents/:id` - Modifier
- `DELETE /api/documents/:id` - Supprimer

### Paramètres (authentifié)
- `GET /api/parametres` - Configuration
- `PUT /api/parametres` - Modifier (admin uniquement)

## 🗄️ Base de données (Prisma)

### Modèles

- `User` - Utilisateurs (admin/user)
- `Client` - Clients de l'entreprise
- `Produit` - Catalogue produits/services
- `Document` - Devis, factures, avoirs
- `LigneDocument` - Lignes de documents
- `Parametres` - Configuration entreprise

### Enums

- `Role` - ADMIN, USER
- `TypeDocument` - DEVIS, FACTURE, AVOIR
- `StatutDocument` - ACTIVE, PAYEE, ANNULEE

### Données initiales (seed)

- 2 utilisateurs (admin + demo)
- 6 clients
- 23 produits répartis en 5 catégories:
  - Programme (4)
  - SING Logiciels (6)
  - SING Conseil (5)
  - Incubateur (5)
  - Services (3)

## 📝 Scripts

### Backend
```bash
npm run dev              # Développement avec hot-reload
npm run build            # Compiler TypeScript
npm start                # Production
npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Créer migration
npm run prisma:studio    # Interface graphique DB
npm run db:push          # Pousser schéma (dev)
npm run db:seed          # Initialiser données
npm run db:reset         # Réinitialiser DB
```

### Frontend
```bash
npm run dev        # Développement
npm run build      # Build production
npm run preview    # Prévisualiser build
```

## 🌍 Variables d'environnement

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/sing_facturepro?schema=public"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- JWT avec expiration 24h
- Validation des données côté serveur
- Contraintes de base de données via Prisma
- CORS configuré
- Protection contre les injections SQL (Prisma)
- Types TypeScript générés automatiquement

## 🎯 Avantages de Prisma

✅ **Type-safety**: Types TypeScript auto-générés depuis le schéma
✅ **Migrations**: Gestion automatique des migrations de DB
✅ **Relations**: Gestion intuitive des relations entre tables
✅ **Queries**: API fluide et type-safe pour les requêtes
✅ **Studio**: Interface graphique pour visualiser les données
✅ **Performance**: Requêtes optimisées automatiquement
✅ **Validation**: Validation au niveau du schéma

## 📚 Documentation

- [Backend README](./backend/README.md) - Documentation API détaillée
- [Frontend README](./frontend/README.md) - Documentation frontend
- [Prisma Docs](https://www.prisma.io/docs) - Documentation Prisma

## 🚧 Développement

### Modifier le schéma de base de données

1. Éditez `backend/prisma/schema.prisma`
2. Créez une migration: `npm run prisma:migrate`
3. Le client Prisma est régénéré automatiquement

### Ajouter une nouvelle route API

1. Créer le fichier dans `backend/src/routes/`
2. Utiliser le client Prisma pour les queries
3. Importer dans `backend/src/server.ts`
4. Ajouter les méthodes dans `frontend/src/services/api.ts`

### Visualiser les données

```bash
cd backend
npm run prisma:studio
```

Ouvre http://localhost:5555 avec une interface graphique

## 📄 Licence

UNLICENSED - © 2026 SING S.A.
