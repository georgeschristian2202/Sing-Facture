# 🔌 Intégration du Module Templates PDF dans le Dashboard

## Vue d'ensemble

Ce guide explique comment intégrer le module Templates PDF dans votre dashboard existant.

## Étape 1 : Ajouter le Module dans la Navigation

### Fichier : `frontend/src/pages/DashboardNew.tsx`

#### 1.1 Importer le composant

Ajouter en haut du fichier :

```typescript
import { TemplatesModule } from '../components/TemplatesModule';
```

#### 1.2 Ajouter dans le menu

Trouver la section `menuItems` et ajouter :

```typescript
const menuItems = [
  { id: 'home', label: 'Tableau de bord', icon: '📊' },
  { id: 'devis', label: 'Devis', icon: '📝' },
  { id: 'commandes', label: 'Commandes', icon: '📋' },
  { id: 'livraisons', label: 'Livraisons', icon: '📦' },
  { id: 'factures', label: 'Factures', icon: '💰' },
  { id: 'recapitulatif', label: 'Récapitulatif', icon: '📈' },
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'produits', label: 'Produits/Packs', icon: '📦' },
  { id: 'templates', label: 'Templates PDF', icon: '📄' },  // ← NOUVEAU
  { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
];
```

#### 1.3 Ajouter dans le switch

Trouver la fonction `renderModule()` et ajouter :

```typescript
const renderModule = () => {
  switch (activeModule) {
    case 'home':
      return <DashboardHome />;
    case 'devis':
      return <DevisModule />;
    case 'commandes':
      return <div>Module Commandes</div>;
    case 'livraisons':
      return <div>Module Livraisons</div>;
    case 'factures':
      return <div>Module Factures</div>;
    case 'recapitulatif':
      return <div>Module Récapitulatif</div>;
    case 'clients':
      return <ClientsModule />;
    case 'produits':
      return <ProduitsModule />;
    case 'templates':
      return <TemplatesModule />;  // ← NOUVEAU
    case 'parametres':
      return <div>Module Paramètres</div>;
    default:
      return <DashboardHome />;
  }
};
```

## Étape 2 : Ajouter les Boutons de Génération PDF

### Dans le Module Devis

#### Fichier : `frontend/src/components/DevisModule.tsx`

Ajouter un bouton dans la liste des actions :

```typescript
// Dans la colonne "Actions" du tableau
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
    padding: '6px 12px',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }}
  title="Télécharger PDF"
>
  📄 PDF
</button>
```

### Dans le Module Factures

#### Fichier : `frontend/src/components/FacturesModule.tsx`

Même principe :

```typescript
<button
  onClick={async () => {
    try {
      await api.generateFacturePdf(facture.id);
      alert('PDF téléchargé avec succès !');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  }}
  style={{
    padding: '6px 12px',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  }}
>
  📄 PDF
</button>
```

## Étape 3 : Ajouter un Lien Rapide dans le Dashboard Home

### Fichier : `frontend/src/pages/Dashboard.tsx` ou `DashboardHome.tsx`

Ajouter une carte d'accès rapide :

```typescript
<div
  onClick={() => setActiveModule('templates')}
  style={{
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#003366',
      transform: 'translateY(-2px)'
    }
  }}
>
  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Templates PDF</h3>
  <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
    Gérer les modèles de documents
  </p>
</div>
```

## Étape 4 : Vérifier les Méthodes API

### Fichier : `frontend/src/services/api.ts`

Vérifier que ces méthodes existent :

```typescript
// Templates
async uploadTemplate(file: File, nom: string, type: string) { ... }
async getTemplates(type?: string) { ... }
async setDefaultTemplate(id: number) { ... }
async updateTemplate(id: number, data: any) { ... }
async deleteTemplate(id: number) { ... }

// Génération PDF
async generateDevisPdf(id: number, templateId?: number) { ... }
async generateFacturePdf(id: number, templateId?: number) { ... }
async generateCommandePdf(id: number, templateId?: number) { ... }
```

Si elles n'existent pas, elles ont été ajoutées dans `api.ts`.

## Étape 5 : Tester l'Intégration

### Test 1 : Navigation

1. Démarrer l'application : `npm run dev`
2. Se connecter
3. Vérifier que "Templates PDF" apparaît dans le menu
4. Cliquer dessus
5. Le module devrait s'afficher

### Test 2 : Upload

1. Dans le module Templates
2. Cliquer sur "Nouveau Template"
3. Remplir le formulaire
4. Uploader un PDF
5. Vérifier que le template apparaît dans la liste

### Test 3 : Génération PDF

1. Aller dans "Devis"
2. Sélectionner un devis
3. Cliquer sur "📄 PDF"
4. Le PDF devrait se télécharger

## Étape 6 : Personnalisation (Optionnel)

