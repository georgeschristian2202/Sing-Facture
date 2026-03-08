import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';
import { 
  FileText, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  MapPin, 
  FileCheck,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Données utilisateur
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Données entreprise
    companyName: '',
    companyEmail: '',
    telephone: '',
    adresse: '',
    rccm: '',
    capital: '',
    plan: 'STARTER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.nom || !formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName) {
      setError('Le nom de l\'entreprise est requis');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5005/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          companyEmail: formData.companyEmail || formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse,
          rccm: formData.rccm,
          capital: formData.capital,
          plan: formData.plan
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      api.setToken(data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
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
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo et titre */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: SING_COLORS.primary.main,
            marginBottom: '8px',
            fontFamily: SING_THEME.fonts.heading
          }}>
            Créer votre compte
          </h1>
          <p style={{ color: SING_COLORS.neutral.gray[600] }}>
            Étape {step} sur 2 - {step === 1 ? 'Informations personnelles' : 'Informations entreprise'}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '4px',
          background: SING_COLORS.neutral.gray[200],
          borderRadius: '2px',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: SING_COLORS.primary.main,
            width: `${(step / 2) * 100}%`,
            transition: 'width 0.3s'
          }} />
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
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Étape 1 - Informations personnelles */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Nom complet <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Jean Dupont"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Mot de passe <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 caractères"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Confirmer le mot de passe <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Retapez votre mot de passe"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: SING_COLORS.primary.main,
                color: '#fff',
                border: 'none',
                borderRadius: SING_THEME.borderRadius.md,
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Continuer →
            </button>
          </form>
        )}

        {/* Étape 2 - Informations entreprise */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Nom de l'entreprise <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ex: SING S.A."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Email entreprise
              </label>
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                placeholder="contact@entreprise.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <small style={{ color: SING_COLORS.neutral.gray[500], fontSize: '12px' }}>
                Laissez vide pour utiliser votre email personnel
              </small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+241 XX XX XX XX"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Adresse
              </label>
              <textarea
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                placeholder="Adresse complète de l'entreprise"
                rows={2}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: SING_COLORS.neutral.gray[700]
                }}>
                  RCCM
                </label>
                <input
                  type="text"
                  value={formData.rccm}
                  onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                  placeholder="Ex: GA-LBV-01-2024-XXX"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: SING_COLORS.neutral.gray[700]
                }}>
                  Capital
                </label>
                <input
                  type="text"
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  placeholder="Ex: 10 000 000 FCFA"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: SING_COLORS.neutral.gray[700]
              }}>
                Plan <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = SING_COLORS.primary.main}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="STARTER">Starter - 25 000 FCFA/mois</option>
                <option value="BUSINESS">Business - 50 000 FCFA/mois</option>
                <option value="ENTERPRISE">Enterprise - Sur mesure</option>
              </select>
              <small style={{ color: SING_COLORS.neutral.gray[500], fontSize: '12px' }}>
                14 jours d'essai gratuit, sans carte bancaire
              </small>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'transparent',
                  color: SING_COLORS.neutral.gray[600],
                  border: '2px solid #e5e7eb',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: loading ? SING_COLORS.neutral.gray[400] : SING_COLORS.primary.main,
                  color: '#fff',
                  border: 'none',
                  borderRadius: SING_THEME.borderRadius.md,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        )}

        {/* Lien connexion */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: SING_COLORS.neutral.gray[600], fontSize: '14px' }}>
            Vous avez déjà un compte ?{' '}
            <Link
              to="/login"
              style={{
                color: SING_COLORS.primary.main,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Se connecter
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
              textDecoration: 'none'
            }}
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
