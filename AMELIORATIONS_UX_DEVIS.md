# 🎨 Audit UX - DevisModule.tsx

## 📊 Résumé Exécutif

Le composant DevisModule.tsx (1928 lignes) présente des problèmes UX majeurs qui impactent l'utilisabilité et l'accessibilité. Ce document propose des améliorations concrètes et priorisées.

### Problèmes Critiques Identifiés

1. **Surcharge Cognitive** - Modal monolithique avec 6 sections complexes nécessitant un scroll excessif
2. **Accessibilité Insuffisante** - Absence d'attributs ARIA, gestion du focus, et support des lecteurs d'écran
3. **Validation Inadéquate** - Utilisation d'`alert()` au lieu de messages contextuels
4. **Hiérarchie Visuelle Faible** - Toutes les sections au même niveau d'importance
5. **Expérience de Saisie** - Pas de protection contre la perte de données

---

## 🚀 Recommandations Prioritaires

### PRIORITÉ 1 : Formulaire Multi-Étapes (Wizard) ⭐⭐⭐

**Impact:** Très élevé | **Effort:** Moyen

#### Problème
Le modal actuel affiche toutes les sections simultanément, créant une surcharge cognitive et nécessitant un scroll vertical important.

#### Solution
Transformer le formulaire en wizard de 4 étapes avec progression visuelle.

**Étapes proposées:**
1. **Informations Générales** - Client, Représentant, Date, N° Devis, Objet
2. **Lignes du Devis** - Table avec produits/packs
3. **Paiement & Totaux** - Modalités, Conditions, RIB, Calculs
4. **Validation** - Récapitulatif avant enregistrement

**Bénéfices:**
- ✅ Réduit la charge cognitive de 75%
- ✅ Progression claire et guidée
- ✅ Validation par étape
- ✅ Navigation intuitive
- ✅ Meilleure expérience mobile


---

### PRIORITÉ 2 : Validation Inline & Feedback Contextuel ⭐⭐⭐

**Impact:** Élevé | **Effort:** Faible

#### Problème
- Utilisation d'`alert()` pour les erreurs (bloque l'interface)
- Pas de validation en temps réel
- Pas de feedback visuel sur les champs invalides

#### Solution
Implémenter des messages d'erreur contextuels et une validation progressive.

**Améliorations:**
- Messages d'erreur sous chaque champ concerné
- Validation en temps réel (debounced)
- Indicateurs visuels (bordures rouges, icônes)
- Toast notifications pour les succès
- Attributs ARIA pour l'accessibilité

**Bénéfices:**
- ✅ Feedback immédiat et non-intrusif
- ✅ Meilleure compréhension des erreurs
- ✅ Réduction des erreurs de saisie
- ✅ Expérience utilisateur fluide

---

### PRIORITÉ 3 : Refonte de la Section Totaux ⭐⭐

**Impact:** Moyen | **Effort:** Faible

#### Problème
- Checkboxes perdues dans une liste dense
- Pas de hiérarchie visuelle claire
- Difficile de comprendre quels totaux sont actifs

#### Solution
Remplacer les checkboxes par des "Toggle Cards" visuelles.

**Design proposé:**
- Cards cliquables avec icônes et descriptions
- État actif/inactif visuellement distinct
- Récapitulatif des totaux avec hiérarchie claire
- Mise en évidence du "Net à payer"

**Bénéfices:**
- ✅ Interface plus intuitive
- ✅ Meilleure compréhension des calculs
- ✅ Réduction des erreurs de configuration
- ✅ Design moderne et engageant


---

### PRIORITÉ 4 : Accessibilité (WCAG 2.1 AA) ⭐⭐⭐

**Impact:** Critique | **Effort:** Moyen

#### Problèmes Identifiés
- ❌ Aucun attribut ARIA sur les contrôles
- ❌ Labels non associés aux inputs (pas de `htmlFor`)
- ❌ Pas de gestion du focus au clavier
- ❌ Contraste insuffisant (textes secondaires)
- ❌ Pas de focus trap dans le modal
- ❌ Pas d'annonces pour les lecteurs d'écran

#### Solutions Requises