### Changer les Couleurs du Module

Dans `TemplatesModule.tsx`, modifier les constantes :

```typescript
const COLORS = {
  primary: '#VOTRE_COULEUR',
  secondary: '#VOTRE_COULEUR',
  // ...
};
```

### Changer l'Icône du Menu

Dans `DashboardNew.tsx` :

```typescript
{ id: 'templates', label: 'Templates PDF', icon: '🎨' }  // Ou autre emoji
```

### Ajouter des Filtres Supplémentaires

Dans `TemplatesModule.tsx`, ajouter des filtres :

```typescript
<select
  value={filterActif}
  onChange={(e) => setFilterActif(e.target.value)}
  style={{ ... }}
>
  <option value="">Tous</option>
  <option value="true">Actifs</option>
  <option value="false">Inactifs</option>
</select>
```

## Étape 7 : Permissions (Optionnel)

Si vous voulez restreindre l'accès aux templates :

### Backend : `backend/src/routes/templates.ts`

Ajouter une vérification de rôle :

```typescript
router.post('/upload', authenticateToken, checkRole('ADMIN'), upload.single('template'), async (req, res) => {
  // ...
});
```

### Frontend : `DashboardNew.tsx`

Masquer le menu pour les non-admins :

```typescript
const menuItems = [
  // ...
  ...(user.role === 'ADMIN' ? [
    { id: 'templates', label: 'Templates PDF', icon: '📄' }
  ] : []),
  // ...
];
```

## Étape 8 : Notifications (Optionnel)

Ajouter des notifications toast au lieu d'alerts :

### Installer une bibliothèque de toast

```bash
cd frontend
npm install react-hot-toast
```

### Utiliser dans les composants

```typescript
import toast from 'react-hot-toast';

// Au lieu de alert()
toast.success('PDF téléchargé avec succès !');
toast.error('Erreur lors de la génération du PDF');
```

## Étape 9 : Analytics (Optionnel)

Tracker l'utilisation des templates :

```typescript
// Dans TemplatesModule.tsx
const handleGeneratePdf = async (devisId: number) => {
  try {
    await api.generateDevisPdf(devisId);
    
    // Analytics
    if (window.gtag) {
      window.gtag('event', 'pdf_generated', {
        document_type: 'DEVIS',
        document_id: devisId
      });
    }
    
    toast.success('PDF téléchargé !');
  } catch (error) {
    toast.error('Erreur');
  }
};
```

## Étape 10 : Documentation Utilisateur

Créer une page d'aide dans l'application :

```typescript
// HelpTemplates.tsx
export const HelpTemplates = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h2>📄 Aide - Templates PDF</h2>
      
      <section>
        <h3>Comment uploader un template ?</h3>
        <ol>
          <li>Cliquez sur "Nouveau Template"</li>
          <li>Donnez un nom à votre template</li>
          <li>Sélectionnez le type de document</li>
          <li>Choisissez votre fichier PDF</li>
          <li>Cliquez sur "Uploader"</li>
        </ol>
      </section>
      
      <section>
        <h3>Comment générer un PDF ?</h3>
        <ol>
          <li>Allez dans Devis ou Factures</li>
          <li>Cliquez sur le bouton "📄 PDF"</li>
          <li>Le PDF se télécharge automatiquement</li>
        </ol>
      </section>
    </div>
  );
};
```

## Checklist d'Intégration

- [ ] Importer TemplatesModule dans DashboardNew.tsx
- [ ] Ajouter dans le menu de navigation
- [ ] Ajouter dans le switch renderModule()
- [ ] Ajouter les boutons PDF dans DevisModule
- [ ] Ajouter les boutons PDF dans FacturesModule
- [ ] Vérifier les méthodes API
- [ ] Tester la navigation
- [ ] Tester l'upload de template
- [ ] Tester la génération de PDF
- [ ] Personnaliser les couleurs (optionnel)
- [ ] Ajouter les permissions (optionnel)
- [ ] Ajouter les notifications (optionnel)
- [ ] Créer la documentation utilisateur (optionnel)

## Résultat Final

Après l'intégration, vous aurez :

1. ✅ Un menu "Templates PDF" dans la sidebar
2. ✅ Une interface complète de gestion des templates
3. ✅ Des boutons "📄 PDF" dans les modules Devis/Factures
4. ✅ Génération automatique de PDFs avec le style du template
5. ✅ Isolation par organisation
6. ✅ Sécurité avec JWT

## Support

En cas de problème :
1. Vérifier la console du navigateur
2. Vérifier les logs du serveur
3. Consulter la documentation complète
4. Vérifier que toutes les dépendances sont installées

---

**Temps d'intégration estimé** : 15-30 minutes  
**Difficulté** : Facile  
**Prérequis** : Dashboard fonctionnel, API backend démarrée
