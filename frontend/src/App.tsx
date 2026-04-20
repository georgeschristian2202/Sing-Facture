import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import DevisPage from './pages/DevisPage';
import CommandesPage from './pages/CommandesPage';
import LivraisonsPage from './pages/LivraisonsPage';
import FacturesPage from './pages/FacturesPage';
import RecapitulatifPage from './pages/RecapitulatifPage';
import ClientsPage from './pages/ClientsPage';
import ProduitsPage from './pages/ProduitsPage';
import ParametresPage from './pages/ParametresPage';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="devis" element={<DevisPage />} />
        <Route path="commandes" element={<CommandesPage />} />
        <Route path="livraisons" element={<LivraisonsPage />} />
        <Route path="factures" element={<FacturesPage />} />
        <Route path="recapitulatif" element={<RecapitulatifPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="produits" element={<ProduitsPage />} />
        <Route path="parametres" element={<ParametresPage />} />
      </Route>

      {/* Redirect to dashboard if authenticated */}
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

export default App;
