import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';
import { FileText, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: SING_COLORS.gradients.hero,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: SING_THEME.borderRadius.xl,
        padding: '48px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo et titre */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <FileText size={64} color={SING_COLORS.primary.main} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: SING_COLORS.primary.main,
            marginBottom: '8px',
            fontFamily: SING_THEME.fonts.heading
          }}>
            SING FacturePro
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600] }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: SING_THEME.borderRadius.md,
            color: '#dc2626',
            marginBottom: '24px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              marginBottom: '8px',
              fontWeight: 600,
              color: SING_COLORS.neutral.gray[700],
              alignItems: 'center',
              gap: '8px'
            }}>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: SING_THEME.borderRadius.md,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              marginBottom: '8px',
              fontWeight: 600,
              color: SING_COLORS.neutral.gray[700],
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={18} />
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: SING_THEME.borderRadius.md,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? SING_COLORS.neutral.gray[400] : SING_COLORS.primary.main,
              color: '#fff',
              border: 'none',
              borderRadius: SING_THEME.borderRadius.md,
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Lien inscription */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px' }}>
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              style={{
                color: SING_COLORS.primary.main,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Retour landing */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: SING_COLORS.neutral.gray[500],
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
