import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Package, FileText, ShoppingCart, 
  Truck, Receipt, BarChart3, Settings, LogOut, Menu
} from 'lucide-react';
import SingLogo from './SingLogo';
// Simili base44 pour l'instant afin d'éviter les erreurs de compilation
// import { base44 } from '@/api/base44Client';

const navItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/Dashboard' },
  { label: 'Clients', icon: Users, path: '/Clients' },
  { label: 'Prestations', icon: Package, path: '/Prestations' },
  { type: 'separator', label: 'Documents commerciaux' },
  { label: 'Devis', icon: FileText, path: '/Devis' },
  { label: 'Bons de commande', icon: ShoppingCart, path: '/Commandes' },
  { label: 'Bons de livraison', icon: Truck, path: '/Livraisons' },
  { label: 'Factures', icon: Receipt, path: '/Factures' },
  { type: 'separator', label: 'Suivi' },
  { label: 'Récapitulatif', icon: BarChart3, path: '/Recapitulatif' },
  { label: 'Paramètres', icon: Settings, path: '/Parametres' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Remplacement temporaire de la logique base44.auth.me()
    setUser({ full_name: 'Christian Rapontchombo', email: 'draketolivan@gmail.com' });
  }, []);

  const handleLogout = () => {
    // Remplacement temporaire de la logique base44.auth.logout()
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#00303C] text-white transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <SingLogo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item, i) => {
            if (item.type === 'separator') {
              return (
                <div key={i} className="mt-6 mb-2 px-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </span>
                </div>
              );
            }
            const Icon = item.icon as React.ElementType;
            const isActive = location.pathname.toLowerCase().includes(item.path!.toLowerCase());
            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#00758D]/30 text-[#DFC32F]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DFC32F]/20 flex items-center justify-center text-[#DFC32F] text-sm font-semibold">
              {user?.full_name?.[0] || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || 'Utilisateur'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || ''}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors" title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <SingLogo size="sm" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
