# 🚀 Installation du Système de Templates PDF

## Étape 1 : Installation des Dépendances

### Backend

```bash
cd backend
npm install pdf-lib pdf-parse puppeteer multer
```

**Dépendances installées** :
- `pdf-lib` (v1.17.1) - Manipulation et création de PDFs
- `pdf-parse` (v1.1.1) - Extraction de contenu depuis PDFs
- `puppeteer` (v21.0.0) - Génération de PDFs depuis HTML (utilise Chromium)
- `multer` (v1.4.5) - Middleware pour upload de fichiers

### Note sur Puppeteer

Puppeteer télécharge automatiquement Chromium (~170-300 MB selon la plateforme). Si vous avez des problèmes :

```bash
# Option 1 : Utiliser Chrome/Chromium existant
npm install puppeteer-core

# Option 2 : Skip le téléchargement de Chromium
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer
```

## Étape 2 : Migration de la Base de Données

Le modèle `PdfTemplate` est déjà dans le schema Prisma. Appliquez la migration :

```bash
cd backend
npx prisma db push
npx prisma generate
```

Vérifiez que la table a été créée :

```bash
npx prisma studio
# Ouvrir http://localhost:5555 et vérifier la table pdf_templates
```

## Étape 3 : Créer le Dossier d'Upload

```bash
cd backend
mkdir -p uploads/templates
```

Le service créera automatiquement ce dossier s'il n'existe pas, mais il est préférable de le créer manuellement avec les bonnes permissions.

### Permissions (Linux/Mac)

```bash
chmod 755 uploads
chmod 755 uploads/templates
```

### Permissions (Windows)

Aucune action nécessaire, les permissions par défaut sont suffisantes.

## Étape 4 : Vérifier les Routes

Les routes sont déjà ajoutées dans `backend/src/server.ts` :

```typescript
import templatesRoutes from './routes/templates.js';
import pdfRoutes from './routes/pdf.js';

app.use('/api/templates', templatesRoutes);
app.use('/api/pdf', pdfRoutes);
```

## Étape 5 : Démarrer le Serveur

```bash
cd backend
npm run dev
```

Vérifiez que le serveur démarre sans erreur et que les routes sont disponibles :

```
🚀 Serveur SING FacturePro démarré
📍 URL: http://localhost:5000
📊 API: http://localhost:5000/api
```

## Étape 6 : Tester l'API

### Test 1 : Health Check

```bash
curl http://localhost:5000/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "message": "SING FacturePro API",
  "version": "2.0.0"
}
```

### Test 2 : Liste des Templates (vide au début)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/templates
```

Réponse attendue :
```json
[]
```

### Test 3 : Upload d'un Template

Créez un fichier PDF de test ou utilisez un existant :

```bash
curl -X POST http://localhost:5000/api/templates/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "template=@test.pdf" \
  -F "nom=Template Test" \
  -F "type=DEVIS"
```

Réponse attendue :
```json
{
  "message": "Template uploaded successfully",
  "template": {
    "id": 1,
    "nom": "Template Test",
    "type": "DEVIS",
    "couleurPrimaire": "#003366",
    "couleurSecondaire": "#FDB913",
    "couleurTexte": "#000000",
    "police": "Helvetica",
    "actif": true,
    "parDefaut": false,
    "createdAt": "2026-03-23T..."
  }
}
```

## Étape 7 : Intégrer dans le Frontend

### 7.1 Ajouter le Module Templates au Dashboard

Ouvrir `frontend/src/pages/DashboardNew.tsx` et ajouter :

```typescript
import { TemplatesModule } from '../components/TemplatesModule';

// Dans la fonction renderModule()
case 'templates':
  return <TemplatesModule />;
```

### 7.2 Ajouter dans la Navigation

Dans le même fichier, ajouter dans `menuItems` :

```typescript
{
  id: 'templates',
  label: 'Templates PDF',
  icon: '📄',
  description: 'Gérer les modèles de documents'
}
```

### 7.3 Ajouter les Boutons de Génération PDF

Dans `DevisModule.tsx`, ajouter un bouton pour générer le PDF :

```typescript
<button
  onClick={async () => {
    try {
      await api.generateDevisPdf(devis.id);
      alert('PDF téléchargé avec succès !');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  }}
  style={{
    padding: '8px 16px',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}
>
  📄 Télécharger PDF
</button>
```

## Étape 8 : Test Complet

### 8.1 Upload d'un Template

1. Se connecter à l'application
2. Aller dans "Templates PDF"
3. Cliquer sur "Nouveau Template"
4. Remplir le formulaire :
   - Nom : "Facture SING Standard"
   - Type : "FACTURE"
   - Fichier : Sélectionner un PDF
5. Cliquer sur "Uploader"

### 8.2 Définir comme Par Défaut

1. Dans la liste des templates
2. Cliquer sur "Définir par défaut"
3. Vérifier que le badge "PAR DÉFAUT" apparaît

### 8.3 Générer un PDF

1. Aller dans "Devis" (ou Factures)
2. Sélectionner un devis existant
3. Cliquer sur "📄 Télécharger PDF"
4. Le PDF devrait se télécharger avec le style du template

## Dépannage

### Erreur : "Chromium not found"

```bash
# Réinstaller Puppeteer
cd backend
npm uninstall puppeteer
npm install puppeteer
```

### Erreur : "Permission denied" sur uploads/

```bash
# Linux/Mac
chmod -R 755 backend/uploads

# Windows : Vérifier les permissions du dossier
```

### Erreur : "Template not found"

Vérifier que :
1. Le template a bien été uploadé
2. Le template est actif
3. Le template est défini comme par défaut (ou spécifier l'ID)

### Erreur : "Failed to generate PDF"

Vérifier les logs du serveur :
```bash
cd backend
npm run dev
# Observer les erreurs dans la console
```

### PDF vide ou mal formaté

1. Vérifier que les données du document existent
2. Vérifier que le client et les lignes sont bien renseignés
3. Vérifier les logs Puppeteer dans la console

## Variables d'Environnement (Optionnel)

Ajouter dans `backend/.env` :

```env
# Dossier d'upload (par défaut : uploads/templates)
UPLOAD_DIR=uploads/templates

# Taille max des fichiers (par défaut : 10MB)
MAX_FILE_SIZE=10485760

# Activer les logs Puppeteer
PUPPETEER_DEBUG=true
```

## Performance

### Optimisation Puppeteer

Pour améliorer les performances de génération PDF :

```typescript
// Dans pdfGenerationService.ts
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',  // Réduit l'utilisation mémoire
    '--disable-gpu'              // Désactive le GPU
  ]
});
```

### Cache du Navigateur

Réutiliser l'instance du navigateur :

```typescript
// Créer une instance globale
let browserInstance: Browser | null = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({...});
  }
  return browserInstance;
}
```

## Prochaines Étapes

1. ✅ Installer les dépendances
2. ✅ Appliquer les migrations
3. ✅ Tester l'upload de templates
4. ✅ Tester la génération de PDFs
5. 🔄 Personnaliser les templates
6. 🔄 Ajouter des templates pour chaque type de document
7. 🔄 Former les utilisateurs

## Support

En cas de problème :

1. Vérifier les logs du serveur
2. Vérifier la console du navigateur
3. Consulter la documentation Puppeteer : https://pptr.dev/
4. Consulter la documentation pdf-lib : https://pdf-lib.js.org/

---

**Temps d'installation estimé** : 10-15 minutes  
**Difficulté** : Moyenne  
**Prérequis** : Node.js 18+, PostgreSQL, npm
