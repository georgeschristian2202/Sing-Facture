# Paramètres Dynamiques pour les Devis

## Vue d'ensemble

Les devis utilisent maintenant des paramètres dynamiques stockés en base de données, permettant une personnalisation complète sans modifier le code.

## Nouveaux champs dans `Parametres`

### 1. `objetsDevis` (JSON Array)
Liste des objets de devis prédéfinis.

**Exemple:**
```json
[
  "Assistance technique - Programme crystalis Novembre 2025",
  "Assistance technique - Programme crystalis 3 mois - 5 bénéficiaires",
  "Formation utilisateurs",
  "Maintenance annuelle"
]
```

### 2. `modalitesPaiement` (JSON Array)
Liste des modalités de paiement disponibles.

**Valeur par défaut:**
```json
["Espèces", "Chèque", "Virement"]
```

**Exemple étendu:**
```json
["Espèces", "Chèque", "Virement", "Mobile Money", "Carte bancaire"]
```

### 3. `conditionsPaiement` (JSON Array)
Liste des conditions de paiement prédéfinies.

**Valeur par défaut:**
```json
[
  "Paiement à 30 jours",
  "Paiement à 60 jours",
  "Paiement comptant"
]
```

**Exemple étendu:**
```json
[
  "Paiement comptant",
  "Paiement à 30 jours",
  "Paiement à 60 jours",
  "Acompte 70% dès validation de l'offre",
  "Acompte 30% dès validation de l'offre",
  "Acompte 50% dès validation de l'offre",
  "Acompte 60% dès validation de l'offre",
  "Acompte -20% - livrable intermédiaire",
  "Acompte -40% - livrable intermédiaire",
  "Acompte 10% - livrable intermédiaire",
  "Acompte 30% - livrable intermédiaire"
]
```

### 4. `ribs` (JSON Array of Objects)
Liste des RIBs disponibles.

**Structure:**
```json
[
  {
    "nom": "UBA",
    "numero": "54620N - 30025-03801 - 80700302086 - 51"
  },
  {
    "nom": "AFG",
    "numero": "40001 - 00070 - 07000610101 - 58"
  }
]
```

### 5. `typesTotauxActifs` (JSON Array)
Types de totaux à afficher dans les devis.

**Valeur par défaut:**
```json
["remise", "sousTotal", "tps", "css", "netAPayer"]
```

**Options disponibles:**
- `remise` - Remise (10%)
- `sousTotal` - Sous-total
- `sousTotal2` - Sous-total 2
- `tps` - TPS (10%)
- `css` - CSS (1%)
- `netAPayer` - Net à payer
- `avance` - Avance
- `resteAPayer` - Reste à payer

## Utilisation dans le DevisModule

### Chargement des paramètres
```typescript
const [parametres, setParametres] = useState(null);

useEffect(() => {
  const loadParametres = async () => {
    const params = await api.getParametres();
    setParametres(params);
  };
  loadParametres();
}, []);
```

### Liste déroulante avec ajout manuel

**Objet du devis:**
```tsx
<select value={formData.objet}>
  <option value="">Sélectionner un objet</option>
  {parametres.objetsDevis.map((obj, i) => (
    <option key={i} value={obj}>{obj}</option>
  ))}
</select>
<button onClick={() => setShowAddObjet(true)}>+</button>

{showAddObjet && (
  <input 
    placeholder="Nouvel objet" 
    onBlur={(e) => {
      setFormData({...formData, objet: e.target.value});
      setShowAddObjet(false);
    }}
  />
)}
```

### Checkboxes pour les totaux
```tsx
<div>
  <h4>Totaux à afficher</h4>
  {['remise', 'sousTotal', 'sousTotal2', 'tps', 'css', 'netAPayer', 'avance', 'resteAPayer'].map(type => (
    <label key={type}>
      <input 
        type="checkbox" 
        checked={totauxActifs.includes(type)}
        onChange={(e) => {
          if (e.target.checked) {
            setTotauxActifs([...totauxActifs, type]);
          } else {
            setTotauxActifs(totauxActifs.filter(t => t !== type));
          }
        }}
      />
      {type}
    </label>
  ))}
</div>
```

### Modalités de paiement multiples
```tsx
<div>
  <h4>Modalités de paiement</h4>
  {parametres.modalitesPaiement.map((modalite, i) => (
    <label key={i}>
      <input 
        type="checkbox" 
        checked={modalitesSelectionnees.includes(modalite)}
        onChange={(e) => {
          if (e.target.checked) {
            setModalitesSelectionnees([...modalitesSelectionnees, modalite]);
          } else {
            setModalitesSelectionnees(modalitesSelectionnees.filter(m => m !== modalite));
          }
        }}
      />
      {modalite}
    </label>
  ))}
  <button onClick={() => setShowAddModalite(true)}>+ Ajouter</button>
</div>
```

## API Routes

### GET /api/parametres
Récupère tous les paramètres incluant les listes dynamiques.

**Response:**
```json
{
  "id": 1,
  "nomEntreprise": "SING S.A.",
  "objetsDevis": [...],
  "modalitesPaiement": [...],
  "conditionsPaiement": [...],
  "ribs": [...],
  "typesTotauxActifs": [...]
}
```

### PUT /api/parametres
Met à jour les paramètres (admin uniquement).

**Request body:**
```json
{
  "objetsDevis": ["Nouvel objet 1", "Nouvel objet 2"],
  "modalitesPaiement": ["Espèces", "Chèque", "Virement", "Mobile Money"],
  "ribs": [
    {"nom": "UBA", "numero": "..."},
    {"nom": "AFG", "numero": "..."}
  ]
}
```

## Migration

La migration `add_dynamic_devis_fields` ajoute les nouveaux champs JSON avec des valeurs par défaut.

**Commande:**
```bash
cd backend
npx prisma migrate dev --name add_dynamic_devis_fields
npx prisma generate
```

## Prochaines étapes

1. ✅ Schéma Prisma mis à jour
2. ✅ Routes API mises à jour
3. 🔄 Modifier DevisModule pour utiliser les paramètres dynamiques
4. 🔄 Créer l'interface Paramètres pour gérer ces listes
5. 🔄 Tester avec des données réelles

---

**Date:** 2025-01-XX
**Statut:** Backend prêt, frontend à implémenter
