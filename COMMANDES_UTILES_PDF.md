# 🛠️ Commandes Utiles - Système Templates PDF

## Installation

### Installation Automatique

**Windows (PowerShell)** :
```powershell
cd backend
.\install-pdf-system.ps1
```

**Linux/Mac (Bash)** :
```bash
cd backend
chmod +x install-pdf-system.sh
./install-pdf-system.sh
```

### Installation Manuelle

```bash
# 1. Installer les dépendances
cd backend
npm install pdf-lib pdf-parse puppeteer multer

# 2. Créer le dossier d'upload
mkdir -p uploads/templates

# 3. Appliquer les migrations
npx prisma db push

# 4. Générer le client Prisma
npx prisma generate
```

## Développement

### Démarrer le