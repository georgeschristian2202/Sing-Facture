# 📄 Système de Templates PDF Personnalisables

## Vue d'ensemble

Le système de templates PDF permet de téléverser des modèles de documents (devis, factures, commandes, livraisons) et de générer automatiquement des PDFs conformes au style du modèle uploadé.

## Fonctionnalités

### ✅ Upload de Templates
- Téléversement de fichiers PDF (max 10 MB)
- Support de tous les types de documents (DEVIS, FACTURE, COMMANDE, LIVRAISON)
- Analyse automatique du template

### ✅ Extraction Automatique des Styles
Le système analyse le PDF uploadé et extrait :
- **Couleurs** : Primaire, secondaire, texte
- **Typographie** : Police principale
- **Mise en page** : Marges et dimensions

### ✅ Gestion des Templates
- Liste de tous les templates par organisation
- Filtrage par type de document
- Définition d'un template par défaut
- Modification des styles (couleurs, police)
- Suppression de templates

### ✅ Génération de Documents
- Génération PDF basée sur le template par défaut
- Application automatique des styles du template
- Remplissage avec les données du document
- Téléchargement ou prévisualisation

## Architecture Technique

### Backend

#### Services

**1. TemplateService** (`backend/src/services/templateService.ts`)
- `analyzeTemplate(pdfBuffer)` - Analyse un PDF et extrait les styles
- `saveTemplate()` - Sauvegarde un template en base
- `getDefaultTemplate()` - Récupère le template par défaut
- `listTemplates()` - Liste les templates d'une organisation
- `setDefaultTemplate()` - Définit un template comme par défaut
- `deleteTemplate()` - Supprime un template

**2. PdfGenerationService** (`backend/src/services/pdfGenerationService.ts`)
- `generateDocumentPdf()` - Génère un PDF pour un document
- `getDocumentData()` - Récupère les données d'un document
- `getEntrepriseInfo()` - Récupère les infos de l'entreprise
- `generateHtml()` - Génère le HTML avec les styles du template
- `htmlToPdf()` - Convertit le HTML en PDF avec Puppeteer

#### Routes API

**Templates** (`/api/templates`)
```typescript
POST   /api/templates/upload        // Upload un template
GET    /api/templates               // Liste les templates
GET    /api/templates?type=DEVIS    // Filtre par type
PUT    /api/templates/:id/default   // Définit comme par défaut
PUT    /api/templates/:id           // Met à jour un template
DELETE /api/templates/:id           // Supprime un template
```

**Génération PDF** (`/api/pdf`)
```typescript
POST /api/pdf/generate/:type/:id    // Génère et télécharge un PDF
GET  /api/pdf/preview/:type/:id     // Prévisualise un PDF
```

#### Base de Données

**Table `pdf_templates`**
```prisma
model PdfTemplate {
  id                Int          @id @default(autoincrement())
  organisationId    Int
  nom               String       // "Facture Moderne"
  type              TypeDocument // DEVIS, FACTURE, etc.
  fichierOriginal   String       // Chemin du PDF uploadé
  
  // Styles extraits
  couleurPrimaire   String?      // "#003366"
  couleurSecondaire String?      // "#FDB913"
  couleurTexte      String?      // "#000000"
  police            String?      // "Helvetica"
  
  // Configuration
  marges            Json?        // {top: 50, right: 50, ...}
  sections          Json?        // Configuration des sections
  
  actif             Boolean      @default(true)
  parDefaut         Boolean      @default(false)
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}
```

### Frontend

#### Composant TemplatesModule

**Fichier** : `frontend/src/components/TemplatesModule.tsx`

**Fonctionnalités** :
- Liste des templates avec cartes visuelles
- Affichage de la palette de couleurs
- Upload de nouveaux templates
- Édition des styles (couleurs, police)
- Définition du template par défaut
- Suppression de templates

**Interface** :
```typescript
interface Template {
  id: number;
  nom: string;
  type: string;
  couleurPrimaire: string | null;
  couleurSecondaire: string | null;
  couleurTexte: string | null;
  police: string | null;
  actif: boolean;
  parDefaut: boolean;
  createdAt: string;
}
```

#### API Service

