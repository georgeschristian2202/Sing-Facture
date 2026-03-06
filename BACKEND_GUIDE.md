# 🚀 Guide Backend - SING FacturePro

## Vue d'ensemble

Le backend est une API REST construite avec Node.js/Express et SQLite. Il gère l'authentification, les clients, les produits, les documents (devis, factures, etc.) et les paramètres de l'entreprise.

## 📁 Structure du backend

```
server/
├── routes/
│   ├── auth.js           # Authentification (login, register)
│   ├── clients.js        # Gestion des clients
│   ├── produits.js       # Catalogue des produits
│   ├── documents.js      # Devis, factures, etc.
│   └── parametres.js     # Configuration entreprise
├── middleware/
│   └── auth.js           # Middleware JWT
├── database.js           # Configuration SQLite
├── seed.js              # Données de démonstration
├── server.js            # Point d'entrée
└── package.json
```

## 🔧 Installation rapide

```bash
cd server
npm install
node seed.js
npm start
```

Compte de test : `demo@sing.ga` / `demo123`

## 📡 Endpoints principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion (retourne un token JWT)

### Clients (authentification requise)
- `GET /api/clients` - Liste
- `POST /api/clients` - Créer
- `PUT /api/clients/:id` - Modifier
- `DELETE /api/clients/:id` - Supprimer

### Produits
- `GET /api/produits` - Liste
- `POST /api/produits` - Créer
- `PUT /api/produits/:id` - Modifier
- `DELETE /api/produits/:id` - Désactiver

### Documents (devis, factures, etc.)
- `GET /api/documents?type=facture&statut=Active` - Liste
- `GET /api/documents/:id` - Détail avec lignes
- `POST /api/documents` - Créer (calculs automatiques)
- `PATCH /api/documents/:id/statut` - Modifier statut
- `DELETE /api/documents/:id` - Supprimer

### Paramètres
- `GET /api/parametres` - Configuration entreprise
- `PUT /api/parametres` - Modifier

Voir [server/README.md](./server/README.md) pour la documentation complète.
