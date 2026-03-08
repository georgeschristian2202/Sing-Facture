import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardNew from './pages/DashboardNew';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated() ? <DashboardNew /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/dashboard-old" 
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;
