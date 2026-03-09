import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS } from '../config/colors';

// Couleurs simplifiées pour le module
const COLORS = {
  primary: SING_COLORS.primary.main,
  secondary: SING_COLORS.secondary.main,
  accent: SING_COLORS.accent.main,
  border: SING_COLORS.neutral.gray[300],
  background: {
    primary: '#FFFFFF',
    secondary: SING_COLORS.neutral.gray[100]
  },
  text: {
    primary: SING_COLORS.neutral.gray[900],
    secondary: SING_COLORS.neutral.gray[600]
  }
};
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  Package,
  DollarSign,
  X,
  Save,
  ArrowRight
} from 'lucide-react';

interface Client {
  id: number;
  nom: string;
  adresse?: string;
  tel?: string;
  email?: string;
  pays: string;
  representants?: Representant[];
}

interface Representant {
  id: number;
  nom: string;
  fonction?: string;
  tel?: string;
  email?: string;
  principal: boolean;
}

interface Pack {
  id: number;
  code: string;
  descCourte: string;
  prixUnitaire: number;
  sousService: string;
  details: PackDetail[];
}

interface PackDetail {
  id: number;
  ordre: number;
  descriptionLongue: string;
}

interface LigneDevis {
  id?: number;
  packId?: number;
  produitId?: number;
  code: string;
  designation: string;
  prixUnitaire: number;
  quantite: number;
  total: number;
  details?: string[];
}

interface Devis {
  id?: number;
  numero: string;
  date: string;
  clientId: number;
  client?: Client;
  representantId?: number;
  reference?: string;
  lignes: LigneDevis[];
  soldeHt: number;
  remise: number;
  sousTotal: number;
  tps: number;
  css: number;
  netAPayer: number;
  conditionsPaiement?: string;
  statut: string;
}