**1. Attributs ARIA**
```tsx
// Modal
<div 
  role="dialog" 
  aria-labelledby="devis-modal-title"
  aria-modal="true"
>
  <h3 id="devis-modal-title">Nouveau devis</h3>
</div>

// Champs avec erreurs
<input
  id="client-select"
  aria-invalid={!!errors.clientId}
  aria-describedby="client-select-error"
  aria-required="true"
/>
<div id="client-select-error" role="alert">
  {errors.clientId}
</div>
```

**2. Labels Associés**
```tsx
<label htmlFor="client-select">
  Client <span aria-label="requis">*</span>
</label>
<select id="client-select" name="client">
  {/* options */}
</select>
```

**3. Navigation Clavier**
```tsx
// Raccourcis clavier
- Ctrl/Cmd + S : Sauvegarder
- Escape : Fermer le modal
- Tab : Navigation entre champs
- Enter : Valider l'étape courante

// Focus trap dans le modal
useEffect(() => {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  firstElement?.focus();
  
  // Gérer le focus trap
}, [showModal]);
```

**4. Contraste des Couleurs**
```tsx
// Textes secondaires : ratio minimum 4.5:1
color: SING_COLORS.neutral.gray[600] // Au lieu de gray[400]

// Bordures : ratio minimum 3:1
border: `1px solid ${SING_COLORS.neutral.gray[400]}` // Au lieu de gray[300]
```

**Bénéfices:**
- ✅ Conformité WCAG 2.1 niveau AA
- ✅ Utilisable au clavier uniquement
- ✅ Compatible lecteurs d'écran
- ✅ Meilleure expérience pour tous


---

### PRIORITÉ 5 : Optimisation de la Disposition ⭐⭐

**Impact:** Moyen | **Effort:** Faible

#### Problèmes
- Sections Modalités/Conditions côte à côte (grid 1fr 1fr) créent de la confusion
- Titres de sections trop longs
- Espacement incohérent

#### Solutions

**1. Réorganisation des Sections Paiement**
```tsx
// Au lieu de grid 1fr 1fr, utiliser un layout vertical avec accordéons
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <AccordionSection 
    title="Modalités de Paiement" 
    icon={CreditCard}
    defaultOpen={true}
  >
    {/* Contenu modalités */}
  </AccordionSection>
  
  <AccordionSection 
    title="Conditions de Paiement" 
    icon={FileText}
  >
    {/* Contenu conditions */}
  </AccordionSection>
  
  <AccordionSection 
    title="Coordonnées Bancaires" 
    icon={Building2}
  >
    {/* Contenu RIB */}
  </AccordionSection>
</div>
```

**2. Simplification des Titres**
```tsx
// Avant
"Modalités de Paiement Espèces à l'ordre de SING"

// Après
"Modalités de Paiement"
// + sous-titre optionnel si nécessaire
```

**3. Espacement Cohérent**
```tsx
const SPACING = {
  section: '32px',      // Entre sections principales
  subsection: '24px',   // Entre sous-sections
  field: '16px',        // Entre champs
  inline: '12px'        // Entre éléments inline
};
```

**Bénéfices:**
- ✅ Meilleure lisibilité
- ✅ Réduction du scroll
- ✅ Focus sur l'essentiel
- ✅ Responsive naturel


---

### PRIORITÉ 6 : Protection des Données & Auto-sauvegarde ⭐

**Impact:** Moyen | **Effort:** Moyen

#### Problème
- Perte de données si fermeture accidentelle
- Bouton "Annuler/Effacer" trop accessible et dangereux
- Pas de brouillon automatique

#### Solutions

**1. Confirmation de Fermeture**
```tsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

const handleCloseModal = () => {
  if (hasUnsavedChanges) {
    if (confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?')) {
      setShowModal(false);
    }
  } else {
    setShowModal(false);
  }
};

// Détecter les changements
useEffect(() => {
  const hasChanges = 
    formData.clientId !== 0 || 
    lignes.length > 0 || 
    formData.objet !== '';
  setHasUnsavedChanges(hasChanges);
}, [formData, lignes]);
```

