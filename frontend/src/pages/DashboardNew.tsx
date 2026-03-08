import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';
import ClientsModule from '../components/ClientsModule';
import ProduitsModule from '../components/ProduitsModule';
import {
  LayoutDashboard,
  FileText,
  Package,
  Truck,
  Receipt,
  BarChart3,
  Users,
  Tag,
  Settings,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  LogOut,
  User as UserIcon
} from 'lucide-react';

// Types
interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  organisation: {
    nom: string;
    plan: string;
  };
}

interface Stats {
  totalDocuments: number;
  totalClients: number;
  totalProduits: number;
  caTotal: number;
  caActif: number;
  soldeDu: number;
}

type MenuItem = 'dashboard' | 'devis' | 'commandes' | 'livraisons' | 'factures' | 'recap' | 'clients' | 'produits' | 'parametres';

export default function DashboardNew() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      // TODO: Charger les stats
      setStats({
        totalDocuments: 0,
        totalClients: 0,
        totalProduits: 0,
        caTotal: 0,
        caActif: 0,
        soldeDu: 0
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard' as MenuItem, icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: SING_COLORS.primary.main },
    { id: 'devis' as MenuItem, icon: <FileText size={20} />, label: 'Devis', color: SING_COLORS.secondary.main },
    { id: 'commandes' as MenuItem, icon: <Package size={20} />, label: 'Commandes', color: SING_COLORS.accent.main },
    { id: 'livraisons' as MenuItem, icon: <Truck size={20} />, label: 'Livraisons', color: SING_COLORS.tertiary.main },
    { id: 'factures' as MenuItem, icon: <Receipt size={20} />, label: 'Factures', color: SING_COLORS.complement.main },
    { id: 'recap' as MenuItem, icon: <BarChart3 size={20} />, label: 'Récapitulatif', color: SING_COLORS.primary.light },
    { id: 'clients' as MenuItem, icon: <Users size={20} />, label: 'Clients', color: SING_COLORS.secondary.light },
    { id: 'produits' as MenuItem, icon: <Tag size={20} />, label: 'Produits', color: SING_COLORS.accent.light },
    { id: 'parametres' as MenuItem, icon: <Settings size={20} />, label: 'Paramètres', color: SING_COLORS.neutral.gray[600] }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '20px', color: SING_COLORS.primary.main }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: SING_COLORS.neutral.gray[100], display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderRight: `1px solid ${SING_COLORS.neutral.gray[300]}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo et Entreprise */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${SING_COLORS.neutral.gray[200]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Receipt size={32} color={SING_COLORS.primary.main} />
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: SING_COLORS.primary.main }}>
              SING FacturePro
            </div>
          </div>
          <div style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>
            {user?.organisation.nom}
          </div>
          <div style={{ fontSize: '11px', color: SING_COLORS.neutral.gray[500], marginTop: '4px' }}>
            Plan {user?.organisation.plan}
          </div>
        </div>

        {/* Menu Navigation */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: activeMenu === item.id ? `${item.color}15` : 'transparent',
                border: 'none',
                borderLeft: activeMenu === item.id ? `4px solid ${item.color}` : '4px solid transparent',
                color: activeMenu === item.id ? item.color : SING_COLORS.neutral.gray[700],
                fontSize: '14px',
                fontWeight: activeMenu === item.id ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = `${SING_COLORS.neutral.gray[100]}`;
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: '16px', borderTop: `1px solid ${SING_COLORS.neutral.gray[200]}` }}>
          <div style={{ fontSize: '13px', color: SING_COLORS.neutral.gray[700], marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserIcon size={16} />
            {user?.nom}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: `1px solid ${SING_COLORS.neutral.gray[300]}`,
              borderRadius: SING_THEME.borderRadius.md,
              color: SING_COLORS.neutral.gray[700],
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = SING_COLORS.neutral.gray[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '24px' }}>
        {/* Header */}
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: SING_COLORS.neutral.gray[900], marginBottom: '8px' }}>
            {menuItems.find(m => m.id === activeMenu)?.label}
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600] }}>
            Gestion complète de votre facturation
          </p>
        </header>

        {/* Content Area */}
        <div>
          {activeMenu === 'dashboard' && <DashboardHome stats={stats} />}
          {activeMenu === 'devis' && <DevisModule />}
          {activeMenu === 'commandes' && <CommandesModule />}
          {activeMenu === 'livraisons' && <LivraisonsModule />}
          {activeMenu === 'factures' && <FacturesModule />}
          {activeMenu === 'recap' && <RecapModule />}
          {activeMenu === 'clients' && <ClientsModule />}
          {activeMenu === 'produits' && <ProduitsModule />}
          {activeMenu === 'parametres' && <ParametresModule />}
        </div>
      </main>
    </div>
  );
}

// ============================================
// COMPOSANTS DES MODULES
// ============================================

function DashboardHome({ stats }: { stats: Stats | null }) {
  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'CA Total', value: stats?.caTotal || 0, icon: <DollarSign size={32} />, color: SING_COLORS.primary.main, format: 'currency' },
          { label: 'CA Actif', value: stats?.caActif || 0, icon: <TrendingUp size={32} />, color: SING_COLORS.secondary.main, format: 'currency' },
          { label: 'Solde Dû', value: stats?.soldeDu || 0, icon: <AlertTriangle size={32} />, color: SING_COLORS.accent.main, format: 'currency' },
          { label: 'Documents', value: stats?.totalDocuments || 0, icon: <FileCheck size={32} />, color: SING_COLORS.tertiary.main, format: 'number' },
          { label: 'Clients', value: stats?.totalClients || 0, icon: <Users size={32} />, color: SING_COLORS.complement.main, format: 'number' },
          { label: 'Produits', value: stats?.totalProduits || 0, icon: <Tag size={32} />, color: SING_COLORS.primary.light, format: 'number' }
        ].map((kpi, i) => (
          <div key={i} style={{
            background: '#fff',
            padding: '24px',
            borderRadius: SING_THEME.borderRadius.lg,
            border: `2px solid ${kpi.color}`,
            boxShadow: SING_THEME.shadows.sm
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
              <div style={{ fontSize: '12px', color: SING_COLORS.neutral.gray[600] }}>{kpi.label}</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: kpi.color }}>
              {kpi.format === 'currency' 
                ? new Intl.NumberFormat('fr-FR').format(kpi.value) + ' FCFA'
                : kpi.value
              }
            </div>
          </div>
        ))}
      </div>

      {/* Actions Rapides */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg, boxShadow: SING_THEME.shadows.sm }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: SING_COLORS.neutral.gray[900] }}>
          Actions Rapides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Nouveau Devis', icon: <FileText size={24} />, color: SING_COLORS.secondary.main },
            { label: 'Nouvelle Commande', icon: <Package size={24} />, color: SING_COLORS.accent.main },
            { label: 'Nouvelle Facture', icon: <Receipt size={24} />, color: SING_COLORS.complement.main },
            { label: 'Nouveau Client', icon: <UserIcon size={24} />, color: SING_COLORS.primary.main }
          ].map((action, i) => (
            <button key={i} style={{
              padding: '16px',
              background: `${action.color}10`,
              border: `2px solid ${action.color}`,
              borderRadius: SING_THEME.borderRadius.md,
              color: action.color,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = action.color;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${action.color}10`;
              e.currentTarget.style.color = action.color;
            }}>
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Modules placeholder - à implémenter
function DevisModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Module Devis</h2>
    <p>Liste et gestion des devis - En développement</p>
  </div>;
}

function CommandesModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Module Commandes</h2>
    <p>Liste et gestion des bons de commande - En développement</p>
  </div>;
}

function LivraisonsModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Module Livraisons</h2>
    <p>Liste et gestion des bons de livraison - En développement</p>
  </div>;
}

function FacturesModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Module Factures</h2>
    <p>Liste et gestion des factures - En développement</p>
  </div>;
}

function RecapModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Récapitulatif</h2>
    <p>Vue consolidée des factures - En développement</p>
  </div>;
}

// ClientsModule and ProduitsModule are now imported from components folder

function ParametresModule() {
  return <div style={{ background: '#fff', padding: '24px', borderRadius: SING_THEME.borderRadius.lg }}>
    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Paramètres</h2>
    <p>Configuration de l'application - En développement</p>
  </div>;
}
