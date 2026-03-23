# 📄 Guide du Système de Templates PDF

## Vue d'ensemble

Le système de templates PDF permet de téléverser un modèle de document PDF et de générer automatiquement des documents (devis, factures, etc.) en respectant le style du modèle.

## 🎯 Fonctionnalités

### 1. Upload et Analyse de Template
- Téléversement de fichiers PDF (max 10 MB)
- Extraction automatique des styles:
  - Couleurs primaire et secondaire
  - Couleur du texte
  - Police principale
  - Marges du document
- Stockage sécurisé dans la base de données

### 2. Génération de Documents
- Génération de PDF basée sur les templates
- Support de tous les types de documents:
  - Devis (DEVIS)
  - Bon de Commande (COMMANDE)
  - Bon de Livraison (LIVRAISON)
  - Facture (FACTURE)
  - Avoir (AVOIR)
- Application automatique des styles du template
- Téléchargement direct du PDF généré

### 3. Gestion des Templates
- Plusieurs templates par type de document
- Définition d'un template par défaut
- Activation/désactivation de templates
- Suppression de templates

## 🏗️ Architecture

### Backend

#### Services
1. **templateService.ts**
   - Analyse des PDF uploadés
   - Extraction des styles (couleurs, polices, marges)
   - Gestion CRUD des templates
   - Définition des templates par défaut

2. **pdfGenerationService.ts**
   - Génération HTML avec styles du template
   - Conversion HTML → PDF avec Puppeteer
   - Formatage des montants et dates
   - Gestion des sections du document

#### Routes
1. **templates.ts**
   - `POST /api/templates/upload` - Upload et analyse
   - `GET /api/templates` - Liste des templates
   - `GET /api/templates/:id` - Détails d'un template
   - `PUT /api/templates/:id/default` - Définir par défaut
   - `DELETE /api/templates/:id` - Supprimer

2. **pdf.ts**
   - `POST /api/pdf/devis/:id` - Générer PDF devis
   - `POST /api/pdf/facture/:id` - Générer PDF facture
   - `POST /api/pdf/commande/:id` - Générer PDF commande

### Frontend

#### Composants
1. **TemplatesModule.tsx**
   - Interface d'upload de templates
   - Liste des templates avec aperçu des couleurs
   - Gestion des templates (définir par défaut, supprimer)
   - Filtrage par type de document

#### Services API
- `uploadTemplate()` - Upload avec FormData
- `getTemplates()` - Liste avec filtres
- `setDefaultTemplate()` - Définir par défaut
- `deleteTemplate()` - Supprimer
- `generateDevisPdf()` - Générer et télécharger PDF devis
- `generateFacturePdf()` - Générer et télécharger PDF facture
- `generateCommandePdf()` - Générer et télécharger PDF commande

## 📊 Base de Données

### Modèle PdfTemplate

```prisma
model PdfTemplate {
  id              Int          @id @default(autoincrement())
  organisationId  Int
  nom             String       // "Facture Standard", "Devis Moderne"
  type            TypeDocument // DEVIS, FACTURE, etc.
  fichierOriginal String       // Chemin du PDF uploadé
  
  // Styles extraits
  couleurPrimaire String?      // #003366
  couleurSecondaire String?    // #FFB81C
  couleurTexte    String?      // #000000
  police          String?      // Helvetica
  
  // Configuration
  marges          Json?        // {top: 50, right: 50, bottom: 50, left: 50}
  sections        Json?        // Configuration des sections
  
  actif           Boolean      @default(true)
  parDefaut       Boolean      @default(false)
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

## 🚀 Utilisation

### 1. Téléverser un Template

```typescript
// Frontend
const formData = new FormData();
formData.append('template', pdfFile);
formData.append('nom', 'Facture Moderne');
formData.append('type', 'FACTURE');

await api.uploadTemplate(formData);
```

### 2. Générer un PDF

```typescript
// Frontend - Génération avec template par défaut
await api.generateDevisPdf(devisId);

// Avec un template spécifique
await api.generateDevisPdf(devisId, templateId);
```

### 3. Gérer les Templates

```typescript
// Lister les templates
const templates = await api.getTemplates({ type: 'FACTURE' });

// Définir comme par défaut
await api.setDefaultTemplate(templateId);