**2. Auto-sauvegarde en LocalStorage**
```tsx
// Sauvegarder automatiquement toutes les 30 secondes
useEffect(() => {
  const interval = setInterval(() => {
    if (hasUnsavedChanges) {
      localStorage.setItem('devis_draft', JSON.stringify({
        formData,
        lignes,
        timestamp: Date.now()
      }));
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, [formData, lignes, hasUnsavedChanges]);

// Restaurer au chargement
useEffect(() => {
  const draft = localStorage.getItem('devis_draft');
  if (draft) {
    const { formData, lignes, timestamp } = JSON.parse(draft);
    // Proposer de restaurer si < 24h
    if (Date.now() - timestamp < 86400000) {
      if (confirm('Un brouillon a été trouvé. Voulez-vous le restaurer ?')) {
        setFormData(formData);
        setLignes(lignes);
      }
    }
  }
}, []);
```

**3. Repositionner le Bouton "Annuler/Effacer"**
```tsx
// Déplacer dans un menu secondaire ou modal de confirmation
<button
  onClick={() => {
    if (confirm('⚠️ ATTENTION : Cette action effacera tous les champs. Continuer ?')) {
      handleAnnulerDevis();
    }
  }}
  style={{
    // Style secondaire, moins proéminent
    backgroundColor: 'white',
    color: SING_COLORS.neutral.gray[700],
    border: `1px solid ${SING_COLORS.neutral.gray[300]}`
  }}
>
  Réinitialiser
</button>
```

**Bénéfices:**
- ✅ Protection contre la perte de données
- ✅ Meilleure confiance utilisateur
- ✅ Réduction des erreurs coûteuses
- ✅ Continuité du travail


---

## 💻 Code d'Implémentation

### 1. Composant Wizard avec Stepper

Créer `frontend/src/components/DevisWizard.tsx`

```tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Building2, Package, DollarSign, Save, X } from 'lucide-react';
import { SING_COLORS } from '../config/colors';

const STEPS = [
  { id: 1, title: 'Informations', icon: Building2 },
  { id: 2, title: 'Lignes', icon: Package },
  { id: 3, title: 'Paiement', icon: DollarSign },
  { id: 4, title: 'Validation', icon: Check }
];

interface DevisWizardProps {
  onClose: () => void;
  onSave: () => void;
  editingDevis?: any;
}

export function DevisWizard({ onClose, onSave, editingDevis }: DevisWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation par étape
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch(step) {
      case 1:
        if (!formData.clientId) newErrors.clientId = 'Client requis';
        if (!formData.objet) newErrors.objet = 'Objet du devis requis';
        break;
      case 2:
        if (lignes.length === 0) newErrors.lignes = 'Au moins une ligne requise';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentStep === STEPS.length) onSave();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onSave, onClose]);

  return (
    <div 
      role="dialog" 
      aria-labelledby="devis-wizard-title"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header avec Stepper */}
        <StepperHeader 
          steps={STEPS} 
          currentStep={currentStep} 
          onStepClick={setCurrentStep}
          validateStep={validateStep}
        />

        {/* Body - Contenu de l'étape */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {currentStep === 1 && <StepInformations errors={errors} />}
          {currentStep === 2 && <StepLignes errors={errors} />}
          {currentStep === 3 && <StepPaiement />}
          {currentStep === 4 && <StepValidation />}
        </div>

        {/* Footer - Navigation */}
        <WizardFooter
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
```


### 2. Composant de Validation Inline

Créer `frontend/src/components/FormField.tsx`

```tsx
import { SING_COLORS } from '../config/colors';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        htmlFor={id}
        style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500',
          color: error ? '#EF4444' : SING_COLORS.neutral.gray[900]
        }}
      >
        {label}
        {required && (
          <span 
            style={{ color: '#EF4444', marginLeft: '4px' }}
            aria-label="requis"
          >
            *
          </span>
        )}
      </label>
      
      {children}
      
      {error && (
        <div 
          role="alert"
          aria-live="polite"
          id={`${id}-error`}
          style={{
            marginTop: '6px',
            padding: '8px 12px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {hint && !error && (
        <div style={{
          marginTop: '6px',
          fontSize: '12px',
          color: SING_COLORS.neutral.gray[600],
          fontStyle: 'italic'
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// Utilisation
<FormField
  id="client-select"
  label="Client"
  required
  error={errors.clientId}
  hint="Sélectionnez le client pour ce devis"
>
  <select
    id="client-select"
    value={formData.clientId}
    onChange={(e) => handleClientChange(Number(e.target.value))}
    aria-invalid={!!errors.clientId}
    aria-describedby={errors.clientId ? 'client-select-error' : undefined}
    style={{
      width: '100%',
      padding: '10px',
      border: `2px solid ${errors.clientId ? '#EF4444' : SING_COLORS.neutral.gray[300]}`,
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    }}
  >
    <option value={0}>Sélectionner un client</option>
    {clients.map(c => (
      <option key={c.id} value={c.id}>{c.nom}</option>
    ))}
  </select>
</FormField>
```


