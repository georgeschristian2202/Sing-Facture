# SING FacturePro - Frontend

Application React + TypeScript pour la gestion commerciale.

## 🚀 Démarrage

```bash
# Installation
npm install

# Configuration
cp .env.example .env

# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Structure

```
src/
├── pages/          # Pages de l'application
│   ├── LandingPage.tsx
│   └── Dashboard.tsx
├── App.tsx         # Composant principal avec routing
├── main.tsx        # Point d'entrée
└── index.css       # Styles globaux
```

## 🔧 Configuration

Créez un fichier `.env` avec:

```
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Technologies

- React 18
- TypeScript
- Vite
- React Router DOM
- CSS-in-JS (inline styles)

## 📝 Scripts

- `npm run dev` - Serveur de développement avec HMR
- `npm run build` - Build optimisé pour production
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Linter le code

## 🌐 Proxy API

Le serveur de développement Vite est configuré pour proxifier les requêtes `/api` vers le backend sur `http://localhost:5000`.

## 📦 Build

Le build de production est généré dans le dossier `dist/` et peut être servi par n'importe quel serveur web statique.