// Supprimer
await api.deleteTemplate(templateId);
```

## 🎨 Extraction des Styles

### Couleurs
Le système analyse le PDF et extrait:
- **Couleur primaire**: Utilisée pour les en-têtes et titres
- **Couleur secondaire**: Utilisée pour les accents et badges
- **Couleur texte**: Utilisée pour le contenu

### Polices
Détection des polices utilisées dans le document:
- Helvetica
- Arial
- Times-Roman
- Autres polices courantes

### Marges
Calcul automatique des marges basé sur les dimensions du PDF:
- Top: 8% de la hauteur
- Right: 8% de la largeur
- Bottom: 8% de la hauteur
- Left: 8% de la largeur

## 📝 Structure du PDF Généré

### Sections
1. **En-tête**
   - Logo/Nom de l'entreprise
   - Informations de contact
   - Bordure avec couleur primaire

2. **Titre du Document**
   - Type de document (DEVIS, FACTURE, etc.)
   - Fond avec couleur primaire

3. **Informations**
   - Client (nom, adresse, contact)
   - Représentant (si applicable)
   - Document (numéro, date, validité)

4. **Objet**
   - Description du document
   - Fond avec couleur secondaire

5. **Tableau des Lignes**
   - N°, Désignation, P.U., Qté, Total
   - En-tête avec couleur primaire
   - Détails des lignes (sous-services)

6. **Totaux**
   - Solde HT
   - Remise (optionnel)
   - Sous-totaux (optionnels)
   - TPS, CSS
   - Net à payer (couleur primaire)
   - Avance et reste à payer (optionnels)

7. **Footer**
   - Modalités de paiement (badges avec couleur secondaire)
   - Conditions
   - RIB

## 🔧 Configuration

### Variables d'Environnement

```env
# Backend
DATABASE_URL=postgresql://...
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Dépendances

```json
{
  "dependencies": {
    "pdf-lib": "^1.17.1",      // Manipulation PDF
    "pdf-parse": "^1.1.1",     // Extraction contenu
    "puppeteer": "^22.0.0",    // Génération PDF
    "multer": "^1.4.5-lts.1"   // Upload fichiers
  }
}
```

## 📦 Installation

### 1. Installer les dépendances

```bash
cd backend
npm install pdf-lib pdf-parse puppeteer multer
npm install --save-dev @types/multer @types/pdfkit
```

### 2. Créer les dossiers

```bash
mkdir -p backend/uploads/templates
mkdir -p backend/uploads/generated
```

### 3. Appliquer les migrations

```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Démarrer le serveur

```bash
npm run dev
```

## 🧪 Tests

### Test d'Upload

```bash
curl -X POST http://localhost:5000/api/templates/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "template=@/path/to/template.pdf" \
  -F "nom=Facture Standard" \
  -F "type=FACTURE"
```

### Test de Génération

```bash
curl -X POST http://localhost:5000/api/pdf/devis/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"templateId": 1}' \
  --output devis.pdf
```

## 🎯 Cas d'Usage

### Scénario 1: Entreprise avec Charte Graphique
1. Designer crée un PDF modèle avec la charte
2. Admin téléverse le PDF dans l'application
3. Système extrait automatiquement les couleurs et polices
4. Tous les documents générés respectent la charte

### Scénario 2: Plusieurs Styles de Documents
1. Créer un template "Moderne" pour les devis
2. Créer un template "Classique" pour les factures
3. Définir les templates par défaut
4. Générer des documents avec le bon style

### Scénario 3: Évolution de la Charte
1. Designer met à jour la charte graphique
2. Admin téléverse le nouveau template
3. Définir comme par défaut
4. Nouveaux documents utilisent la nouvelle charte
5. Anciens templates restent disponibles

## 🔒 Sécurité

### Validation des Fichiers
- Type MIME: `application/pdf` uniquement
- Taille max: 10 MB
- Stockage sécurisé avec noms uniques

### Authentification
- Toutes les routes protégées par JWT
- Isolation par organisation
- Vérification des permissions

### Nettoyage
- Suppression automatique des PDF temporaires
- Suppression des fichiers lors de la suppression du template

## 🚨 Limitations Actuelles

1. **Extraction des Couleurs**
   - Analyse basique (valeurs par défaut)
   - Amélioration possible avec analyse d'image avancée

2. **Extraction des Polices**
   - Liste de polices communes
   - pdf-lib ne fournit pas directement cette info

3. **Analyse de Structure**
   - Marges calculées automatiquement
   - Pas d'analyse de la position des éléments

## 🔮 Améliorations Futures

1. **Analyse Avancée**
   - Extraction réelle des couleurs avec analyse d'image
   - Détection précise des polices utilisées
   - Analyse de la structure et positionnement

2. **Éditeur Visuel**
   - Interface pour personnaliser les templates
   - Drag & drop des sections
   - Aperçu en temps réel

3. **Templates Prédéfinis**
   - Bibliothèque de templates professionnels
   - Templates par secteur d'activité
   - Import depuis des galeries

4. **Variables Dynamiques**
   - Champs personnalisés
   - Conditions d'affichage
   - Calculs avancés

## 📚 Ressources

- [pdf-lib Documentation](https://pdf-lib.js.org/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Support

Pour toute question ou problème:
1. Vérifier les logs du serveur
2. Vérifier les permissions des dossiers uploads
3. Vérifier que Puppeteer est correctement installé
4. Consulter la documentation des dépendances

---

**Version**: 1.0.0  
**Date**: Mars 2026  
**Auteur**: SING FacturePro Team
