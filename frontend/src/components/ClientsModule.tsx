import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS } from '../config/colors';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin, X } from 'lucide-react';

interface Representant {
  id?: number;
  nom: string;
  fonction?: string;
  tel?: string;
  email?: string;
  principal: boolean;
}

interface Client {
  id: number;
  nom: string;
  adresse?: string;
  tel?: string;
  email?: string;
  pays: string;
  representants?: Representant[];
}

const PAYS_LIST = [
  'Gabon', 'Cameroun', 'Congo', 'RDC', 'Guinée Équatoriale', 'Tchad', 'Centrafrique',
  'France', 'Belgique', 'Suisse', 'Canada', "Côte d'Ivoire", 'Sénégal', 'Mali',
  'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Autre'
];

export default function ClientsModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    tel: '',
    email: '',
    pays: 'Gabon',
    representants: [{ nom: '', fonction: '', tel: '', email: '', principal: true }] as Representant[]
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        nom: editingClient.nom || '',
        adresse: editingClient.adresse || '',
        tel: editingClient.tel || '',
        email: editingClient.email || '',
        pays: editingClient.pays || 'Gabon',
        representants: editingClient.representants && editingClient.representants.length > 0
          ? editingClient.representants
          : [{ nom: '', fonction: '', tel: '', email: '', principal: true }]
      });
    } else {
      setFormData({
        nom: '',
        adresse: '',
        tel: '',
        email: '',
        pays: 'Gabon',
        representants: [{ nom: '', fonction: '', tel: '', email: '', principal: true }]
      });
    }
  }, [editingClient, showModal]);

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce client ?')) return;
    try {
      await api.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.nom.trim()) {
      alert('Le nom du client est requis');
      return;
    }

    setSaving(true);
    try {
      if (editingClient) {
        const updated = await api.updateClient(editingClient.id, formData);
        setClients(clients.map(c => c.id === editingClient.id ? updated : c));
      } else {
        const created = await api.createClient(formData);
        setClients([created, ...clients]);
      }
      setShowModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateRepresentant = (index: number, field: keyof Representant, value: any) => {
    const newReps = [...formData.representants];
    newReps[index] = { ...newReps[index], [field]: value };
    setFormData({ ...formData, representants: newReps });
  };

  const addRepresentant = () => {
    setFormData({
      ...formData,
      representants: [...formData.representants, { nom: '', fonction: '', tel: '', email: '', principal: false }]
    });
  };

  const removeRepresentant = (index: number) => {
    if (formData.representants.length === 1) return;
    setFormData({
      ...formData,
      representants: formData.representants.filter((_, i) => i !== index)
    });
  };

  const filteredClients = clients.filter(c =>
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.representants?.some(r => r.nom?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRepresentantPrincipal = (client: Client) => {
    return client.representants?.find(r => r.principal);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: '0 0 4px 0' }}>
            Clients
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600], margin: 0, fontSize: '14px' }}>
            {clients.length} client(s) enregistré(s)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
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
          Nouveau client
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: SING_COLORS.neutral.gray[400] }} />
        <input
          type="text"
          placeholder="Rechercher un client..."
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

      {/* Clients Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ width: '48px', height: '48px', border: `4px solid ${SING_COLORS.primary.main}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredClients.map((client) => {
            const rep = getRepresentantPrincipal(client);
            return (
              <div key={client.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', transition: 'all 0.2s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${SING_COLORS.primary.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color={SING_COLORS.primary.main} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => { setEditingClient(client); setShowModal(true); }} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: SING_COLORS.neutral.gray[400], transition: 'all 0.2s' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: SING_COLORS.neutral.gray[400], transition: 'all 0.2s' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: SING_COLORS.primary.dark, margin: '0 0 8px 0' }}>{client.nom}</h3>
                {rep && <p style={{ fontSize: '13px', color: SING_COLORS.primary.main, fontWeight: '500', margin: '0 0 12px 0' }}>Représentant : {rep.nom}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  {client.adresse && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={14} color={SING_COLORS.neutral.gray[400]} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[600], lineHeight: '1.4' }}>{client.adresse}</span>
                    </div>
                  )}
                  {client.tel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color={SING_COLORS.neutral.gray[400]} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[600] }}>{client.tel}</span>
                    </div>
                  )}
                  {client.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} color={SING_COLORS.neutral.gray[400]} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[600], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[400] }}>{client.pays || 'Gabon'}</span>
                </div>
              </div>
            );
          })}
          {filteredClients.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: SING_COLORS.neutral.gray[400] }}>
              Aucun client trouvé
            </div>
          )}
        </div>
      )}

      {/* Modal Moderne */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: 0 }}>
                  {editingClient ? 'Modifier le client' : 'Nouveau client'}
                </h2>
                <p style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[500], margin: '4px 0 0 0' }}>
                  Remplissez les informations du client
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#f3f4f6', color: SING_COLORS.neutral.gray[600], cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
              {/* Informations client */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6' }}>
                  <User size={18} color={SING_COLORS.primary.main} />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: SING_COLORS.primary.dark, margin: 0 }}>Informations client</h3>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>
                      Nom du client <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="Ex: SING S.A." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>Adresse complète</label>
                    <input type="text" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="Rue, quartier, ville" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>Téléphone</label>
                      <input type="text" value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="+241 XX XX XX XX" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }} placeholder="contact@exemple.com" />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700], marginBottom: '6px' }}>Pays</label>
                    <select value={formData.pays} onChange={(e) => setFormData({ ...formData, pays: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'all 0.2s', backgroundColor: 'white', cursor: 'pointer' }}>
                      {PAYS_LIST.map(pays => <option key={pays} value={pays}>{pays}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Représentants */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color={SING_COLORS.secondary.main} />
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: SING_COLORS.primary.dark, margin: 0 }}>Représentants</h3>
                  </div>
                  <button type="button" onClick={addRepresentant} style={{ padding: '8px 14px', backgroundColor: SING_COLORS.secondary.main, color: SING_COLORS.primary.dark, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                    <Plus size={16} />
                    Ajouter
                  </button>
                </div>
                {formData.representants.map((rep, index) => (
                  <div key={index} style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: SING_COLORS.secondary.main, color: SING_COLORS.primary.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{index + 1}</div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: SING_COLORS.neutral.gray[700] }}>Représentant {index + 1}</span>
                      </div>
                      {formData.representants.length > 1 && (
                        <button type="button" onClick={() => removeRepresentant(index)} style={{ padding: '6px 10px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}>Supprimer</button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <input type="text" value={rep.nom} onChange={(e) => updateRepresentant(index, 'nom', e.target.value)} placeholder="Nom complet" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }} />
                      <input type="text" value={rep.fonction || ''} onChange={(e) => updateRepresentant(index, 'fonction', e.target.value)} placeholder="Fonction / Poste" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" value={rep.tel || ''} onChange={(e) => updateRepresentant(index, 'tel', e.target.value)} placeholder="Téléphone" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }} />
                        <input type="email" value={rep.email || ''} onChange={(e) => updateRepresentant(index, 'email', e.target.value)} placeholder="Email" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }} />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: SING_COLORS.neutral.gray[600], cursor: 'pointer', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
                        <input type="checkbox" checked={rep.principal} onChange={(e) => updateRepresentant(index, 'principal', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        <span style={{ fontWeight: '500' }}>Représentant principal</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: '#fafbfc' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 24px', backgroundColor: 'white', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: SING_COLORS.neutral.gray[700], transition: 'all 0.2s' }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || !formData.nom.trim()} style={{ padding: '12px 32px', backgroundColor: saving || !formData.nom.trim() ? SING_COLORS.neutral.gray[400] : SING_COLORS.primary.main, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving || !formData.nom.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,117,141,0.3)' }}>
                {saving ? 'Enregistrement...' : editingClient ? 'Mettre à jour' : 'Créer le client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
