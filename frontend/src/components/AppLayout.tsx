import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS } from '../config/colors';
import {
  LayoutDashboard,
  FileText,
  Package,
  Truck,
  Receipt,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart
} from 'lucide-react';

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

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: SING_COLORS.background.main 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: `4px solid ${SING_COLORS.primary.main}`, 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: SING_COLORS.neutral.gray[600] }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: '#004d40',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '76px'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: SING_COLORS.secondary.main,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#004d40',
                flexShrink: 0
              }}>
                S
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: 'white', whiteSpace: 'nowrap' }}>
                  SING-Facturation
                </h1>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.organisation.nom}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Principal */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'hidden' }}>
          {/* Dashboard */}
          {sidebarOpen && (
            <div style={{ padding: '16px 20px 8px 20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                PRINCIPAL
              </p>
            </div>
          )}
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              margin: sidebarOpen ? '0 12px' : '0 8px',
              color: location.pathname === '/dashboard' ? '#004d40' : 'rgba(255,255,255,0.9)',
              backgroundColor: location.pathname === '/dashboard' ? SING_COLORS.secondary.main : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === '/dashboard' ? '600' : '400',
              whiteSpace: 'nowrap',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/dashboard') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/dashboard') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Tableau de bord</span>}
          </Link>

          {/* Clients */}
          {sidebarOpen && (
            <div style={{ padding: '16px 20px 8px 20px', marginTop: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                GESTION
              </p>
            </div>
          )}
          <Link
            to="/clients"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              margin: sidebarOpen ? '0 12px 4px 12px' : '0 8px 4px 8px',
              color: location.pathname === '/clients' ? '#004d40' : 'rgba(255,255,255,0.9)',
              backgroundColor: location.pathname === '/clients' ? SING_COLORS.secondary.main : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === '/clients' ? '600' : '400',
              whiteSpace: 'nowrap',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/clients') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/clients') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Users size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Clients</span>}
          </Link>
          <Link
            to="/produits"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              margin: sidebarOpen ? '0 12px' : '0 8px',
              color: location.pathname === '/produits' ? '#004d40' : 'rgba(255,255,255,0.9)',
              backgroundColor: location.pathname === '/produits' ? SING_COLORS.secondary.main : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === '/produits' ? '600' : '400',
              whiteSpace: 'nowrap',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/produits') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/produits') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Package size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Prestations</span>}
          </Link>

          {/* Documents Commerciaux */}
          {sidebarOpen && (
            <div style={{ padding: '16px 20px 8px 20px', marginTop: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                DOCUMENTS COMMERCIAUX
              </p>
            </div>
          )}
          {[
            { path: '/devis', icon: FileText, label: 'Devis' },
            { path: '/commandes', icon: ShoppingCart, label: 'Bons de commande' },
            { path: '/livraisons', icon: Truck, label: 'Bons de livraison' },
            { path: '/factures', icon: Receipt, label: 'Factures' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 20px',
                  margin: sidebarOpen ? '0 12px 4px 12px' : '0 8px 4px 8px',
                  color: isActive ? '#004d40' : 'rgba(255,255,255,0.9)',
                  backgroundColor: isActive ? SING_COLORS.secondary.main : 'transparent',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  whiteSpace: 'nowrap',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Suivi */}
          {sidebarOpen && (
            <div style={{ padding: '16px 20px 8px 20px', marginTop: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                SUIVI
              </p>
            </div>
          )}
          <Link
            to="/recapitulatif"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              margin: sidebarOpen ? '0 12px 4px 12px' : '0 8px 4px 8px',
              color: location.pathname === '/recapitulatif' ? '#004d40' : 'rgba(255,255,255,0.9)',
              backgroundColor: location.pathname === '/recapitulatif' ? SING_COLORS.secondary.main : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === '/recapitulatif' ? '600' : '400',
              whiteSpace: 'nowrap',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/recapitulatif') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/recapitulatif') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <BarChart3 size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Récapitulatif</span>}
          </Link>
          <Link
            to="/parametres"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              margin: sidebarOpen ? '0 12px' : '0 8px',
              color: location.pathname === '/parametres' ? '#004d40' : 'rgba(255,255,255,0.9)',
              backgroundColor: location.pathname === '/parametres' ? SING_COLORS.secondary.main : 'transparent',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === '/parametres' ? '600' : '400',
              whiteSpace: 'nowrap',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/parametres') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/parametres') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Settings size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Paramètres</span>}
          </Link>
        </nav>

        {/* User Info */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: 'auto'
        }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: SING_COLORS.secondary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#004d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {user?.nom.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>
                    {user?.nom}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <Outlet />
      </main>
    </div>
  );
}
