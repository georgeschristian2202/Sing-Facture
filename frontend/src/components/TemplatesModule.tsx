import React, { useState, useEffect } from 'react';
import { SING_COLORS } from '../config/colors';
import * as api from '../services/api';

const COLORS = {
  primary: SING_COLORS.primary.main,
  secondary: SING_COLORS.secondary.main,
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA'
  },
  text: {
    primary: SING_COLORS.neutral.gray[900],
    secondary: SING_COLORS.neutral.gray[600]
  },
  border: SING_COLORS.neutral.gray[300],
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B'
};

interface Template {
  id: number;
  nom: string;
  type: string;
  couleurPrimaire: string | null;
  couleurSecondaire: string | null;
  couleurTexte: string | null;
  police: string | null;
  actif: boolean;
  parDefaut: boolean;
  createdAt: string;
}

export const TemplatesModule: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    nom: '',
    type: 'DEVIS'
  });
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [filterType]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await api.getTemplates(filterType || undefined);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      alert('Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Seuls les fichiers PDF sont acceptés');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 10 MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.nom || !uploadForm.type) {
      alert('Veuillez remplir tous les champs et sélectionner un fichier');
      return;
    }

    try {
      setUploading(true);
      await api.uploadTemplate(selectedFile, uploadForm.nom, uploadForm.type);
      alert('Template uploadé avec succès !');
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadForm({ nom: '', type: 'DEVIS' });
      loadTemplates();
    } catch (error: any) {
      console.error('Error uploading template:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'upload du template');
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (templateId: number) => {
    if (!confirm('Définir ce template comme par défaut ?')) return;

    try {
      await api.setDefaultTemplate(templateId);
      alert('Template défini comme par défaut');
      loadTemplates();
    } catch (error) {
      console.error('Error setting default template:', error);
      alert('Erreur lors de la définition du template par défaut');
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      await api.updateTemplate(editingTemplate.id, {
        nom: editingTemplate.nom,
        couleurPrimaire: editingTemplate.couleurPrimaire,
        couleurSecondaire: editingTemplate.couleurSecondaire,
        couleurTexte: editingTemplate.couleurTexte,
        police: editingTemplate.police,
        actif: editingTemplate.actif
      });
      alert('Template mis à jour avec succès');
      setEditingTemplate(null);
      loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Erreur lors de la mise à jour du template');
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

    try {
      await api.deleteTemplate(templateId);
      alert('Template supprimé avec succès');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erreur lors de la suppression du template');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DEVIS: 'Devis',
      FACTURE: 'Facture',
      COMMANDE: 'Bon de Commande',
      LIVRAISON: 'Bon de Livraison'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      DEVIS: '#3B82F6',
      FACTURE: '#10B981',
      COMMANDE: '#F59E0B',
      LIVRAISON: '#8B5CF6'
    };
    return colors[type] || '#6B7280';
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: COLORS.text.secondary }}>
          Chargement des templates...
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
          <h2 style={{ margin: 0, fontSize: '24px', color: COLORS.text.primary }}>
            📄 Templates PDF
          </h2>
          <p style={{ margin: '8px 0 0 0', color: COLORS.text.secondary }}>
            Gérez vos modèles de documents personnalisés
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nouveau Template
        </button>
      </div>

      {/* Filtres */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px 16px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Tous les types</option>
          <option value="DEVIS">Devis</option>
          <option value="FACTURE">Facture</option>
          <option value="COMMANDE">Bon de Commande</option>
          <option value="LIVRAISON">Bon de Livraison</option>
        </select>
      </div>

      {/* Liste des templates */}
      {templates.length === 0 ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          backgroundColor: COLORS.background.secondary,
          borderRadius: '12px',
          border: `2px dashed ${COLORS.border}`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ margin: '0 0 8px 0', color: COLORS.text.primary }}>
            Aucun template
          </h3>
          <p style={{ margin: 0, color: COLORS.text.secondary }}>
            Uploadez votre premier template PDF pour commencer
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {templates.map(template => (
            <div
              key={template.id}
              style={{
                backgroundColor: 'white',
                border: `2px solid ${template.parDefaut ? COLORS.primary : COLORS.border}`,
                borderRadius: '12px',
                padding: '20px',
                position: 'relative'
              }}
            >
              {/* Badge par défaut */}
              {template.parDefaut && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  PAR DÉFAUT
                </div>
              )}

              {/* Type badge */}
              <div style={{
                display: 'inline-block',
                backgroundColor: getTypeBadgeColor(template.type),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                {getTypeLabel(template.type)}
              </div>

              {/* Nom */}
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: COLORS.text.primary }}>
                {template.nom}
              </h3>

              {/* Couleurs */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '8px' }}>
                  Palette de couleurs:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {template.couleurPrimaire && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: template.couleurPrimaire,
                      borderRadius: '6px',
                      border: `1px solid ${COLORS.border}`
                    }} title={`Primaire: ${template.couleurPrimaire}`} />
                  )}
                  {template.couleurSecondaire && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: template.couleurSecondaire,
                      borderRadius: '6px',
                      border: `1px solid ${COLORS.border}`
                    }} title={`Secondaire: ${template.couleurSecondaire}`} />
                  )}
                  {template.couleurTexte && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: template.couleurTexte,
                      borderRadius: '6px',
                      border: `1px solid ${COLORS.border}`
                    }} title={`Texte: ${template.couleurTexte}`} />
                  )}
                </div>
              </div>

              {/* Police */}
              {template.police && (
                <div style={{ marginBottom: '16px', fontSize: '13px', color: COLORS.text.secondary }}>
                  Police: <strong>{template.police}</strong>
                </div>
              )}

              {/* Date */}
              <div style={{ fontSize: '12px', color: COLORS.text.secondary, marginBottom: '16px' }}>
                Créé le {new Date(template.createdAt).toLocaleDateString('fr-FR')}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {!template.parDefaut && (
                  <button
                    onClick={() => handleSetDefault(template.id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: COLORS.secondary,
                      color: COLORS.text.primary,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Définir par défaut
                  </button>
                )}
                <button
                  onClick={() => setEditingTemplate(template)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: COLORS.background.secondary,
                    color: COLORS.text.primary,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: COLORS.error,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Upload */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: COLORS.text.primary }}>
              Nouveau Template PDF
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Nom du template *
              </label>
              <input
                type="text"
                value={uploadForm.nom}
                onChange={(e) => setUploadForm({ ...uploadForm, nom: e.target.value })}
                placeholder="Ex: Facture Moderne, Devis Standard..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Type de document *
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="DEVIS">Devis</option>
                <option value="FACTURE">Facture</option>
                <option value="COMMANDE">Bon de Commande</option>
                <option value="LIVRAISON">Bon de Livraison</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Fichier PDF *
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px dashed ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {selectedFile && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: COLORS.success }}>
                  ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                </div>
              )}
              <div style={{ marginTop: '8px', fontSize: '12px', color: COLORS.text.secondary }}>
                Le système analysera automatiquement les couleurs et la typographie
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadForm({ nom: '', type: 'DEVIS' });
                }}
                disabled={uploading}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: COLORS.background.secondary,
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.5 : 1
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !uploadForm.nom}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (uploading || !selectedFile || !uploadForm.nom) ? 'not-allowed' : 'pointer',
                  opacity: (uploading || !selectedFile || !uploadForm.nom) ? 0.5 : 1
                }}
              >
                {uploading ? 'Upload en cours...' : 'Uploader'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {editingTemplate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: COLORS.text.primary }}>
              Modifier le Template
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Nom
              </label>
              <input
                type="text"
                value={editingTemplate.nom}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, nom: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Couleur Primaire
              </label>
              <input
                type="color"
                value={editingTemplate.couleurPrimaire || '#003366'}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, couleurPrimaire: e.target.value })}
                style={{
                  width: '100%',
                  height: '50px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Couleur Secondaire
              </label>
              <input
                type="color"
                value={editingTemplate.couleurSecondaire || '#FDB913'}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, couleurSecondaire: e.target.value })}
                style={{
                  width: '100%',
                  height: '50px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Police
              </label>
              <input
                type="text"
                value={editingTemplate.police || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, police: e.target.value })}
                placeholder="Ex: Arial, Helvetica, Times New Roman..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setEditingTemplate(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: COLORS.background.secondary,
                  color: COLORS.text.primary,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateTemplate}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