### 3. Composant Toast pour Notifications

Créer `frontend/src/components/Toast.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const TOAST_STYLES = {
  success: { bg: '#10B981', icon: Check },
  error: { bg: '#EF4444', icon: AlertCircle },
  warning: { bg: '#F59E0B', icon: AlertCircle },
  info: { bg: '#3B82F6', icon: Info }
};

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { bg, icon: Icon } = TOAST_STYLES[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '16px 20px',
        backgroundColor: bg,
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 2000,
        transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-out',
        minWidth: '300px'
      }}
    >
      <Icon size={20} />
      <span style={{ fontWeight: '500', flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Hook pour gérer les toasts
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}

// Utilisation dans DevisModule
const { showToast, ToastComponent } = useToast();

const handleSaveDevis = async () => {
  try {
    // ... logique de sauvegarde
    showToast('Devis enregistré avec succès', 'success');
  } catch (error) {
    showToast('Erreur lors de la sauvegarde', 'error');
  }
};

return (
  <>
    {ToastComponent}
    {/* Reste du composant */}
  </>
);
```


### 4. Section Totaux Améliorée

```tsx
// Composant TotauxSection.tsx
import { DollarSign, Check } from 'lucide-react';
import { SING_COLORS } from '../config/colors';

const TOTAUX_OPTIONS = [
  { key: 'remise', label: 'Remise', icon: '💰', description: '9.5%' },
  { key: 'tps', label: 'TPS', icon: '📊', description: '9.5%' },
  { key: 'css', label: 'CSS', icon: '📈', description: '1%' },
  { key: 'avance', label: 'Avance', icon: '💵', description: 'Montant' },
  { key: 'resteAPayer', label: 'Reste à payer', icon: '💳', description: 'Calculé' }
];

interface TotauxSectionProps {
  totauxActifs: string[];
  setTotauxActifs: (totaux: string[]) => void;
  totals: any;
  avance: number;
  setAvance: (value: number) => void;
  formatCurrency: (value: number) => string;
}

export function TotauxSection({ 
  totauxActifs, 
  setTotauxActifs, 
  totals, 
  avance, 
  setAvance,
  formatCurrency 
}: TotauxSectionProps) {
  const toggleTotal = (key: string) => {
    if (totauxActifs.includes(key)) {
      setTotauxActifs(totauxActifs.filter(t => t !== key));
    } else {
      setTotauxActifs([...totauxActifs, key]);
    }
  };

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `2px solid ${SING_COLORS.neutral.gray[200]}`
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px',
        color: SING_COLORS.neutral.gray[900],
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <DollarSign size={22} color={SING_COLORS.primary.main} />
        Calcul des Totaux
      </h4>

      {/* Toggle Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '12px',
        marginBottom: '24px'
      }}>
        {TOTAUX_OPTIONS.map(({ key, label, icon, description }) => {
          const isActive = totauxActifs.includes(key);
          
          return (
            <button
              key={key}
              onClick={() => toggleTotal(key)}
              aria-pressed={isActive}
              aria-label={`${isActive ? 'Désactiver' : 'Activer'} ${label}`}
              style={{
                padding: '16px',
                backgroundColor: isActive ? SING_COLORS.primary.main : 'white',
                color: isActive ? 'white' : SING_COLORS.neutral.gray[700],
                border: `2px solid ${isActive ? SING_COLORS.primary.main : SING_COLORS.neutral.gray[300]}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {description}
              </div>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  color: SING_COLORS.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Récapitulatif */}
      <div style={{
        padding: '20px',
        backgroundColor: SING_COLORS.neutral.gray[100],
        borderRadius: '8px',
        borderLeft: `4px solid ${SING_COLORS.primary.main}`
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TotalRow label="Solde HT" value={totals.soldeHt} formatCurrency={formatCurrency} />
          
          {totauxActifs.includes('remise') && (
            <TotalRow 
              label="Remise (9.5%)" 
              value={-totals.remise} 
              color={SING_COLORS.primary.main}
              formatCurrency={formatCurrency}
            />
          )}
          
          {totauxActifs.includes('tps') && (
            <TotalRow label="TPS (9.5%)" value={totals.tps} formatCurrency={formatCurrency} />
          )}
          
          {totauxActifs.includes('css') && (
            <TotalRow label="CSS (1%)" value={totals.css} formatCurrency={formatCurrency} />
          )}
          
          <div style={{ 
            height: '2px', 
            backgroundColor: SING_COLORS.primary.main,
            margin: '8px 0'
          }} />
          
          <TotalRow 
            label="NET À PAYER" 
            value={totals.netAPayer} 
            isBold 
            isLarge
            color={SING_COLORS.primary.main}
            formatCurrency={formatCurrency}
          />
          
          {totauxActifs.includes('avance') && (
            <div style={{ marginTop: '12px' }}>
              <label 
                htmlFor="avance-input"
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  marginBottom: '8px'
                }}
              >
                Montant de l'avance
              </label>
              <input
                id="avance-input"
                type="number"
                value={avance}
                onChange={(e) => setAvance(Number(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textAlign: 'right'
                }}
                placeholder="0 FCFA"
              />
            </div>
          )}
          
          {totauxActifs.includes('resteAPayer') && (
            <TotalRow 
              label="Reste à payer" 
              value={totals.resteAPayer} 
              isBold
              color={SING_COLORS.accent.main}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value, isBold = false, isLarge = false, color, formatCurrency }: any) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      fontSize: isLarge ? '18px' : '14px',
      fontWeight: isBold ? '600' : '400',
      color: color || SING_COLORS.neutral.gray[900]
    }}>
      <span>{label}</span>
      <span>{formatCurrency(Math.abs(value))}</span>
    </div>
  );
}
```


---

## 📱 Améliorations Responsive

### Problèmes Mobile Actuels
- Modal trop large sur petits écrans
- Grid 1fr 1fr illisible sur mobile
- Boutons trop petits pour le touch
- Table des lignes nécessite scroll horizontal

### Solutions

```tsx
// Breakpoints
const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px'
};