**Méthodes ajoutées** :
```typescript
// Upload
api.uploadTemplate(file: File, nom: string, type: string)

// Gestion
api.getTemplates(type?: string)
api.setDefaultTemplate(id: number)
api.updateTemplate(id: number, data: any)
api.deleteTemplate(id: number)

// Génération
api.generateDevisPdf(id: number, templateId?: number)
api.generateFacturePdf(id: number, templateId?: number)
api.generateCommandePdf(id: number, templateId?: number)
```

## Utilisation

### 1. Upload d'un Template

```typescript
// Frontend
const file = // File object from input
await api.uploadTemplate(file, "Facture Moderne", "FACTURE");
```

Le système va :
1. Valider le fichier (PDF, max 10 MB)
2. Analyser le PDF pour extraire les styles
3. Sauvegarder le fichier sur le serveur
4. Créer l'entrée en base de données
5. Retourner le template avec les styles extraits

### 2. Définir un Template par Défaut

```typescript
await api.setDefaultTemplate(templateId);
```

Le système va :
1. Désactiver tous les templates par défaut du même type
2. Activer le nouveau template comme par défaut

### 3. Générer un PDF

```typescript
// Génère avec le template par défaut
await api.generateDevisPdf(devisId);

// Génère avec un template spécifique
await api.generateDevisPdf(devisId, templateId);
```

Le système va :
1. Récupérer les données du document
2. Récupérer le template (par défaut ou spécifié)
3. Générer le HTML avec les styles du template
4. Convertir en PDF avec Puppeteer
5. Télécharger le fichier

## Structure du PDF Généré

### Sections

1. **En-tête**
   - Logo de l'entreprise
   - Informations entreprise (nom, adresse, contact, RCCM, capital)
   - Bordure inférieure avec couleur primaire

2. **Titre du Document**
   - Type et numéro (ex: "DEVIS N° DEV2025/01/001")
   - Fond avec couleur secondaire (transparence 22%)
   - Bordure gauche avec couleur secondaire

3. **Informations**
   - Bloc Client (nom, adresse, contact)
   - Bloc Représentant (nom, fonction, contact)
   - Bloc Informations (date, numéro)
   - Fond gris clair, titres avec couleur primaire

4. **Objet** (optionnel)
   - Texte de l'objet du document
   - Fond gris, bordure gauche avec couleur primaire

5. **Tableau des Lignes**
   - En-tête avec couleur primaire, texte blanc
   - Colonnes : N°, Désignation, P.U, Qté, Total
   - Détails des lignes en italique gris
   - Hover effect sur les lignes

6. **Totaux**
   - Tableau aligné à droite
   - Ligne finale (Net à payer) avec couleur primaire

7. **Modalités et Conditions**
   - Modalités de paiement
   - Conditions de paiement
   - RIB
   - Fond gris clair

8. **Zone de Signature**
   - Deux blocs : Client et Entreprise
   - Lignes de signature

9. **Pied de Page**
   - Informations entreprise
   - Bordure supérieure avec couleur primaire

### Styles Appliqués

Le système applique automatiquement :
- **Couleur primaire** : En-têtes, titres, bordures, totaux
- **Couleur secondaire** : Accents, badges, highlights
- **Couleur texte** : Texte principal
- **Police** : Toute la typographie du document

## Dépendances

### Backend
```json
{
  "pdf-lib": "^1.17.1",      // Manipulation PDF
  "pdf-parse": "^1.1.1",     // Extraction de contenu
  "puppeteer": "^21.0.0",    // Génération PDF depuis HTML
  "multer": "^1.4.5-lts.1"   // Upload de fichiers
}
```

### Installation
```bash
cd backend
npm install pdf-lib pdf-parse puppeteer multer
```

## Configuration

### Variables d'Environnement

Aucune configuration spéciale requise. Le système utilise :
- `DATABASE_URL` - Connexion PostgreSQL (déjà configuré)
- Dossier d'upload : `backend/uploads/templates/` (créé automatiquement)

### Permissions

Le système vérifie automatiquement :
- L'utilisateur doit être authentifié (JWT token)
- Les templates sont isolés par organisation
- Seuls les templates de l'organisation peuvent être modifiés/supprimés

## Limitations Actuelles

