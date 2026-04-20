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
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Partie gauche - Formulaire */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: '#fff',
        overflowY: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px'
        }}>
          {/* Logo et titre */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FileText size={48} color={SING_COLORS.primary.main} />
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: SING_COLORS.primary.main,
                fontFamily: SING_THEME.fonts.heading,
                margin: 0
              }}>
                SING FacturePro
              </h1>
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: SING_COLORS.neutral.gray[800],
              marginBottom: '8px'
            }}>
              Bienvenue
            </h2>
            <p style={{ color: SING_COLORS.neutral.gray[600], fontSize: '16px' }}>
              Connectez-vous pour accéder à votre espace
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

      {/* Partie droite - Image de couverture */}
      <div style={{
        flex: '1',
        background: SING_COLORS.gradients.hero,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Overlay décoratif */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          backdropFilter: 'blur(100px)'
        }} />
        
        {/* Contenu */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: '#fff'
        }}>
          <FileText size={120} color="#fff" style={{ marginBottom: '32px', opacity: 0.9 }} />
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px',
            fontFamily: SING_THEME.fonts.heading
          }}>
            Gestion de Facturation
          </h2>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '400px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Simplifiez la gestion de vos devis, commandes, livraisons et factures en un seul endroit
          </p>
          
          {/* Éléments décoratifs */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 24px',
              borderRadius: SING_THEME.borderRadius.lg,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>100%</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Sécurisé</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 24px',
              borderRadius: SING_THEME.borderRadius.lg,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>24/7</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Disponible</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 24px',
              borderRadius: SING_THEME.borderRadius.lg,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>∞</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Documents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
