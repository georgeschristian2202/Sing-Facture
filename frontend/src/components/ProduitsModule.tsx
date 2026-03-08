import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';

interface Pack {
  id: number;
  code: string;
  descCourte: string;
  prixUnitaire: number;
  sousService: string;
  actif: boolean;
  details: PackDetail[];
}

interface PackDetail {
  id: number;
  ordre: number;
  descriptionLongue: string;
}

export default function ProduitsModule() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSousService, setFilterSousService] = useState('');
  const [sousServices, setSousServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    descCourte: '',
    prixUnitaire: '',
    sousService: '',
    actif: true,
    details: ['']
  });

  useEffect(() => {
    loadPacks();
    loadSousServices();
  }, []);

  const loadPacks = async () => {
    try {
      const data = await api.getPacks({ actif: true });
      setPacks(data);
    } catch (error) {
      console.error('Erreur chargement packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSousServices = async () => {
    try {
      const data = await api.getSousServices();
      setSousServices(data);
    } catch (error) {
      console.error('Erreur chargement sous-services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const packData = {
        ...formData,
        prixUnitaire: parseFloat(formData.prixUnitaire),
        details: formData.details.filter(d => d.trim() !== '')
      };

      if (editingPack) {
        await api.updatePack(editingPack.id, packData);
      } else {
        await api.createPack(packData);
      }
      setShowModal(false);
      setEditingPack(null);
      resetForm();
      loadPacks();
      loadSousServices();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      descCourte: '',
      prixUnitaire: '',
      sousService: '',
      actif: true,
      details: ['']
    });
  };

  const handleEdit = (pack: Pack) => {
    setEditingPack(pack);
    setFormData({
      code: pack.code,
      descCourte: pack.descCourte,
      prixUnitaire: pack.prixUnitaire.toString(),
      sousService: pack.sousService,
      actif: pack.actif,
      details: pack.details.length > 0 ? pack.details.map(d => d.descriptionLongue) : ['']
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) return;
    
    try {
      await api.deletePack(id);
      loadPacks();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const addDetail = () => {
    setFormData({ ...formData, details: [...formData.details, ''] });
  };

  const removeDetail = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails.length > 0 ? newDetails : [''] });
  };

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const filteredPacks = packs.filter(p => 
    (p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.descCourte.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterSousService === '' || p.sousService === filterSousService)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {/* Header avec filtres */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Rechercher un pack..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '12px',
            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
            borderRadius: SING_THEME.borderRadius.md,
            fontSize: '14px',
            outline: 'none'
          }}
        />
        
        <select
          value={filterSousService}
          onChange={(e) => setFilterSousService(e.target.value)}
          style={{
            padding: '12px',
            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
            borderRadius: SING_THEME.borderRadius.md,
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Tous les sous-services</option>
          {sousServices.map((ss, i) => (
            <option key={i} value={ss}>{ss}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditingPack(null);
            resetForm();
            setShowModal(true);
          }}
          style={{
            padding: '12px 24px',
            background: SING_COLORS.primary.main,
            color: '#fff',
            border: 'none',
            borderRadius: SING_THEME.borderRadius.md,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nouveau Pack
        </button>
      </div>

      {/* Grille des packs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredPacks.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: SING_COLORS.neutral.gray[500] }}>
            {searchTerm || filterSousService ? 'Aucun pack trouvé' : 'Aucun pack enregistré'}
          </div>
        ) : (
          filteredPacks.map((pack) => (
            <div key={pack.id} style={{
              background: '#fff',
              borderRadius: SING_THEME.borderRadius.lg,
              padding: '20px',
              boxShadow: SING_THEME.shadows.md,
              border: `2px solid ${SING_COLORS.secondary.main}`,
              transition: 'all 0.2s'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{
                  background: SING_COLORS.secondary.main,
                  color: SING_COLORS.neutral.gray[900],
                  padding: '4px 12px',
                  borderRadius: SING_THEME.borderRadius.sm,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {pack.code}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(pack)}
                    style={{
                      padding: '4px 8px',
                      background: SING_COLORS.accent.main,
                      color: '#fff',
                      border: 'none',
                      borderRadius: SING_THEME.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(pack.id)}
                    style={{
                      padding: '4px 8px',
                      background: SING_COLORS.status.error,
                      color: '#fff',
                      border: 'none',
                      borderRadius: SING_THEME.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Description */}
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: SING_COLORS.neutral.gray[900] }}>
                {pack.descCourte}
              </h3>

              {/* Prix */}
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: SING_COLORS.primary.main, marginBottom: '12px' }}>
                {formatCurrency(pack.prixUnitaire)}
              </div>

              {/* Sous-service */}
              <div style={{
                fontSize: '12px',
                color: SING_COLORS.neutral.gray[600],
                marginBottom: '12px',
                padding: '4px 8px',
                background: SING_COLORS.neutral.gray[100],
                borderRadius: SING_THEME.borderRadius.sm,
                display: 'inline-block'
              }}>
                {pack.sousService}
              </div>

              {/* Détails */}
              {pack.details.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${SING_COLORS.neutral.gray[200]}` }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Détails :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>
                    {pack.details.slice(0, 3).map((detail) => (
                      <li key={detail.id} style={{ marginBottom: '4px' }}>
                        {detail.descriptionLongue}
                      </li>
                    ))}
                    {pack.details.length > 3 && (
                      <li style={{ color: SING_COLORS.primary.main, fontStyle: 'italic' }}>
                        +{pack.details.length - 3} autre(s)...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Création/Édition */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: SING_THEME.borderRadius.lg,
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: SING_COLORS.primary.main }}>
              {editingPack ? 'Modifier le pack' : 'Nouveau pack'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                    Code <span style={{ color: SING_COLORS.status.error }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ex: S1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: SING_THEME.borderRadius.md,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                    Prix Unitaire (FCFA) <span style={{ color: SING_COLORS.status.error }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.prixUnitaire}
                    onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
                    placeholder="Ex: 1187500"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: SING_THEME.borderRadius.md,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                  Description Courte <span style={{ color: SING_COLORS.status.error }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.descCourte}
                  onChange={(e) => setFormData({ ...formData, descCourte: e.target.value })}
                  placeholder="Ex: Assistance informatique - SING Réseau"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                  Sous-Service <span style={{ color: SING_COLORS.status.error }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sousService}
                  onChange={(e) => setFormData({ ...formData, sousService: e.target.value })}
                  placeholder="Ex: Assistance informatique"
                  list="sous-services-list"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <datalist id="sous-services-list">
                  {sousServices.map((ss, i) => (
                    <option key={i} value={ss} />
                  ))}
                </datalist>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                  Détails (Descriptions longues)
                </label>
                {formData.details.map((detail, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => updateDetail(index, e.target.value)}
                      placeholder={`Détail ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                        borderRadius: SING_THEME.borderRadius.md,
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formData.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        style={{
                          padding: '10px',
                          background: SING_COLORS.status.error,
                          color: '#fff',
                          border: 'none',
                          borderRadius: SING_THEME.borderRadius.md,
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDetail}
                  style={{
                    padding: '8px 16px',
                    background: SING_COLORS.secondary.main,
                    color: SING_COLORS.neutral.gray[900],
                    border: 'none',
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Ajouter un détail
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    color: SING_COLORS.neutral.gray[600],
                    border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: SING_THEME.borderRadius.md,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: SING_COLORS.primary.main,
                    color: '#fff',
                    border: 'none',
                    borderRadius: SING_THEME.borderRadius.md,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingPack ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
