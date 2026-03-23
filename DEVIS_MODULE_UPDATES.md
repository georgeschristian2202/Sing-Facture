# Mises à jour du DevisModule - Code à intégrer

## Résumé des modifications effectuées

✅ **1. États ajoutés** (lignes 100-135)
- `parametres` - Stocke les paramètres dynamiques
- `modalitesSelectionnees` - Modalités de paiement cochées
- `totauxActifs` - Types de totaux à afficher
- États pour les ajouts manuels (showAddObjet, newObjet, etc.)

✅ **2. Chargement des paramètres** (fonction loadData)
- Ajout de `api.getParametres()` dans Promise.all
- Initialisation de `totauxActifs` depuis les paramètres

✅ **3. Section "Objet du devis"** - TERMINÉ
- Liste déroulante avec options depuis `parametres.objetsDevis`
- Bouton "+" pour ajouter manuellement
- Champ texte qui apparaît pour saisir un nouvel objet

✅ **4. Section "Totaux"** - TERMINÉ
- Checkboxes pour sélectionner les totaux à afficher
- Affichage conditionnel basé sur `totauxActifs`
- Options: remise, sousTotal, sousTotal2, tps, css, netAPayer, avance, resteAPayer

## Code restant à ajouter

### Section "Modalités de Paiement, Conditions et RIB"

Remplacer la section actuelle (ligne ~1062) par:

```tsx
{/* Section 4: Modalités de Paiement, Conditions et RIB */}
<div style={{ 
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: COLORS.background.secondary,
  borderRadius: '8px'
}}>
  {/* Modalités de paiement - Checkboxes multiples */}
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: COLORS.text.primary }}>
      Modalités de Paiement
    </h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
      {parametres?.modalitesPaiement && Array.isArray(parametres.modalitesPaiement) && 
        parametres.modalitesPaiement.map((modalite: string, i: number) => (
          <label key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            cursor: 'pointer', 
            padding: '8px 12px', 
            backgroundColor: 'white', 
            borderRadius: '6px', 
            border: `1px solid ${COLORS.border}` 
          }}>
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
        ))
      }
    </div>
    {!showAddModalite ? (
      <button type="button" onClick={() => setShowAddModalite(true)} style={{
        padding: '8px 16px',
        backgroundColor: SING_COLORS.secondary.main,
        color: SING_COLORS.neutral.gray[900],
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        + Ajouter une modalité
      </button>
    ) : (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newModalite}
          onChange={(e) => setNewModalite(e.target.value)}
          placeholder="Nouvelle modalité..."
          autoFocus
          style={{ flex: 1, padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        />
        <button type="button" onClick={() => {
          if (newModalite.trim()) {
            setModalitesSelectionnees([...modalitesSelectionnees, newModalite]);
            setNewModalite('');
          }
          setShowAddModalite(false);
        }} style={{ padding: '8px 16px', backgroundColor: SING_COLORS.primary.main, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          OK
        </button>
        <button type="button" onClick={() => { setNewModalite(''); setShowAddModalite(false); }} style={{ padding: '8px 16px', backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>
    )}
  </div>

  {/* Conditions de paiement - Liste déroulante + bouton + */}
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: COLORS.text.primary }}>
      Conditions de Paiement
    </h4>
    {!showAddCondition ? (
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          value={formData.conditionsPaiement}
          onChange={(e) => setFormData({ ...formData, conditionsPaiement: e.target.value })}
          style={{ flex: 1, padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        >
          <option value="">Sélectionner une condition</option>
          {parametres?.conditionsPaiement && Array.isArray(parametres.conditionsPaiement) && 
            parametres.conditionsPaiement.map((cond: string, i: number) => (
              <option key={i} value={cond}>{cond}</option>
            ))
          }
        </select>
        <button type="button" onClick={() => setShowAddCondition(true)} style={{ padding: '10px 16px', backgroundColor: SING_COLORS.secondary.main, color: SING_COLORS.neutral.gray[900], border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          +
        </button>
      </div>
    ) : (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newCondition}
          onChange={(e) => setNewCondition(e.target.value)}
          placeholder="Nouvelle condition..."
          autoFocus
          style={{ flex: 1, padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        />
        <button type="button" onClick={() => {
          if (newCondition.trim()) {
            setFormData({ ...formData, conditionsPaiement: newCondition });
            setNewCondition('');
          }
          setShowAddCondition(false);
        }} style={{ padding: '10px 16px', backgroundColor: SING_COLORS.primary.main, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          OK
        </button>
        <button type="button" onClick={() => { setNewCondition(''); setShowAddCondition(false); }} style={{ padding: '10px 16px', backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>
    )}
  </div>

  {/* RIB - Liste déroulante + bouton + */}
  <div>
    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: COLORS.text.primary }}>
      RIB
    </h4>
    {!showAddRib ? (
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          value={formData.rib}
          onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
          style={{ flex: 1, padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        >
          <option value="">Sélectionner un RIB</option>
          {parametres?.ribs && Array.isArray(parametres.ribs) && 
            parametres.ribs.map((rib: any, i: number) => (
              <option key={i} value={rib.numero}>{rib.nom}: {rib.numero}</option>
            ))
          }
        </select>
        <button type="button" onClick={() => setShowAddRib(true)} style={{ padding: '10px 16px', backgroundColor: SING_COLORS.secondary.main, color: SING_COLORS.neutral.gray[900], border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          +
        </button>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          value={newRib.nom}
          onChange={(e) => setNewRib({ ...newRib, nom: e.target.value })}
          placeholder="Nom du RIB (ex: UBA, AFG)..."
          autoFocus
          style={{ padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        />
        <input
          type="text"
          value={newRib.numero}
          onChange={(e) => setNewRib({ ...newRib, numero: e.target.value })}
          placeholder="Numéro du RIB..."
          style={{ padding: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '6px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => {
            if (newRib.nom.trim() && newRib.numero.trim()) {
              setFormData({ ...formData, rib: newRib.numero });
              setNewRib({ nom: '', numero: '' });
            }
            setShowAddRib(false);
          }} style={{ flex: 1, padding: '10px 16px', backgroundColor: SING_COLORS.primary.main, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            OK
          </button>
          <button type="button" onClick={() => { setNewRib({ nom: '', numero: '' }); setShowAddRib(false); }} style={{ flex: 1, padding: '10px 16px', backgroundColor: COLORS.background.secondary, border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      </div>
    )}
  </div>
</div>
```

## Statut

✅ Backend prêt (schéma Prisma + routes API)
✅ États et chargement des paramètres
✅ Section "Objet du devis" avec liste déroulante + bouton "+"
✅ Section "Totaux" avec checkboxes de sélection
🔄 Section "Modalités/Conditions/RIB" - Code fourni ci-dessus à intégrer manuellement

## Prochaines étapes

1. Intégrer le code de la section "Modalités/Conditions/RIB" ci-dessus
2. Tester le module avec des données réelles
3. Créer le module Paramètres pour gérer ces listes
4. Mettre à jour la seed pour initialiser les valeurs par défaut

---

**Note:** Le code est trop long pour être inséré automatiquement. Vous pouvez copier-coller la section "Modalités/Conditions/RIB" manuellement dans le fichier DevisModule.tsx à la place de l'ancienne section "Modalités de Paiement".
