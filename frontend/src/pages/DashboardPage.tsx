import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS } from '../config/colors';
import { 
  TrendingUp, 
  AlertCircle, 
  Receipt, 
  FileText,
  ShoppingCart,
  Truck,
  BarChart3,
  Plus,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface Document {
  id: number;
  numeroDocument: string;
  type: string;
  date: string;
  clientId: number;
  montantHT: number;
  netAPayer: number;
  statut: string;
  client?: {
    nom: string;
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculs des statistiques
  const factures = documents.filter(d => d.type === 'FACTURE');
  const facturesActives = factures.filter(d => d.statut === 'VALIDE');
  const caTotal = facturesActives.reduce((sum, d) => sum + (d.netAPayer || 0), 0);
  const soldeDu = facturesActives.reduce((sum, d) => sum + (d.netAPayer || 0), 0);
  const devisCount = documents.filter(d => d.type === 'DEVIS').length;

  // Compteurs pour le flux commercial
  const workflowCounts = {
    devis: documents.filter(d => d.type === 'DEVIS').length,
    commandes: documents.filter(d => d.type === 'COMMANDE').length,
    livraisons: documents.filter(d => d.type === 'LIVRAISON').length,
    factures: documents.filter(d => d.type === 'FACTURE').length,
    recap: facturesActives.length
  };

  const formatFCFA = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, string> = {
      VALIDE: 'bg-green-100 text-green-700 border-green-200',
      BROUILLON: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      ANNULE: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[statut] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DEVIS: 'Devis',
      COMMANDE: 'Commande',
      LIVRAISON: 'Livraison',
      FACTURE: 'Facture'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `4px solid ${SING_COLORS.primary.main}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: '0 0 4px 0' }}>
          Tableau de bord
        </h1>
        <p style={{ color: SING_COLORS.neutral.gray[600], margin: 0, fontSize: '14px' }}>
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {[
          { title: "CHIFFRE D'AFFAIRES", value: formatFCFA(caTotal), icon: TrendingUp, color: SING_COLORS.primary.main },
          { title: 'SOLDE DÛ', value: formatFCFA(soldeDu), icon: AlertCircle, color: SING_COLORS.secondary.main },
          { title: 'FACTURES ACTIVES', value: facturesActives.length, icon: Receipt, color: SING_COLORS.complement.main },
          { title: 'DEVIS EN COURS', value: devisCount, icon: FileText, color: SING_COLORS.accent.main }
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '11px', 
                    color: SING_COLORS.neutral.gray[500], 
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    {kpi.title}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: 0 }}>
                    {kpi.value}
                  </p>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: `${kpi.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={kpi.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flux Commercial */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '24px' }}>
          Flux commercial
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', overflowX: 'auto' }}>
          {[
            { label: 'Devis', icon: FileText, count: workflowCounts.devis, color: SING_COLORS.primary.main },
            { label: 'Commandement', icon: ShoppingCart, count: workflowCounts.commandes, color: SING_COLORS.complement.main },
            { label: 'Livraison', icon: Truck, count: workflowCounts.livraisons, color: SING_COLORS.secondary.main },
            { label: 'Facture', icon: Receipt, count: workflowCounts.factures, color: SING_COLORS.accent.main },
            { label: 'Récap', icon: BarChart3, count: workflowCounts.recap, color: SING_COLORS.tertiary.main }
          ].map((step, index, array) => {
            const Icon = step.icon;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: `${step.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} color={step.color} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: SING_COLORS.neutral.gray[700] }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: SING_COLORS.primary.dark }}>
                    {step.count}
                  </span>
                </div>
                {index < array.length - 1 && (
                  <ArrowRight size={16} color={SING_COLORS.neutral.gray[300]} style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions Rapides + Derniers Documents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Actions Rapides */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '16px' }}>
            Actions rapides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Nouveau devis', path: '/devis', color: SING_COLORS.primary.main, bg: `${SING_COLORS.primary.main}15` },
              { label: 'Nouvelle facture', path: '/factures', color: SING_COLORS.complement.main, bg: `${SING_COLORS.complement.main}15` },
              { label: 'Nouveau client', path: '/clients', color: SING_COLORS.secondary.main, bg: `${SING_COLORS.secondary.main}15` }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: action.bg,
                  border: 'none',
                  borderRadius: '12px',
                  color: action.color,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} />
                  {action.label}
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Derniers Documents */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: SING_COLORS.primary.dark, marginBottom: '16px' }}>
            Derniers documents
          </h2>
          {documents.length === 0 ? (
            <p style={{ textAlign: 'center', color: SING_COLORS.neutral.gray[400], padding: '32px 0', fontSize: '14px' }}>
              Aucun document créé pour le moment
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500] }}>Référence</th>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500] }}>Type</th>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500] }}>Client</th>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500], textAlign: 'right' }}>Montant</th>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500] }}>Statut</th>
                    <th style={{ padding: '8px 0', fontWeight: '500', color: SING_COLORS.neutral.gray[500] }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.slice(0, 8).map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 0', color: SING_COLORS.primary.main, fontWeight: '500' }}>
                        {doc.numeroDocument}
                      </td>
                      <td style={{ padding: '12px 0', color: SING_COLORS.neutral.gray[600] }}>
                        {getTypeLabel(doc.type)}
                      </td>
                      <td style={{ padding: '12px 0', color: SING_COLORS.neutral.gray[600] }}>
                        {doc.client?.nom || '-'}
                      </td>
                      <td style={{ padding: '12px 0', color: SING_COLORS.neutral.gray[900], fontWeight: '500', textAlign: 'right' }}>
                        {formatFCFA(doc.netAPayer)}
                      </td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          border: '1px solid'
                        }} className={getStatusBadge(doc.statut)}>
                          {doc.statut}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', color: SING_COLORS.neutral.gray[400] }}>
                        {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
