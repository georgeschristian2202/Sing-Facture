import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS } from '../config/colors';
import { Plus, Search, Edit, Trash2, Package, X } from 'lucide-react';

interface Produit {
  id: number;
  code: string;
  description: string;
  descriptionCourte?: string;
  prixUnitaireHT: number;
  categorie: string;
  actif: boolean;
}

const CATEGORIES = [
  'Programme',
  'SING logiciels',
  'SING conseil',
  'Incubateur'
];

export default function ProduitsModule() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    descriptionCourte: '',
    prixUnitaireHT: '',
    categorie: 'Programme',
    actif: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProduits();
  }, []);

  useEffect(() => {
    if (editingProduit) {
      setFormData({
        code: editingProduit.code || '',
        description: editingProduit.description || '',
        descriptionCourte: editingProduit.descriptionCourte || '',
        prixUnitaireHT: editingProduit.prixUnitaireHT.toString(),
        categorie: editingProduit.categorie || 'Programme',
        actif: editingProduit.actif !== false
      });
    } else {
      setFormData({
        code: '',
        description: '',
        descriptionCourte: '',
        prixUnitaireHT: '',
        categorie: 'Programme',
        actif: true
      });
    }
  }, [editingProduit, showModal]);

  const loadProduits = async () => {
    try {
      const data = await api.getProduits();
      setProduits(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette prestation ?')) return;
    try {
      await api.deleteProduit(id);
      setProduits(produits.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.code.trim() || !formData.description.trim() || !formData.prixUnitaireHT) {
      alert('Code, description et prix sont requis');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...formData,
        prixUnitaireHT: parseFloat(formData.prixUnitaireHT)
      };

      if (editingProduit) {
        const updated = await api.updateProduit(editingProduit.id, data);
        setProduits(produits.map(p => p.id === editingProduit.id ? updated : p));
      } else {
        const created = await api.createProduit(data);
        setProduits([created, ...produits]);
      }
      setShowModal(false);
      setEditingProduit(null);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const filteredProduits = produits.filter(p => {
    const matchSearch = p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !selectedCategorie || p.categorie === selectedCategorie;
    return matchSearch && matchCategorie;
  });

  const groupedProduits = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredProduits.filter(p => p.categorie === cat);
    return acc;
  }, {} as Record<string, Produit[]>);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: '0 0 4px 0' }}>
            Catalogue des Prestations
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600], margin: 0, fontSize: '14px' }}>
            {produits.length} prestation(s) enregistrée(s)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduit(null);
            setShowModal(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: SING_COLORS.primary.main,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={18} />
          Nouvelle prestation
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: SING_COLORS.neutral.gray[400] }} />
        <input
          type="text"
          placeholder="Rechercher une prestation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white'
          }}
        />
      </div>

      {/* Prestations by Category */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ width: '48px', height: '48px', border: `4px solid ${SING_COLORS.primary.main}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {CATEGORIES.map(categorie => {
            const items = groupedProduits[categorie];
            if (items.length === 0) return null;

            return (
              <div key={categorie}>
                {/* Category Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: SING_COLORS.primary.dark, margin: 0 }}>
                    {categorie}
                  </h2>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: `${SING_COLORS.primary.main}15`,
                    color: SING_COLORS.primary.main,
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {items.length}
                  </span>
                </div>

                {/* Products Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {items.map((produit) => (
                    <div
                      key={produit.id}
                      style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                          padding: '6px 12px',
                          backgroundColor: `${SING_COLORS.secondary.main}`,
                          color: SING_COLORS.primary.dark,
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}>
                          {produit.code}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              setEditingProduit(produit);
                              setShowModal(true);
                            }}
                            style={{
                              padding: '6px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: SING_COLORS.neutral.gray[400],
                              transition: 'all 0.2s'
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(produit.id)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: SING_COLORS.neutral.gray[400],
                              transition: 'all 0.2s'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: SING_COLORS.primary.dark,
                        margin: '0 0 6px 0',
                        lineHeight: '1.4'
                      }}>
                        {produit.description}
                      </h3>

                      {produit.descriptionCourte && (
                        <p style={{
                          fontSize: '13px',
                          color: SING_COLORS.neutral.gray[600],
                          margin: '0 0 12px 0',
                          lineHeight: '1.4'
                        }}>
                          {produit.descriptionCourte}
                        </p>
                      )}

                      {/* Price */}
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: SING_COLORS.primary.main, margin: 0 }}>
                          {formatPrice(produit.prixUnitaireHT)}
                        </p>
                        <p style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[500], margin: '2px 0 0 0' }}>
                          Prix unitaire HT
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredProduits.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: SING_COLORS.neutral.gray[400] }}>
              Aucune prestation trouvée
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: 0 }}>
                  {editingProduit ? 'Modifier la prestation' : 'Nouvelle prestation'}
                </h2>
                <p style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[500], margin: '4px 0 0 0' }}>
                  Remplissez les informations de la prestation
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#f3f4f6', color: SING_COLORS.neutral.gray[600], cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                      Code <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="Ex: S1" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                      Catégorie <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s', backgroundColor: 'white', cursor: 'pointer' }}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                    Description <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="Description complète" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                    Description courte (PDF)
                  </label>
                  <input type="text" value={formData.descriptionCourte} onChange={(e) => setFormData({ ...formData, descriptionCourte: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="Description courte pour PDF" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                    Prix unitaire HT (FCFA) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="number" value={formData.prixUnitaireHT} onChange={(e) => setFormData({ ...formData, prixUnitaireHT: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="0" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: '#fafbfc' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 24px', backgroundColor: 'white', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: SING_COLORS.neutral.gray[700], transition: 'all 0.2s' }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || !formData.code.trim() || !formData.description.trim() || !formData.prixUnitaireHT} style={{ padding: '12px 32px', backgroundColor: saving || !formData.code.trim() || !formData.description.trim() || !formData.prixUnitaireHT ? SING_COLORS.neutral.gray[400] : SING_COLORS.primary.main, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving || !formData.code.trim() || !formData.description.trim() || !formData.prixUnitaireHT ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,117,141,0.3)' }}>
                {saving ? 'Enregistrement...' : editingProduit ? 'Mettre à jour' : 'Créer la prestation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