### Analyse de Template
L'analyse automatique est basique et extrait :
- ✅ Dimensions de page
- ✅ Marges estimées
- ⚠️ Couleurs par défaut (SING colors)
- ⚠️ Police par défaut (Helvetica)

### Améliorations Futures

1. **Analyse avancée de couleurs**
   - Extraction des couleurs dominantes du PDF
   - Analyse d'image avec Canvas API
   - Détection automatique de la palette

2. **Extraction de polices**
   - Lecture des métadonnées de polices du PDF
   - Mapping vers des polices web équivalentes

3. **Analyse de structure**
   - Détection automatique des sections
   - Extraction de la mise en page
   - Positionnement intelligent des éléments

4. **Templates HTML**
   - Support de templates HTML/CSS personnalisés
   - Éditeur visuel de templates
   - Variables dynamiques dans les templates

5. **Prévisualisation**
   - Aperçu en temps réel du PDF
   - Comparaison avant/après
   - Mode édition visuelle

## Exemples d'Utilisation

### Scénario 1 : Première Configuration

```typescript
// 1. Upload du template de facture de l'entreprise
const file = document.getElementById('fileInput').files[0];
await api.uploadTemplate(file, "Facture SING Standard", "FACTURE");

// 2. Définir comme par défaut
await api.setDefaultTemplate(templateId);

// 3. Générer une facture
await api.generateFacturePdf(factureId);
// → Le PDF aura le style du template uploadé
```

### Scénario 2 : Personnalisation des Couleurs

```typescript
// 1. Récupérer le template
const templates = await api.getTemplates("DEVIS");
const template = templates[0];

// 2. Modifier les couleurs
await api.updateTemplate(template.id, {
  couleurPrimaire: "#1E40AF",    // Bleu plus foncé
  couleurSecondaire: "#FBBF24",  // Jaune plus clair
  police: "Times New Roman"
});

// 3. Générer un devis
await api.generateDevisPdf(devisId);
// → Le PDF utilisera les nouvelles couleurs
```

### Scénario 3 : Templates Multiples

```typescript
// Avoir plusieurs templates pour différents clients
await api.uploadTemplate(file1, "Facture Client A", "FACTURE");
await api.uploadTemplate(file2, "Facture Client B", "FACTURE");

// Générer avec un template spécifique
await api.generateFacturePdf(factureId, templateClientA);
```

## Intégration dans l'Application

### Ajout au Dashboard

```typescript
// Dans DashboardNew.tsx
import { TemplatesModule } from '../components/TemplatesModule';

// Ajouter dans le switch
case 'templates':
  return <TemplatesModule />;
```

### Ajout dans la Navigation

```typescript
{
  id: 'templates',
  label: 'Templates PDF',
  icon: '📄'
}
```

### Bouton de Génération PDF

```typescript
// Dans DevisModule.tsx
<button onClick={() => api.generateDevisPdf(devis.id)}>
  📄 Télécharger PDF
</button>
```

## Sécurité

### Validations

1. **Upload**
   - Type de fichier : Seulement PDF
   - Taille max : 10 MB
   - Authentification requise

2. **Accès**
   - Isolation par organisation
   - Vérification des permissions
   - Token JWT requis

3. **Stockage**
   - Fichiers stockés hors du webroot
   - Noms de fichiers uniques (timestamp + random)
   - Pas d'accès direct aux fichiers

## Tests

### Test d'Upload

```bash
curl -X POST http://localhost:5000/api/templates/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "template=@facture.pdf" \
  -F "nom=Facture Test" \
  -F "type=FACTURE"
```

### Test de Génération

```bash
curl -X POST http://localhost:5000/api/pdf/generate/DEVIS/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output devis.pdf
```

## Support

Pour toute question ou problème :
1. Vérifier les logs du serveur
2. Vérifier que Puppeteer est bien installé
3. Vérifier les permissions du dossier uploads/
4. Consulter la documentation Prisma pour les migrations

## Prochaines Étapes

1. ✅ Appliquer la migration Prisma
2. ✅ Installer les dépendances npm
3. ✅ Tester l'upload d'un template
4. ✅ Tester la génération de PDF
5. 🔄 Améliorer l'analyse automatique
6. 🔄 Ajouter l'éditeur visuel de templates

---

**Version** : 1.0.0  
**Date** : Mars 2026  
**Auteur** : SING FacturePro Team
