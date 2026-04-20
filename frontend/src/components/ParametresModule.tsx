import { useState, useEffect } from 'react';
import { SING_COLORS } from '../config/colors';
import { Building2, DollarSign, CreditCard, FileText, Save, Plus, X } from 'lucide-react';
import { api } from '../services/api';

interface Parametres {
  id: number;
  nomEntreprise: string;
  adresse: string;
  telephone: string;
  email: string;
  siteWeb: string;
  rccm: string;
  numStatistique: string;
  capital: string;
  tauxTps: number;
  tauxCss: number;
  tauxTva: number;
  tauxRemise: number;
  typeTaxe: string;
  ribUba: string;
  ribAfg: string;
  modalitesPaiement: string[];
  conditionsPaiement: string[];
}

type TabType = 'entreprise' | 'fiscalite' | 'banque' | 'documents';

export default function ParametresModule() {
  const [activeTab, setActiveTab] = useState<TabType>('entreprise');
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Parametres>>({
    nomEntreprise: '',
    adresse: '',
    telephone: '',
    email: '',
    siteWeb: '',
    rccm: '',
    numStatistique: '',
    capital: '',
    tauxTps: 0.095,
    tauxCss: 0.01,
    tauxTva: 0.18,
    tauxRemise: 0.095,
    typeTaxe: 'TVA',
    ribUba: '',
    ribAfg: '',
    modalitesPaiement: [],
    conditionsPaiement: []
  });
  const [newModalite, setNewModalite] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    loadParametres();
  }, []);

  const loadParametres = async () => {
    try {
      const response = await api.get('/parametres');
      const data = response.data || response;
      setParametres(data);
      setFormData({
        ...data,
        modalitesPaiement: data.modalitesPaiement || [],
        conditionsPaiement: data.conditionsPaiement || []
      });
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/parametres', formData);
      const data = response.data || response;
      setParametres(data);
      setFormData({
        ...data,
        modalitesPaiement: data.modalitesPaiement || [],
        conditionsPaiement: data.conditionsPaiement || []
      });
      alert('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Parametres, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addModalite = () => {
    if (newModalite.trim()) {
      const modalites = [...(formData.modalitesPaiement || []), newModalite.trim()];
      handleChange('modalitesPaiement', modalites);
      setNewModalite('');
    }
  };

  const removeModalite = (index: number) => {
    const modalites = (formData.modalitesPaiement || []).filter((_, i) => i !== index);
    handleChange('modalitesPaiement', modalites);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const conditions = [...(formData.conditionsPaiement || []), newCondition.trim()];
      handleChange('conditionsPaiement', conditions);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    const conditions = (formData.conditionsPaiement || []).filter((_, i) => i !== index);
    handleChange('conditionsPaiement', conditions);
  };

  const tabs = [
    { id: 'entreprise' as TabType, label: 'Entreprise', icon: Building2 },
    { id: 'fiscalite' as TabType, label: 'Fiscalité', icon: DollarSign },
    { id: 'banque' as TabType, label: 'Banque & Paiement', icon: CreditCard },
    { id: 'documents' as TabType, label: 'Documents & Modèles', icon: FileText }
  ];

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: '0 0 8px 0' }}>
            Paramètres
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600], margin: 0 }}>
            Configuration de l'application
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: SING_COLORS.accent.main,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1
          }}
        >
          <Save size={18} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        borderBottom: `2px solid ${SING_COLORS.neutral.gray[200]}`,
        marginBottom: '32px'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? `3px solid ${SING_COLORS.accent.main}` : '3px solid transparent',
                color: isActive ? SING_COLORS.accent.main : SING_COLORS.neutral.gray[600],
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        {activeTab === 'entreprise' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '24px' }}>
              Informations de l'entreprise
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={formData.nomEntreprise || ''}
                  onChange={(e) => handleChange('nomEntreprise', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={formData.telephone || ''}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Site Web
                </label>
                <input
                  type="text"
                  value={formData.siteWeb || ''}
                  onChange={(e) => handleChange('siteWeb', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    N° RCCM
                  </label>
                  <input
                    type="text"
                    value={formData.rccm || ''}
                    onChange={(e) => handleChange('rccm', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    N° Statistique
                  </label>
                  <input
                    type="text"
                    value={formData.numStatistique || ''}
                    onChange={(e) => handleChange('numStatistique', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Social de la capitale
                </label>
                <input
                  type="text"
                  value={formData.capital || ''}
                  onChange={(e) => handleChange('capital', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fiscalite' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '24px' }}>
              Configuration fiscale
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Type de taxe appliquée
                </label>
                <select
                  value={formData.typeTaxe || 'TVA'}
                  onChange={(e) => handleChange('typeTaxe', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="TVA">TVA — Taxe sur la Valeur Ajoutée</option>
                  <option value="TPS">TPS — Taxe sur les Produits et Services</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Taux TPS (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxTps ? (Number(formData.tauxTps) * 100).toFixed(2) : '9.5'}
                    onChange={(e) => handleChange('tauxTps', parseFloat(e.target.value) / 100)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Taux TVA (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxTva ? (Number(formData.tauxTva) * 100).toFixed(2) : '18'}
                    onChange={(e) => handleChange('tauxTva', parseFloat(e.target.value) / 100)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Taux CSS (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxCss ? (Number(formData.tauxCss) * 100).toFixed(2) : '1'}
                    onChange={(e) => handleChange('tauxCss', parseFloat(e.target.value) / 100)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                    Taux de remise (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxRemise ? (Number(formData.tauxRemise) * 100).toFixed(2) : '9.5'}
                    onChange={(e) => handleChange('tauxRemise', parseFloat(e.target.value) / 100)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: SING_COLORS.neutral.gray[50],
                borderRadius: '8px',
                fontSize: '13px',
                color: SING_COLORS.neutral.gray[600]
              }}>
                <strong>Formule appliquée :</strong><br />
                Sous-total HT × (1 - remise %) = Sous-total 2<br />
                Net à payer = Sous-total 2 + TPS + CSS
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banque' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '24px' }}>
              Coordonnées Bancaires (RIB)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: SING_COLORS.neutral.gray[700], marginBottom: '8px' }}>
                  Liste des RIBs
                </label>
                <p style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[500], marginBottom: '12px' }}>
                  Aucun élément. Ajoutez-en un
                </p>
                <button
                  onClick={() => {
                    const rib = prompt('Ajouter un RIB:');
                    if (rib) handleChange('ribUba', rib);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#d4f4dd',
                    color: SING_COLORS.primary.dark,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  Ajouter un RIB
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '16px' }}>
                  Modalités de Paiement
                </h3>
                <p style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[500], marginBottom: '12px' }}>
                  {(formData.modalitesPaiement || []).length === 0 ? 'Aucun élément. Ajoutez-en un' : ''}
                </p>
                
                {(formData.modalitesPaiement || []).map((modalite, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: SING_COLORS.neutral.gray[50],
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '14px', color: SING_COLORS.neutral.gray[700] }}>{modalite}</span>
                    <button
                      onClick={() => removeModalite(index)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: SING_COLORS.neutral.gray[500]
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="text"
                    value={newModalite}
                    onChange={(e) => setNewModalite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addModalite()}
                    placeholder="Nouvelle modalité"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={addModalite}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: SING_COLORS.accent.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '16px' }}>
                  Conditions de Paiement
                </h3>
                <p style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[500], marginBottom: '12px' }}>
                  {(formData.conditionsPaiement || []).length === 0 ? 'Aucun élément. Ajoutez-en un' : ''}
                </p>
                
                {(formData.conditionsPaiement || []).map((condition, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: SING_COLORS.neutral.gray[50],
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '14px', color: SING_COLORS.neutral.gray[700] }}>{condition}</span>
                    <button
                      onClick={() => removeCondition(index)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: SING_COLORS.neutral.gray[500]
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                    placeholder="Nouvelle condition"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={addCondition}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: SING_COLORS.accent.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '24px' }}>
              Documents & Modèles
            </h2>
            <div style={{
              padding: '48px',
              textAlign: 'center',
              backgroundColor: SING_COLORS.neutral.gray[50],
              borderRadius: '8px'
            }}>
              <FileText size={48} color={SING_COLORS.neutral.gray[400]} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '14px', color: SING_COLORS.neutral.gray[600] }}>
                Gestion des modèles de documents (à venir)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
