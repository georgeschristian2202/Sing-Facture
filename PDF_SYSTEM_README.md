# 📄 Système de Templates PDF - Guide Rapide

## 🎯 Qu'est-ce que c'est ?

Un système complet qui permet de :
1. **Téléverser** un modèle PDF de facture/devis
2. **Extraire automatiquement** les couleurs et la typographie
3. **Générer des PDFs** conformes au style du modèle

## ✨ Fonctionnalités

- ✅ Upload de templates PDF (max 10 MB)
- ✅ Extraction automatique des styles (couleurs, police)
- ✅ Gestion de plusieurs templates par type de document
- ✅ Définition d'un template par défaut
- ✅ Modification manuelle des couleurs et polices
- ✅ Génération PDF avec le style du template
- ✅ Téléchargement ou prévisualisation

## 🚀 Installation Rapide

### Option 1 : Script Automatique (Recommandé)

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

### Option 2 : Installation Manuelle

```bash
cd backend

# 1. Installer les dépendances
npm install pdf-lib pdf-parse puppeteer multer

# 2. Créer le dossier d'upload
mkdir -p uploads/templates

# 3. Appliquer les migrations
npx prisma db push
npx prisma generate

# 4. Démarrer le serveur
npm run dev
```

## 📖 Utilisation

### 1. Uploader un Template

1. Se connecter à l'application
2. Aller dans **"Templates PDF"** (menu latéral)
3. Cliquer sur **"+ Nouveau Template"**
4. Remplir le formulaire :
   - **Nom** : "Facture SING Standard"
   - **Type** : Sélectionner le type (DEVIS, FACTURE, etc.)
   - **Fichier** : Choisir votre PDF modèle
5. Cliquer sur **"Uploader"**

Le système analyse automatiquement le PDF et extrait :
- Couleur primaire
- Couleur secondaire
- Couleur du texte
- Police principale

### 2. Définir comme Par Défaut

1. Dans la liste des templates
2. Cliquer sur **"Définir par défaut"**
3. Le badge **"PAR DÉFAUT"** apparaît

### 3. Personnaliser les Couleurs

1. Cliquer sur l'icône **✏️** (éditer)
2. Modifier les couleurs avec le color picker
3. Modifier la police si nécessaire
4. Cliquer sur **"Enregistrer"**

### 4. Générer un PDF

Dans le module Devis/Facture :
1. Sélectionner un document
2. Cliquer sur **"📄 Télécharger PDF"**
3. Le PDF se génère avec le style du template par défaut

## 🏗️ Architecture

### Backend

```
backend/
├── src/
│   ├── services/
│   │   ├── templateService.ts       # Gestion des templates
│   │   └── pdfGenerationService.ts  # Génération de PDFs
│   └── routes/
│       ├── templates.ts             # API templates
│       └── pdf.ts                   # API génération PDF
└── uploads/
    └── templates/                   # Stockage des PDFs uploadés
```

### Frontend

```
frontend/
└── src/
    ├── components/
    │   └── TemplatesModule.tsx      # Interface de gestion
    └── services/
        └── api.ts                   # Méthodes API
```

### Base de Données

Table `pdf_templates` :
- `id` - Identifiant unique
- `organisationId` - Isolation par organisation
- `nom` - Nom du template
- `type` - Type de document (DEVIS, FACTURE, etc.)
- `fichierOriginal` - Chemin du PDF uploadé
- `couleurPrimaire` - Couleur principale (#003366)
- `couleurSecondaire` - Couleur secondaire (#FDB913)
- `couleurTexte` - Couleur du texte (#000000)
- `police` - Police principale (Helvetica)
- `actif` - Template actif ou non
- `parDefaut` - Template par défaut pour ce type

## 🔌 API Endpoints

### Templates

```
POST   /api/templates/upload        # Upload un template
GET    /api/templates               # Liste les templates
GET    /api/templates?type=DEVIS    # Filtre par type
PUT    /api/templates/:id/default   # Définit comme par défaut
PUT    /api/templates/:id           # Met à jour un template
DELETE /api/templates/:id           # Supprime un template
```

### Génération PDF

```
POST /api/pdf/generate/:type/:id    # Génère et télécharge un PDF
GET  /api/pdf/preview/:type/:id     # Prévisualise un PDF
```

## 📦 Dépendances

- **pdf-lib** - Manipulation de PDFs
- **pdf-parse** - Extraction de contenu PDF
- **puppeteer** - Génération PDF depuis HTML (utilise Chromium)
- **multer** - Upload de fichiers

## 🎨 Styles Appliqués

Le PDF généré utilise automatiquement :

1. **Couleur Primaire** :
   - En-têtes de tableau
   - Titres de sections
   - Bordures principales
   - Ligne "Net à payer"

2. **Couleur Secondaire** :
   - Accents et highlights
   - Badges de type
   - Bordures secondaires

3. **Couleur Texte** :
   - Texte principal du document

4. **Police** :
   - Toute la typographie

## 🔒 Sécurité

- ✅ Authentification JWT requise
- ✅ Isolation par organisation
- ✅ Validation des types de fichiers (PDF uniquement)
- ✅ Limite de taille (10 MB)
- ✅ Noms de fichiers uniques
- ✅ Stockage sécurisé hors webroot

## 🐛 Dépannage

### Erreur "Chromium not found"

```bash
cd backend
npm uninstall puppeteer
npm install puppeteer
```

### Erreur "Permission denied"

```bash
# Linux/Mac
chmod -R 755 backend/uploads

# Windows : Vérifier les permissions du dossier
```

### PDF vide ou mal formaté

1. Vérifier que le document a des données
2. Vérifier que le client et les lignes existent
3. Consulter les logs du serveur

## 📚 Documentation Complète

- **PDF_TEMPLATE_SYSTEM.md** - Documentation technique complète
- **INSTALLATION_PDF_SYSTEM.md** - Guide d'installation détaillé

## 🎯 Cas d'Usage

### Cas 1 : Entreprise avec Charte Graphique

1. Designer crée un PDF modèle avec la charte graphique
2. Admin uploade le template dans l'application
3. Tous les documents générés respectent la charte

### Cas 2 : Plusieurs Clients

1. Créer un template par client
2. Générer les documents avec le template approprié
3. Chaque client reçoit des documents à son image

### Cas 3 : Évolution de la Charte

1. Modifier les couleurs du template existant
2. Ou uploader un nouveau template
3. Les nouveaux documents utilisent le nouveau style

## 🚀 Prochaines Améliorations

- [ ] Analyse avancée des couleurs du PDF
- [ ] Extraction automatique des polices
- [ ] Éditeur visuel de templates
- [ ] Templates HTML personnalisables
- [ ] Prévisualisation en temps réel
- [ ] Variables dynamiques dans les templates
- [ ] Support de logos et images

## 💡 Conseils

1. **Utilisez des PDFs simples** pour l'upload (pas trop complexes)
2. **Définissez toujours un template par défaut** pour chaque type
3. **Testez la génération** après chaque upload
4. **Personnalisez les couleurs** si l'extraction automatique n'est pas parfaite
5. **Gardez plusieurs versions** de templates pour différents besoins

## 📞 Support

En cas de problème :
1. Consulter les logs du serveur
2. Vérifier la console du navigateur
3. Lire la documentation complète
4. Vérifier que toutes les dépendances sont installées

---

**Version** : 1.0.0  
**Statut** : ✅ Prêt à l'emploi  
**Temps d'installation** : ~10 minutes  
**Difficulté** : Moyenne
