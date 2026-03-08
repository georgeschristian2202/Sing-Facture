# Guide de Dépannage - SING FacturePro

## ❌ Erreur: "Cannot read properties of undefined (reading 'findUnique')"

### Cause
Le Prisma Client n'a pas été régénéré après les modifications du schema.

### Solution

#### Windows (PowerShell)
```powershell
# 1. Arrêter le serveur backend (Ctrl+C)

# 2. Aller dans le dossier backend
cd backend

# 3. Utiliser le script automatique
.\regenerate-prisma.ps1

# OU manuellement:
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate

# 4. Redémarrer le serveur
npm run dev
```

#### Linux/Mac (Bash)
```bash
# 1. Arrêter le serveur backend (Ctrl+C)

# 2. Aller dans le dossier backend
cd backend

# 3. Utiliser le script automatique
chmod +x regenerate-prisma.sh
./regenerate-prisma.sh

# OU manuellement:
rm -rf node_modules/.prisma
npx prisma generate

# 4. Redémarrer le serveur
npm run dev
```

## ❌ Erreur: "Failed to load resource: the server responded with a status of 500"

### Causes possibles
1. Backend non démarré
2. Prisma Client non régénéré
3. Base de données non accessible
4. Erreur dans le code backend

### Solutions

#### 1. Vérifier que le backend est démarré
```bash
cd backend
npm run dev
```

Vous devriez voir:
```
🚀 Serveur SING FacturePro démarré
📍 URL: http://localhost:5005
✅ Connecté à PostgreSQL via Prisma
```

#### 2. Vérifier la connexion à la base de données
```bash
cd backend
npx prisma db pull
```

#### 3. Vérifier les logs du serveur
Regardez la console du serveur backend pour voir les erreurs détaillées.

## ❌ Erreur: "CORS policy"

### Cause
Le frontend et le backend ne sont pas sur les bons ports.

### Solution
Vérifier les fichiers de configuration:

**backend/.env**
```env
PORT=5005
CORS_ORIGIN=http://localhost:5174
```

**frontend/vite.config.ts**
```typescript
server: {
  port: 5174,
  proxy: {
    '/api': {
      target: 'http://localhost:5005',
      changeOrigin: true
    }
  }
}
```

## ❌ Erreur: "Token invalide" ou redirection vers login

### Causes
1. Token expiré (24h)
2. Token corrompu
3. Backend redémarré (les tokens deviennent invalides)

### Solution
1. Se déconnecter
2. Se reconnecter
3. Le nouveau token sera valide

## ❌ Erreur lors de l'inscription: "Cet email est déjà utilisé"

### Solution
1. Utiliser un autre email
2. OU supprimer l'utilisateur existant de la base de données:

```bash
cd backend
npx prisma studio
```

Puis supprimer l'utilisateur dans l'interface Prisma Studio.

## 🔄 Réinitialiser complètement la base de données

**⚠️ ATTENTION: Cela supprimera toutes les données!**

```bash
cd backend
npx prisma migrate reset --force
npx prisma generate
npm run dev
```

## 📝 Vérifier l'état de Prisma

```bash
cd backend

# Voir le schema actuel
npx prisma format

# Vérifier la connexion DB
npx prisma db pull

# Voir les migrations
npx prisma migrate status

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

## 🚀 Démarrage complet du projet

### Terminal 1 - Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Accès
- Frontend: http://localhost:5174
- Backend API: http://localhost:5005/api
- Prisma Studio: `npx prisma studio` (port 5555)

## 📞 Support

Si les problèmes persistent:
1. Vérifier les logs du backend
2. Vérifier la console du navigateur (F12)
3. Vérifier que PostgreSQL est accessible
4. Vérifier les variables d'environnement dans `.env`

## 🔍 Commandes de diagnostic

```bash
# Vérifier les ports utilisés
netstat -ano | findstr :5005
netstat -ano | findstr :5174

# Vérifier les processus Node
tasklist | findstr node

# Tuer un processus si nécessaire (Windows)
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5005
kill -9 <PID>
```