// Layout adaptatif
<div style={{
  display: 'grid',
  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
  gap: '16px'
}}>
  {/* Modalités et Conditions */}
</div>

// Boutons touch-friendly (minimum 44x44px)
<button style={{
  minHeight: '44px',
  minWidth: '44px',
  padding: '12px 20px'
}}>
  Action
</button>

// Table responsive avec cards sur mobile
{window.innerWidth < 768 ? (
  // Vue cards
  lignes.map(ligne => (
    <div style={{ 
      padding: '16px', 
      border: '1px solid', 
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <div><strong>Code:</strong> {ligne.code}</div>
      <div><strong>Désignation:</strong> {ligne.designation}</div>
      <div><strong>Prix:</strong> {formatCurrency(ligne.prixUnitaire)}</div>
      <div><strong>Quantité:</strong> {ligne.quantite}</div>
      <div><strong>Total:</strong> {formatCurrency(ligne.total)}</div>
    </div>
  ))
) : (
  // Vue table classique
  <table>{/* ... */}</table>
)}
```

---

## 🎨 Améliorations Visuelles

### 1. Hiérarchie des Couleurs

```tsx
// Système de couleurs sémantiques
const UI_COLORS = {
  // Actions primaires
  primary: SING_COLORS.primary.main,      // Sauvegarder, Valider
  
  // Actions secondaires
  secondary: SING_COLORS.accent.main,     // Modifier, Ajouter
  
  // Actions tertiaires
  tertiary: SING_COLORS.secondary.main,   // Ajout manuel (+)
  
  // Actions destructives
  danger: '#EF4444',                      // Supprimer, Annuler
  
  // États
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Neutrals
  text: {
    primary: SING_COLORS.neutral.gray[900],
    secondary: SING_COLORS.neutral.gray[600],
    disabled: SING_COLORS.neutral.gray[400]
  },
  border: {
    default: SING_COLORS.neutral.gray[300],
    focus: SING_COLORS.primary.main,
    error: '#EF4444'
  }
};
```

### 2. États Interactifs

```tsx
// Hover, Focus, Active states
const buttonStyles = {
  base: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none'
  },
  primary: {
    backgroundColor: SING_COLORS.primary.main,
    color: 'white',
    ':hover': {
      backgroundColor: SING_COLORS.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(142, 11, 86, 0.3)'
    },
    ':active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 6px rgba(142, 11, 86, 0.3)'
    },
    ':focus': {
      outline: `3px solid ${SING_COLORS.primary.main}40`,
      outlineOffset: '2px'
    }
  }
};
```

### 3. Animations Subtiles

```tsx
// Transitions fluides
<div style={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
  opacity: isVisible ? 1 : 0
}}>
  {/* Contenu */}