export default function DevisModule() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [editingDevis, setEditingDevis] = useState<Devis | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    clientId: 0,
    representantId: 0,
    date: new Date().toISOString().split('T')[0],
    objet: '',
    reference: '',
    conditionsPaiement: ''
  });
  const [lignes, setLignes] = useState<LigneDevis[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [numeroDevis, setNumeroDevis] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [devisData, clientsData, packsData] = await Promise.all([
        api.getDevis(),
        api.getClients(),
        api.getPacks({ actif: true })
      ]);
      setDevis(devisData);
      setClients(clientsData);
      setPacks(packsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (devisToEdit?: Devis) => {
    if (devisToEdit) {
      setEditingDevis(devisToEdit);
      setFormData({
        clientId: devisToEdit.clientId,
        representantId: devisToEdit.representantId || 0,
        date: devisToEdit.date,
        objet: devisToEdit.reference || '',
        reference: devisToEdit.reference || '',
        conditionsPaiement: devisToEdit.conditionsPaiement || ''
      });
      setLignes(devisToEdit.lignes);
      setNumeroDevis(devisToEdit.numero);
      const client = clients.find(c => c.id === devisToEdit.clientId);
      setSelectedClient(client || null);
    } else {
      setEditingDevis(null);
      setFormData({
        clientId: 0,
        representantId: 0,
        date: new Date().toISOString().split('T')[0],
        objet: '',
        reference: '',
        conditionsPaiement: 'Paiement à 30 jours'
      });
      setLignes([]);
      setSelectedClient(null);
      
      // Générer le prochain numéro
      try {
        const { numero } = await api.getNumeroSuivantDevis();
        setNumeroDevis(numero);
      } catch (error) {
        console.error('Erreur génération numéro:', error);
      }
    }
    setShowModal(true);
  };

  const handleClientChange = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setFormData({ ...formData, clientId, representantId: 0 });
  };

  const handleAddPackToLignes = (pack: Pack) => {
    const newLigne: LigneDevis = {
      packId: pack.id,
      produitId: pack.id,
      code: pack.code,
      designation: pack.descCourte,
      prixUnitaire: Number(pack.prixUnitaire),
      quantite: 1,
      total: Number(pack.prixUnitaire),
      details: pack.details.map(d => d.descriptionLongue)
    };
    setLignes([...lignes, newLigne]);
    setShowPackModal(false);
  };

  const handleAddCustomLigne = () => {
    const newLigne: LigneDevis = {
      code: '',
      designation: '',
      prixUnitaire: 0,
      quantite: 1,
      total: 0,
      details: []
    };
    setLignes([...lignes, newLigne]);
  };

  const handleUpdateLigne = (index: number, field: string, value: any) => {
    const updatedLignes = [...lignes];
    updatedLignes[index] = { ...updatedLignes[index], [field]: value };
    
    if (field === 'prixUnitaire' || field === 'quantite') {
      updatedLignes[index].total = updatedLignes[index].prixUnitaire * updatedLignes[index].quantite;
    }
    
    setLignes(updatedLignes);
  };

  const handleRemoveLigne = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const soldeHt = lignes.reduce((sum, ligne) => sum + ligne.total, 0);
    const remise = soldeHt * 0.095;
    const sousTotal = soldeHt - remise;
    const tps = sousTotal * 0.095;
    const css = sousTotal * 0.01;
    const netAPayer = sousTotal + tps + css;
    
    return { soldeHt, remise, sousTotal, tps, css, netAPayer };
  };

  const handleSaveDevis = async () => {
    if (!formData.clientId || lignes.length === 0) {
      alert('Veuillez sélectionner un client et ajouter au moins une ligne');
      return;
    }

    try {
      const devisData = {
        clientId: formData.clientId,
        representantId: formData.representantId || undefined,
        date: formData.date,
        objet: formData.objet,
        reference: formData.reference,
        conditionsPaiement: formData.conditionsPaiement,
        lignes: lignes.map(l => ({
          produitId: l.produitId || l.packId || 1,
          designation: l.designation,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire
        }))
      };

      if (editingDevis) {
        await api.updateDevis(editingDevis.id!, devisData);
      } else {
        await api.createDevis(devisData);
      }

      setShowModal(false);
      loadData();
      alert('Devis enregistré avec succès');
    } catch (error: any) {
      console.error('Erreur sauvegarde devis:', error);
      alert(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteDevis = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) return;

    try {
      await api.deleteDevis(id);
      loadData();
      alert('Devis supprimé avec succès');
    } catch (error: any) {
      console.error('Erreur suppression devis:', error);
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const handleConvertToBC = async (id: number) => {
    if (!confirm('Convertir ce devis en bon de commande ?')) return;

    try {
      await api.convertirDevisEnBC(id);
      alert('Devis converti en bon de commande avec succès');
      loadData();
    } catch (error: any) {
      console.error('Erreur conversion:', error);
      alert(error.message || 'Erreur lors de la conversion');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
  };

  const filteredDevis = devis.filter(d =>
    d.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.client?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.reference && d.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totals = calculateTotals();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: COLORS.text.secondary }}>
          Chargement des devis...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px', 
            color: COLORS.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FileText size={28} color={SING_COLORS.primary.main} />
            Devis
          </h2>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: COLORS.text.secondary,
            fontSize: '14px'
          }}>
            Gérer vos devis clients
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{
            padding: '12px 24px',
            backgroundColor: SING_COLORS.primary.main,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} />
          Nouveau Devis
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: COLORS.text.secondary
            }} 
          />
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.background.secondary }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>N° Devis</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Client</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Objet</th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Montant HT</th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>Net à payer</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: COLORS.text.secondary }}>
                  Aucun devis trouvé
                </td>
              </tr>
            ) : (
              filteredDevis.map((d) => (
                <tr key={d.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{d.numero}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    {new Date(d.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{d.client?.nom}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{d.reference || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
                    {formatCurrency(Number(d.soldeHt))}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(Number(d.netAPayer))}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleOpenModal(d)}
                        style={{
                          padding: '6px',
                          backgroundColor: SING_COLORS.accent.main,
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleConvertToBC(d.id!)}
                        style={{
                          padding: '6px',
                          backgroundColor: SING_COLORS.secondary.main,
                          color: COLORS.text.primary,
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Convertir en BC"
                      >
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDevis(d.id!)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Création/Édition */}
      {showModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: COLORS.text.primary }}>
                {editingDevis ? 'Modifier le devis' : 'Nouveau devis'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: COLORS.text.secondary
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Section 1: Informations Générales */}
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: COLORS.background.secondary,
                borderRadius: '8px'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  color: COLORS.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Building2 size={20} color={SING_COLORS.primary.main} />
                  Informations Générales
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Client *
                    </label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleClientChange(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value={0}>Sélectionner un client</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Représentant
                    </label>
                    <select
                      value={formData.representantId}
                      onChange={(e) => setFormData({ ...formData, representantId: Number(e.target.value) })}
                      disabled={!selectedClient || !selectedClient.representants?.length}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value={0}>Sélectionner un représentant</option>
                      {selectedClient?.representants?.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.nom} {r.principal && '(Principal)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      N° Devis
                    </label>
                    <input
                      type="text"
                      value={numeroDevis}
                      disabled
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: COLORS.background.secondary
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Objet du devis *
                    </label>
                    <textarea
                      value={formData.objet}
                      onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                      placeholder="Description de l'objet du devis..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Lignes du Devis */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  color: COLORS.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package size={20} color={SING_COLORS.primary.main} />
                  Lignes du Devis
                </h4>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button
                    onClick={() => setShowPackModal(true)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: SING_COLORS.accent.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Package size={16} />
                    Ajouter depuis Pack
                  </button>
                  <button
                    onClick={handleAddCustomLigne}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: SING_COLORS.secondary.main,
                      color: COLORS.text.primary,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} />
                    Ligne Personnalisée
                  </button>
                </div>

                {/* Table des lignes */}
                <div style={{ 
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: COLORS.background.secondary }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', width: '80px' }}>Code</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>Désignation</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', width: '120px' }}>P.U</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', width: '80px' }}>Qté</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', width: '120px' }}>Total</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: COLORS.text.secondary }}>
                            Aucune ligne ajoutée
                          </td>
                        </tr>
                      ) : (
                        lignes.map((ligne, index) => (
                          <tr key={index} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                value={ligne.code}
                                onChange={(e) => handleUpdateLigne(index, 'code', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                value={ligne.designation}
                                onChange={(e) => handleUpdateLigne(index, 'designation', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}
                              />
                              {ligne.details && ligne.details.length > 0 && (
                                <div style={{ marginTop: '8px', fontSize: '12px', color: COLORS.text.secondary }}>
                                  {ligne.details.map((detail, i) => (
                                    <div key={i}>- {detail}</div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                value={ligne.prixUnitaire}
                                onChange={(e) => handleUpdateLigne(index, 'prixUnitaire', Number(e.target.value))}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  textAlign: 'right'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                value={ligne.quantite}
                                onChange={(e) => handleUpdateLigne(index, 'quantite', Number(e.target.value))}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '500' }}>
                              {formatCurrency(ligne.total)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleRemoveLigne(index)}
                                style={{
                                  padding: '4px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Totaux */}
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: COLORS.background.secondary,
                borderRadius: '8px'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  color: COLORS.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <DollarSign size={20} color={SING_COLORS.primary.main} />
                  Totaux
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Solde HT:</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(totals.soldeHt)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: SING_COLORS.primary.main }}>
                    <span>Remise (9.5%):</span>
                    <span style={{ fontWeight: '500' }}>- {formatCurrency(totals.remise)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingTop: '8px', borderTop: `1px solid ${COLORS.border}` }}>
                    <span>Sous-total:</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(totals.sousTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>TPS (9.5%):</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(totals.tps)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>CSS (1%):</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(totals.css)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '16px',
                    fontWeight: '600',
                    paddingTop: '12px',
                    borderTop: `2px solid ${SING_COLORS.primary.main}`,
                    color: SING_COLORS.primary.main
                  }}>
                    <span>NET À PAYER:</span>
                    <span>{formatCurrency(totals.netAPayer)}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Modalités de Paiement */}
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: COLORS.background.secondary,
                borderRadius: '8px'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px',
                  color: COLORS.text.primary
                }}>
                  Modalités de Paiement
                </h4>
                
                <textarea
                  value={formData.conditionsPaiement}
                  onChange={(e) => setFormData({ ...formData, conditionsPaiement: e.target.value })}
                  rows={3}
                  placeholder="Ex: Paiement à 30 jours, Espèces, Virement, Chèque..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px',
              borderTop: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveDevis}
                style={{
                  padding: '10px 24px',
                  backgroundColor: SING_COLORS.primary.main,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sélection Pack */}
      {showPackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: COLORS.text.primary }}>
                Sélectionner un Pack
              </h3>
              <button
                onClick={() => setShowPackModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: COLORS.text.secondary
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                {packs.map(pack => (
                  <div
                    key={pack.id}
                    onClick={() => handleAddPackToLignes(pack)}
                    style={{
                      padding: '16px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = SING_COLORS.primary.main;
                      e.currentTarget.style.backgroundColor = COLORS.background.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary }}>
                          {pack.code} - {pack.descCourte}
                        </div>
                        <div style={{ fontSize: '13px', color: COLORS.text.secondary, marginTop: '4px' }}>
                          {pack.sousService}
                        </div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: SING_COLORS.primary.main }}>
                        {formatCurrency(Number(pack.prixUnitaire))}
                      </div>
                    </div>
                    {pack.details && pack.details.length > 0 && (
                      <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginTop: '8px' }}>
                        {pack.details.slice(0, 3).map((detail, i) => (
                          <div key={i}>• {detail.descriptionLongue}</div>
                        ))}
                        {pack.details.length > 3 && (
                          <div style={{ fontStyle: 'italic', marginTop: '4px' }}>
                            +{pack.details.length - 3} autres détails...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
