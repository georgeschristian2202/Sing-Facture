# Guide d'Authentification - SING FacturePro

## 🎯 Système d'Inscription et Connexion

Le système d'authentification complet a été mis en place avec gestion des organisations multi-tenant.

## 📋 Fonctionnalités

### 1. Inscription (Register)
- **Route**: `/register`
- **Étapes**: 2 étapes (Informations personnelles + Informations entreprise)

#### Étape 1 - Informations personnelles
- Nom complet (requis)
- Email (requis)
- Mot de passe (requis, min 6 caractères)
- Confirmation mot de passe (requis)

#### Étape 2 - Informations entreprise
- Nom de l'entreprise (requis)
- Email entreprise (optionnel)
- Téléphone (optionnel)
- Adresse (optionnel)
- RCCM (optionnel)
- Capital (optionnel)
- Plan (STARTER/BUSINESS/ENTERPRISE)

#### Processus d'inscription
1. Création de l'organisation
2. Création de l'utilisateur admin
3. Création des paramètres par défaut
4. Attribution de 14 jours d'essai gratuit
5. Génération du token JWT
6. Redirection vers le dashboard

### 2. Connexion (Login)
- **Route**: `/login`
- Email + Mot de passe
- Vérification du compte actif
- Génération du token JWT
- Chargement des données organisation
- Redirection vers le dashboard

### 3. Dashboard
- **Route**: `/dashboard`
- Protégé par authentification
- Affichage des informations utilisateur et organisation
- Statistiques en temps réel
- Bouton de déconnexion

## 🔐 Sécurité

### Backend
- Mots de passe hashés avec bcrypt (10 rounds)
- Tokens JWT avec expiration 24h
- Middleware d'authentification
- Validation des données
- Protection CORS

### Frontend
- Token stocké dans localStorage
- Routes protégées avec redirection
- Gestion des erreurs d'authentification
- Déconnexion automatique si token invalide

## 🗄️ Base de Données

### Modèle Organisation
```prisma
model Organisation {
  id              Int      @id @default(autoincrement())
  nom             String
  email           String   @unique
  telephone       String?
  adresse         String?
  rccm            String?
  capital         String?
  plan            Plan     @default(STARTER)
  actif           Boolean  @default(true)
  dateExpiration  DateTime?
  users           User[]
  clients         Client[]
  produits        Produit[]
  documents       Document[]
  parametres      Parametres?
}
```

### Modèle User
```prisma
model User {
  id             Int           @id @default(autoincrement())
  email          String        @unique
  password       String
  nom            String
  role           Role          @default(USER)
  organisationId Int
  organisation   Organisation  @relation(...)
}
```

## 🚀 Utilisation

### Démarrer le backend
```bash
cd backend
npm run dev
```
Port: 5005

### Démarrer le frontend
```bash
cd frontend
npm run dev
```
Port: 5174

## 📡 API Endpoints

### POST /api/auth/register
Inscription complète avec création d'organisation

**Body**:
```json
{
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123",
  "companyName": "Mon Entreprise SARL",
  "companyEmail": "contact@entreprise.com",
  "telephone": "+241 XX XX XX XX",
  "adresse": "Libreville, Gabon",
  "rccm": "GA-LBV-01-2024-XXX",
  "capital": "10 000 000 FCFA",
  "plan": "STARTER"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jean@example.com",
    "nom": "Jean Dupont",
    "role": "ADMIN",
    "organisationId": 1,
    "organisation": {
      "id": 1,
      "nom": "Mon Entreprise SARL",
      "email": "contact@entreprise.com",
      "plan": "STARTER",
      "actif": true,
      "dateExpiration": "2026-03-22T00:00:00.000Z"
    }
  }
}
```

### POST /api/auth/login
Connexion utilisateur

**Body**:
```json
{
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

**Response**: Même format que register

### GET /api/auth/me
Récupérer l'utilisateur connecté

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": 1,
  "email": "jean@example.com",
  "nom": "Jean Dupont",
  "role": "ADMIN",
  "organisationId": 1,
  "organisation": {
    "id": 1,
    "nom": "Mon Entreprise SARL",
    "email": "contact@entreprise.com",
    "telephone": "+241 XX XX XX XX",
    "plan": "STARTER",
    "actif": true,
    "dateExpiration": "2026-03-22T00:00:00.000Z"
  }
}
```

## 🎨 Pages Frontend

### Landing Page (/)
- Présentation du produit
- Fonctionnalités
- Tarifs
- Témoignages
- FAQ
- Boutons vers inscription/connexion

### Page d'inscription (/register)
- Formulaire en 2 étapes
- Validation en temps réel
- Gestion des erreurs
- Progress bar

### Page de connexion (/login)
- Formulaire simple
- Gestion des erreurs
- Liens vers inscription et accueil

### Dashboard (/dashboard)
- Header avec infos organisation
- Statistiques en temps réel
- Liste des clients
- Liste des produits
- Bouton de déconnexion

## 🔄 Flux d'Authentification

```
Landing Page
    ↓
[Inscription] → Formulaire 2 étapes → API Register → Token → Dashboard
    ↓
[Connexion] → Formulaire login → API Login → Token → Dashboard
    ↓
Dashboard → Chargement données → Affichage
    ↓
[Déconnexion] → Suppression token → Redirection Login
```

## ✅ Tests

Pour tester le système :

1. Accéder à http://localhost:5174
2. Cliquer sur "Commencer" ou "Créer un compte"
3. Remplir le formulaire d'inscription
4. Vérifier la redirection vers le dashboard
5. Vérifier l'affichage des informations
6. Tester la déconnexion
7. Tester la reconnexion

## 🐛 Gestion des Erreurs

- Email déjà utilisé
- Mot de passe trop court
- Mots de passe non correspondants
- Champs requis manquants
- Token invalide/expiré
- Compte désactivé
- Erreurs serveur

Toutes les erreurs sont affichées de manière claire à l'utilisateur.

## 📝 Notes

- Les mots de passe doivent contenir au moins 6 caractères
- L'essai gratuit dure 14 jours
- Le premier utilisateur créé est automatiquement ADMIN
- Les paramètres par défaut incluent les taux TPS (9.5%) et CSS (1%)
- Chaque organisation est isolée (multi-tenant)
