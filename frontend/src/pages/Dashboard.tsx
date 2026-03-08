import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';

interface Stats {
  factures_actives: number;
  factures_payees: number;
  factures_annulees: number;
  ca_actif: number;
  solde_du_total: number;
  ca_paye: number;
}

interface Client {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  code: string;
  label: string;
  prix: number;
}

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
  organisation: {
    id: number;
    nom: string;
    email: string;
    telephone: string | null;
    plan: string;
    actif: boolean;
    dateExpiration: string | null;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, clientsData, produitsData, userData] = await Promise.all([
        api.getStats(),
        api.getClients(),
        api.getProduits({ actif: true }),
        api.getCurrentUser()
      ]);

      setStats(statsData);
      setClients(clientsData);
      setProduits(produitsData);
      setUser(userData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Si erreur d'authentification, rediriger vers login
      if (error instanceof Error && error.message.includes('Token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(Math.round(value)) + ' FCFA';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: SING_COLORS.neutral.gray[100], 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '20px', color: SING_COLORS.primary.main }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: SING_COLORS.neutral.gray[100] }}>
      {/* Header avec navigation */}
      <header style={{
        background: '#fff',
        borderBottom: `2px solid ${SING_COLORS.primary.main}`,
        padding: '16px 24px',
        boxShadow: SING_THEME.shadows.sm
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>🧾</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: SING_COLORS.primary.main }}>
                {user?.organisation.nom || 'SING FacturePro'}
              </div>
              <div style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>
                Plan {user?.organisation.plan} • {user?.nom}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: SING_COLORS.primary.main,
              border: `2px solid ${SING_COLORS.primary.main}`,
              borderRadius: SING_THEME.borderRadius.md,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = SING_COLORS.primary.main;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = SING_COLORS.primary.main;
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec bande SING */}
        <div style={{
          background: SING_COLORS.gradients.primary,
          borderRadius: SING_THEME.borderRadius.lg,
          padding: '30px',
          marginBottom: '40px',
          color: '#fff'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            Tableau de bord
          </h1>
          <p style={{ opacity: 0.95 }}>
            Bienvenue {user?.nom} — {user?.organisation.nom}
          </p>
          {user?.organisation.dateExpiration && (
            <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
              ⏰ Période d'essai jusqu'au {new Date(user.organisation.dateExpiration).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
        
        {/* KPIs avec couleurs SING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ 
            background: '#fff', 
            border: `2px solid ${SING_COLORS.primary.main}`, 
            borderRadius: SING_THEME.borderRadius.lg, 
            padding: '24px',
            boxShadow: SING_THEME.shadows.md
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧾</div>
            <div style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px', marginBottom: '8px' }}>Factures actives</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.primary.main }}>
              {stats?.factures_actives || 0}
            </div>
          </div>

          <div style={{ 
            background: '#fff', 
            border: `2px solid ${SING_COLORS.secondary.main}`, 
            borderRadius: SING_THEME.borderRadius.lg, 
            padding: '24px',
            boxShadow: SING_THEME.shadows.md
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
            <div style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px', marginBottom: '8px' }}>Chiffre d'affaires actif</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: SING_COLORS.tertiary.main }}>
              {formatCurrency(stats?.ca_actif)}
            </div>
          </div>

          <div style={{ 
            background: '#fff', 
            border: `2px solid ${SING_COLORS.accent.main}`, 
            borderRadius: SING_THEME.borderRadius.lg, 
            padding: '24px',
            boxShadow: SING_THEME.shadows.md
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <div style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px', marginBottom: '8px' }}>Clients</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.accent.main }}>
              {clients.length}
            </div>
          </div>

          <div style={{ 
            background: '#fff', 
            border: `2px solid ${SING_COLORS.complement.main}`, 
            borderRadius: SING_THEME.borderRadius.lg, 
            padding: '24px',
            boxShadow: SING_THEME.shadows.md
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
            <div style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px', marginBottom: '8px' }}>Produits actifs</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.complement.main }}>
              {produits.length}
            </div>
          </div>
        </div>

        {/* Clients récents avec couleurs SING */}
        <div style={{ 
          background: '#fff', 
          border: `1px solid ${SING_COLORS.neutral.gray[300]}`, 
          borderRadius: SING_THEME.borderRadius.lg, 
          padding: '24px', 
          marginBottom: '20px',
          boxShadow: SING_THEME.shadows.sm
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: SING_COLORS.primary.main,
            borderBottom: `2px solid ${SING_COLORS.primary.main}`,
            paddingBottom: '10px'
          }}>
            Clients récents
          </h2>
          {clients.length === 0 ? (
            <p style={{ color: SING_COLORS.neutral.gray[600], textAlign: 'center', padding: '20px' }}>
              Aucun client enregistré
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} style={{ 
                  padding: '12px', 
                  background: SING_COLORS.neutral.gray[100], 
                  borderRadius: SING_THEME.borderRadius.md,
                  borderLeft: `4px solid ${SING_COLORS.accent.main}`
                }}>
                  <div style={{ fontWeight: '600', color: SING_COLORS.neutral.black }}>{client.nom}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produits avec couleurs SING */}
        <div style={{ 
          background: '#fff', 
          border: `1px solid ${SING_COLORS.neutral.gray[300]}`, 
          borderRadius: SING_THEME.borderRadius.lg, 
          padding: '24px',
          boxShadow: SING_THEME.shadows.sm
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px', 
            color: SING_COLORS.primary.main,
            borderBottom: `2px solid ${SING_COLORS.primary.main}`,
            paddingBottom: '10px'
          }}>
            Catalogue produits ({produits.length})
          </h2>
          {produits.length === 0 ? (
            <p style={{ color: SING_COLORS.neutral.gray[600], textAlign: 'center', padding: '20px' }}>
              Aucun produit enregistré
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {produits.slice(0, 5).map((produit) => (
                <div key={produit.id} style={{ 
                  padding: '12px', 
                  background: SING_COLORS.neutral.gray[100], 
                  borderRadius: SING_THEME.borderRadius.md, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderLeft: `4px solid ${SING_COLORS.secondary.main}`
                }}>
                  <div>
                    <span style={{ fontWeight: '600', color: SING_COLORS.accent.main, marginRight: '10px' }}>{produit.code}</span>
                    <span style={{ color: SING_COLORS.neutral.gray[700] }}>{produit.label}</span>
                  </div>
                  <div style={{ fontWeight: '600', color: SING_COLORS.tertiary.main }}>
                    {formatCurrency(produit.prix)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