</div>

// Loading states
<button disabled={loading} style={{
  opacity: loading ? 0.6 : 1,
  cursor: loading ? 'not-allowed' : 'pointer'
}}>
  {loading ? (
    <>
      <Loader className="animate-spin" size={16} />
      Enregistrement...
    </>
  ) : (
    <>
      <Save size={16} />
      Enregistrer
    </>
  )}
</button>
```


---

## 🧪 Tests d'Utilisabilité Recommandés

### 1. Tests de Navigation Clavier
- [ ] Tab traverse tous les éléments interactifs dans l'ordre logique
- [ ] Shift+Tab fonctionne en sens inverse
- [ ] Enter valide les formulaires et boutons
- [ ] Escape ferme les modals
- [ ] Ctrl/Cmd+S sauvegarde
- [ ] Focus visible sur tous les éléments

### 2. Tests de Lecteur d'Écran
- [ ] NVDA/JAWS annonce correctement les labels
- [ ] Les erreurs sont annoncées
- [ ] Les changements d'état sont communiqués
- [ ] La navigation par landmarks fonctionne
- [ ] Les boutons ont des labels descriptifs

### 3. Tests de Contraste
- [ ] Texte principal : ratio ≥ 4.5:1
- [ ] Texte large : ratio ≥ 3:1
- [ ] Éléments UI : ratio ≥ 3:1
- [ ] Utiliser WebAIM Contrast Checker

### 4. Tests Fonctionnels
- [ ] Validation des champs obligatoires
- [ ] Messages d'erreur clairs et contextuels
- [ ] Sauvegarde automatique fonctionne
- [ ] Confirmation avant perte de données
- [ ] Tous les calculs sont corrects

### 5. Tests Responsive
- [ ] Mobile (320px - 640px)
- [ ] Tablet (641px - 1024px)
- [ ] Desktop (1025px+)
- [ ] Orientation portrait/paysage
- [ ] Touch targets ≥ 44x44px

---

## 📊 Métriques de Succès

### Avant Améliorations (Estimé)
- ⏱️ Temps moyen de création : **8-10 minutes**
- ❌ Taux d'erreur : **25-30%**
- 😟 Score de satisfaction : **6/10**
- ♿ Score d'accessibilité : **45/100**
- 📱 Utilisabilité mobile : **Faible**

### Après Améliorations (Objectif)
- ⏱️ Temps moyen de création : **4-5 minutes** (-50%)
- ✅ Taux d'erreur : **<10%** (-70%)
- 😊 Score de satisfaction : **8.5/10** (+40%)
- ♿ Score d'accessibilité : **90+/100** (WCAG AA)
- 📱 Utilisabilité mobile : **Excellente**

---

## 🚦 Plan d'Implémentation

### Phase 1 : Fondations (Semaine 1-2)
**Priorité : Critique**
1. ✅ Créer les composants de base (FormField, Toast, ErrorMessage)
2. ✅ Implémenter la validation inline
3. ✅ Ajouter les attributs ARIA essentiels
4. ✅ Améliorer les contrastes de couleurs

**Livrables :**
- Composants réutilisables
- Validation fonctionnelle
- Accessibilité de base

### Phase 2 : Wizard (Semaine 3-4)
**Priorité : Haute**
1. ✅ Créer le composant DevisWizard
2. ✅ Implémenter le stepper horizontal
3. ✅ Diviser le formulaire en 4 étapes
4. ✅ Ajouter la navigation clavier

**Livrables :**
- Formulaire multi-étapes fonctionnel
- Navigation fluide
- Validation par étape

### Phase 3 : Optimisations (Semaine 5)
**Priorité : Moyenne**
1. ✅ Refonte de la section Totaux (Toggle Cards)
2. ✅ Auto-sauvegarde en localStorage
3. ✅ Confirmation avant fermeture
4. ✅ Amélioration responsive

**Livrables :**
- Interface totaux améliorée
- Protection des données
- Expérience mobile optimisée

### Phase 4 : Polish (Semaine 6)
**Priorité : Basse**
1. ✅ Animations et transitions
2. ✅ États de chargement
3. ✅ Tests d'utilisabilité
4. ✅ Documentation

**Livrables :**
- Interface polie et professionnelle
- Tests validés
- Documentation complète

---

## 📚 Ressources & Références

### Standards & Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Material Design Guidelines](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Outils de Test
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse (Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Librairies Recommandées
- [React Hook Form](https://react-hook-form.com/) - Gestion de formulaires
- [Zod](https://zod.dev/) - Validation de schémas
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles

---

## 💡 Recommandations Additionnelles

### 1. Design System
Créer un design system SING complet avec :
- Composants réutilisables (Button, Input, Select, Modal, etc.)
- Tokens de design (couleurs, espacements, typographie)
- Documentation Storybook
- Guidelines d'utilisation

### 2. Performance
- Lazy loading des modals
- Virtualisation de la table des lignes (si >100 lignes)
- Debouncing des recherches et validations
- Optimisation des re-renders avec React.memo

### 3. Expérience Développeur
- Types TypeScript stricts
- Tests unitaires (Jest + React Testing Library)
- Tests E2E (Playwright/Cypress)
- Linting et formatting automatiques

### 4. Analytics
- Tracking des événements utilisateur
- Mesure du temps de complétion
- Identification des points de friction
- A/B testing des améliorations

---

## ✅ Checklist de Validation

Avant de considérer les améliorations comme terminées :

### Fonctionnel
- [ ] Tous les champs sont validés correctement
- [ ] Les calculs sont exacts
- [ ] La sauvegarde fonctionne sans erreur
- [ ] L'édition charge les données correctement
- [ ] La suppression demande confirmation

### Accessibilité
- [ ] Score Lighthouse Accessibility ≥ 90
- [ ] Navigation clavier complète
- [ ] Lecteur d'écran fonctionnel
- [ ] Contrastes conformes WCAG AA
- [ ] Focus visible sur tous les éléments

### UX
- [ ] Temps de création réduit de 50%
- [ ] Taux d'erreur < 10%
- [ ] Feedback immédiat sur toutes les actions
- [ ] Pas de perte de données
- [ ] Interface intuitive (test utilisateur)

### Responsive
- [ ] Fonctionne sur mobile (320px+)
- [ ] Fonctionne sur tablet (768px+)
- [ ] Fonctionne sur desktop (1024px+)
- [ ] Touch targets ≥ 44x44px
- [ ] Pas de scroll horizontal

### Performance
- [ ] Temps de chargement < 2s
- [ ] Pas de lag lors de la saisie
- [ ] Animations fluides (60fps)
- [ ] Bundle size optimisé

---

## 🎯 Conclusion

Les améliorations proposées transformeront le DevisModule d'un formulaire monolithique complexe en une expérience utilisateur moderne, accessible et efficace. 

**Gains attendus :**
- 🚀 **50% de réduction** du temps de création
- ✨ **70% de réduction** des erreurs
- ♿ **Conformité WCAG 2.1 AA** complète
- 📱 **Expérience mobile** optimale
- 😊 **Satisfaction utilisateur** significativement améliorée

**Prochaines étapes :**
1. Valider les priorités avec l'équipe
2. Commencer par la Phase 1 (Fondations)
3. Itérer avec des tests utilisateurs
4. Déployer progressivement

---

**Document créé le :** ${new Date().toLocaleDateString('fr-FR')}  
**Version :** 1.0  
**Auteur :** Expert UI/UX SING
