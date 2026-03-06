# Backend SING FacturePro

API REST pour l'application de gestion commerciale SING FacturePro.

## 🚀 Installation

```bash
cd server
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Modifier les valeurs dans `.env` :
```
PORT=5000
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=development
```

## 🌱 Initialiser la base de données

```bash
node seed.js
```

Cela créera :
- Les tables de la base de données
- Un utilisateur de test (demo@sing.ga / demo123)
- Des clients de démonstration
- Des produits de démonstration

## 🏃 Démarrage

```bash
npm start
```

Le serveur démarre sur http://localhost:5000

## 📚 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Clients (authentification requise)

- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Produits (authentification requise)

- `GET /api/produits` - Liste des produits
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Désactiver un produit

### Documents (authentification requise)

- `GET /api/documents?type=facture&statut=Active` - Liste des documents
- `GET /api/documents/:id` - Détail d'un document
- `POST /api/documents` - Créer un document
- `PATCH /api/documents/:id/statut` - Modifier le statut
- `DELETE /api/documents/:id` - Supprimer un document

### Paramètres (authentification requise)

- `GET /api/parametres` - Récupérer les paramètres
- `PUT /api/parametres` - Modifier les paramètres

## 🔐 Authentification

Toutes les routes (sauf `/api/auth/*`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <votre_token>
```

## 📦 Technologies

- Express.js - Framework web
- better-sqlite3 - Base de données SQLite
- JWT - Authentification
- bcryptjs - Hashage des mots de passe
- CORS - Gestion des requêtes cross-origin

## 🗄️ Structure de la base de données

- `users` - Utilisateurs de l'application
- `clients` - Clients de l'entreprise
- `produits` - Catalogue des prestations
- `documents` - Devis, commandes, livraisons, factures
- `lignes_document` - Lignes de chaque document
- `parametres` - Configuration de l'entreprise

## 📝 Exemple de requête

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@sing.ga","password":"demo123"}'
```

### Créer un client
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token>" \
  -d '{"nom":"Nouveau Client","adresse":"Libreville","tel":"+241 XX XX XX XX","pays":"Gabon"}'
```

## 🔧 Développement

Mode watch (redémarre automatiquement) :
```bash
npm run dev
```
