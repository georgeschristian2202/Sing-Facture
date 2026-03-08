import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';

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
  _count?: { documents: number };
}

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

  useEffect(() => {
    loadClients();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filtrer les représentants vides
      const representantsValides = formData.representants.filter(r => r.nom.trim() !== '');
      
      const clientData = {
        ...formData,
        representants: representantsValides
      };

      if (editingClient) {
        await api.updateClient(editingClient.id, clientData);
      } else {
        await api.createClient(clientData);
      }
      setShowModal(false);
      setEditingClient(null);
      resetForm();
      loadClients();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      adresse: '',
      tel: '',
      email: '',
      pays: 'Gabon',
      representants: [{ nom: '', fonction: '', tel: '', email: '', principal: true }]
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom,
      adresse: client.adresse || '',
      tel: client.tel || '',
      email: client.email || '',
      pays: client.pays,
      representants: client.representants && client.representants.length > 0
        ? client.representants
        : [{ nom: '', fonction: '', tel: '', email: '', principal: true }]
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client et tous ses représentants ?')) return;
    
    try {
      await api.deleteClient(id);
      loadClients();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const addRepresentant = () => {
    setFormData({
      ...formData,
      representants: [...formData.representants, { nom: '', fonction: '', tel: '', email: '', principal: false }]
    });
  };

  const removeRepresentant = (index: number) => {
    const newReps = formData.representants.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      representants: newReps.length > 0 ? newReps : [{ nom: '', fonction: '', tel: '', email: '', principal: true }]
    });
  };

  const updateRepresentant = (index: number, field: keyof Representant, value: any) => {
    const newReps = [...formData.representants];
    newReps[index] = { ...newReps[index], [field]: value };
    
    // Si on marque un représentant comme principal, démarquer les autres
    if (field === 'principal' && value === true) {
      newReps.forEach((rep, i) => {
        if (i !== index) rep.principal = false;
      });
    }
    
    setFormData({ ...formData, representants: newReps });
  };

  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tel?.includes(searchTerm) ||
    c.representants?.some(r => 
      r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {/* Header avec actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Rechercher un client ou représentant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
              borderRadius: SING_THEME.borderRadius.md,
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
            onBlur={(e) => e.target.style.borderColor = SING_COLORS.neutral.gray[300]}
          />
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
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
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nouveau Client
        </button>
      </div>

      {/* Liste des clients */}
      <div style={{ background: '#fff', borderRadius: SING_THEME.borderRadius.lg, overflow: 'hidden', boxShadow: SING_THEME.shadows.sm }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: SING_COLORS.neutral.gray[100], borderBottom: `2px solid ${SING_COLORS.primary.main}` }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Organisation</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Représentant Principal</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Contact</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Pays</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Documents</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: SING_COLORS.neutral.gray[500] }}>
                  {searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré'}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const repPrincipal = client.representants?.find(r => r.principal) || client.representants?.[0];
                return (
                  <tr key={client.id} style={{ borderBottom: `1px solid ${SING_COLORS.neutral.gray[200]}` }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: SING_COLORS.neutral.gray[900], marginBottom: '4px' }}>
                        {client.nom}
                      </div>
                      {client.adresse && (
                        <div style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>
                          📍 {client.adresse}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {repPrincipal ? (
                        <div>
                          <div style={{ fontWeight: 500, color: SING_COLORS.neutral.gray[800] }}>
                            {repPrincipal.nom}
                          </div>
                          {repPrincipal.fonction && (
                            <div style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>
                              {repPrincipal.fonction}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: SING_COLORS.neutral.gray[400] }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {repPrincipal ? (
                        <div style={{ fontSize: '13px' }}>
                          {repPrincipal.tel && (
                            <div style={{ color: SING_COLORS.neutral.gray[700], marginBottom: '2px' }}>
                              📞 {repPrincipal.tel}
                            </div>
                          )}
                          {repPrincipal.email && (
                            <div style={{ color: SING_COLORS.neutral.gray[700] }}>
                              ✉️ {repPrincipal.email}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: '13px' }}>
                          {client.tel && <div style={{ color: SING_COLORS.neutral.gray[700] }}>📞 {client.tel}</div>}
                          {client.email && <div style={{ color: SING_COLORS.neutral.gray[700] }}>✉️ {client.email}</div>}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: SING_COLORS.neutral.gray[700] }}>{client.pays}</td>
                    <td style={{ padding: '16px', textAlign: 'center', color: SING_COLORS.neutral.gray[700] }}>
                      {client._count?.documents || 0}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(client)}
                        style={{
                          padding: '6px 12px',
                          background: SING_COLORS.accent.main,
                          color: '#fff',
                          border: 'none',
                          borderRadius: SING_THEME.borderRadius.sm,
                          cursor: 'pointer',
                          marginRight: '8px',
                          fontSize: '12px'
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        style={{
                          padding: '6px 12px',
                          background: SING_COLORS.status.error,
                          color: '#fff',
                          border: 'none',
                          borderRadius: SING_THEME.borderRadius.sm,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })
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
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: SING_COLORS.primary.main }}>
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Informations Organisation */}
              <div style={{ marginBottom: '24px', padding: '16px', background: SING_COLORS.neutral.gray[50], borderRadius: SING_THEME.borderRadius.md }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: SING_COLORS.neutral.gray[800] }}>
                  📋 Informations Organisation
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                    Nom de l'organisation <span style={{ color: SING_COLORS.status.error }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: SING SARL"
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                    Adresse
                  </label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    rows={2}
                    placeholder="Adresse complète de l'organisation"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                      borderRadius: SING_THEME.borderRadius.md,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                      Téléphone général
                    </label>
                    <input
                      type="tel"
                      value={formData.tel}
                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                      placeholder="Standard téléphonique"
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
                      Email général
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@organisation.com"
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

                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
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

              {/* Représentants */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: SING_COLORS.neutral.gray[800] }}>
                    👤 Représentants / Personnes de contact
                  </h3>
                  <button
                    type="button"
                    onClick={addRepresentant}
                    style={{
                      padding: '6px 12px',
                      background: SING_COLORS.secondary.main,
                      color: SING_COLORS.neutral.gray[900],
                      border: 'none',
                      borderRadius: SING_THEME.borderRadius.md,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Ajouter un représentant
                  </button>
                </div>

                {formData.representants.map((rep, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: rep.principal ? `${SING_COLORS.secondary.main}15` : SING_COLORS.neutral.gray[50],
                    border: `2px solid ${rep.principal ? SING_COLORS.secondary.main : SING_COLORS.neutral.gray[200]}`,
                    borderRadius: SING_THEME.borderRadius.md,
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: SING_COLORS.neutral.gray[700] }}>
                          Représentant {index + 1}
                        </span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={rep.principal}
                            onChange={(e) => updateRepresentant(index, 'principal', e.target.checked)}
                          />
                          <span style={{ color: SING_COLORS.neutral.gray[700] }}>Principal</span>
                        </label>
                      </div>
                      {formData.representants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRepresentant(index)}
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
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: SING_COLORS.neutral.gray[700] }}>
                          Nom complet {index === 0 && <span style={{ color: SING_COLORS.status.error }}>*</span>}
                        </label>
                        <input
                          type="text"
                          required={index === 0}
                          value={rep.nom}
                          onChange={(e) => updateRepresentant(index, 'nom', e.target.value)}
                          placeholder="Nom et prénom"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                            borderRadius: SING_THEME.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: SING_COLORS.neutral.gray[700] }}>
                          Fonction
                        </label>
                        <input
                          type="text"
                          value={rep.fonction || ''}
                          onChange={(e) => updateRepresentant(index, 'fonction', e.target.value)}
                          placeholder="Ex: Directeur, Responsable"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                            borderRadius: SING_THEME.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: SING_COLORS.neutral.gray[700] }}>
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={rep.tel || ''}
                          onChange={(e) => updateRepresentant(index, 'tel', e.target.value)}
                          placeholder="Téléphone direct"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                            borderRadius: SING_THEME.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: SING_COLORS.neutral.gray[700] }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={rep.email || ''}
                          onChange={(e) => updateRepresentant(index, 'email', e.target.value)}
                          placeholder="Email direct"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: `2px solid ${SING_COLORS.neutral.gray[300]}`,
                            borderRadius: SING_THEME.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
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
                  {editingClient ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
