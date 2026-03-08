import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SING_COLORS, SING_THEME } from '../config/colors';
import { 
  FileText, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        padding: '16px 0',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={32} color={SING_COLORS.primary.main} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.primary.main, fontFamily: SING_THEME.fonts.heading }}>
              SING FacturePro
            </span>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ color: SING_COLORS.neutral.gray[700], textDecoration: 'none', fontWeight: 500 }}>Fonctionnalités</a>
            <a href="#pricing" style={{ color: SING_COLORS.neutral.gray[700], textDecoration: 'none', fontWeight: 500 }}>Tarifs</a>
            <a href="#faq" style={{ color: SING_COLORS.neutral.gray[700], textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
            <button
              onClick={handleLogin}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                color: SING_COLORS.primary.main,
                border: `2px solid ${SING_COLORS.primary.main}`,
                borderRadius: SING_THEME.borderRadius.md,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Connexion
            </button>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '10px 24px',
                background: SING_COLORS.primary.main,
                color: '#fff',
                border: 'none',
                borderRadius: SING_THEME.borderRadius.md,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Commencer
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: `linear-gradient(135deg, ${SING_COLORS.primary.main}15 0%, ${SING_COLORS.secondary.main}15 100%)`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: SING_COLORS.neutral.gray[900],
            marginBottom: '24px',
            lineHeight: '1.2',
            fontFamily: SING_THEME.fonts.heading
          }}>
            Gérez votre facturation <br />
            <span style={{ color: SING_COLORS.primary.main }}>en toute simplicité</span>
          </h1>
          <p style={{
            fontSize: '20px',
            color: SING_COLORS.neutral.gray[600],
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            Solution complète de gestion de facturation pour les entreprises gabonaises. 
            Devis, commandes, livraisons et factures en quelques clics.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '16px 40px',
                background: SING_COLORS.primary.main,
                color: '#fff',
                border: 'none',
                borderRadius: SING_THEME.borderRadius.lg,
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: SING_THEME.shadows.lg,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              Essai gratuit 14 jours
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          {[
            { icon: <Users size={40} />, value: '500+', label: 'Entreprises clientes', color: SING_COLORS.primary.main },
            { icon: <FileText size={40} />, value: '50K+', label: 'Documents générés', color: SING_COLORS.secondary.main },
            { icon: <TrendingUp size={40} />, value: '99.9%', label: 'Disponibilité', color: SING_COLORS.accent.main },
            { icon: <Shield size={40} />, value: '100%', label: 'Sécurisé', color: SING_COLORS.complement.main }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: stat.color, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: SING_COLORS.neutral.gray[900], marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '16px', color: SING_COLORS.neutral.gray[600] }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 24px', background: SING_COLORS.neutral.gray[50] }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: SING_COLORS.neutral.gray[900] }}>
            Fonctionnalités puissantes
          </h2>
          <p style={{ textAlign: 'center', fontSize: '18px', color: SING_COLORS.neutral.gray[600], marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
            Tout ce dont vous avez besoin pour gérer votre facturation professionnellement
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            {[
              {
                icon: <FileText size={32} />,
                title: 'Documents professionnels',
                description: 'Créez des devis, bons de commande, bons de livraison et factures conformes aux normes gabonaises',
                color: SING_COLORS.primary.main
              },
              {
                icon: <Zap size={32} />,
                title: 'Numérotation automatique',
                description: 'Génération automatique des numéros de documents selon le format DEV2025/01/001',
                color: SING_COLORS.secondary.main
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Calculs automatiques',
                description: 'TPS 9.5%, CSS 1%, remises et totaux calculés automatiquement',
                color: SING_COLORS.accent.main
              },
              {
                icon: <Users size={32} />,
                title: 'Gestion clients',
                description: 'Base de données clients avec représentants et historique complet',
                color: SING_COLORS.tertiary.main
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Récapitulatif financier',
                description: 'Vue consolidée de toutes vos factures avec suivi des règlements',
                color: SING_COLORS.complement.main
              },
              {
                icon: <Shield size={32} />,
                title: 'Sécurité & Conformité',
                description: 'Données sécurisées, multi-tenant, conforme aux réglementations locales',
                color: SING_COLORS.primary.light
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: '#fff',
                padding: '32px',
                borderRadius: SING_THEME.borderRadius.lg,
                boxShadow: SING_THEME.shadows.md,
                border: `2px solid ${feature.color}`,
                transition: 'all 0.3s'
              }}>
                <div style={{ color: feature.color, marginBottom: '16px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: SING_COLORS.neutral.gray[900] }}>
                  {feature.title}
                </h3>
                <p style={{ color: SING_COLORS.neutral.gray[600], lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: SING_COLORS.neutral.gray[900] }}>
            Tarifs simples et transparents
          </h2>
          <p style={{ textAlign: 'center', fontSize: '18px', color: SING_COLORS.neutral.gray[600], marginBottom: '60px' }}>
            Choisissez le plan qui correspond à vos besoins
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              {
                name: 'Starter',
                price: '25 000',
                period: '/mois',
                features: [
                  '50 documents/mois',
                  '5 utilisateurs',
                  'Support email',
                  'Exports PDF',
                  'Gestion clients'
                ],
                color: SING_COLORS.secondary.main,
                popular: false
              },
              {
                name: 'Business',
                price: '50 000',
                period: '/mois',
                features: [
                  'Documents illimités',
                  '15 utilisateurs',
                  'Support prioritaire',
                  'Exports PDF & Excel',
                  'Récapitulatif avancé',
                  'API access'
                ],
                color: SING_COLORS.primary.main,
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Sur mesure',
                period: '',
                features: [
                  'Tout Business +',
                  'Utilisateurs illimités',
                  'Support dédié 24/7',
                  'Formation sur site',
                  'Personnalisation',
                  'SLA garanti'
                ],
                color: SING_COLORS.accent.main,
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? `${plan.color}10` : '#fff',
                padding: '40px',
                borderRadius: SING_THEME.borderRadius.lg,
                border: `3px solid ${plan.color}`,
                boxShadow: plan.popular ? SING_THEME.shadows.xl : SING_THEME.shadows.md,
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.color,
                    color: '#fff',
                    padding: '6px 20px',
                    borderRadius: SING_THEME.borderRadius.full,
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Star size={16} fill="#fff" />
                    Populaire
                  </div>
                )}
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: plan.color }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '42px', fontWeight: 'bold', color: SING_COLORS.neutral.gray[900] }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '18px', color: SING_COLORS.neutral.gray[600] }}>
                    {plan.period}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <CheckCircle2 size={20} color={plan.color} />
                      <span style={{ color: SING_COLORS.neutral.gray[700] }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: plan.popular ? plan.color : 'transparent',
                    color: plan.popular ? '#fff' : plan.color,
                    border: `2px solid ${plan.color}`,
                    borderRadius: SING_THEME.borderRadius.md,
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '80px 24px', background: SING_COLORS.neutral.gray[50] }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', marginBottom: '60px', color: SING_COLORS.neutral.gray[900] }}>
            Questions fréquentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                q: 'Comment fonctionne l\'essai gratuit ?',
                a: 'Vous bénéficiez de 14 jours d\'essai gratuit sans carte bancaire. Toutes les fonctionnalités sont disponibles.'
              },
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement.'
              },
              {
                q: 'Les données sont-elles sécurisées ?',
                a: 'Absolument. Nous utilisons un chiffrement SSL/TLS et vos données sont hébergées sur des serveurs sécurisés.'
              },
              {
                q: 'Proposez-vous une formation ?',
                a: 'Oui, nous offrons une formation complète pour tous les plans Business et Enterprise.'
              }
            ].map((faq, i) => (
              <div key={i} style={{
                background: '#fff',
                padding: '24px',
                borderRadius: SING_THEME.borderRadius.lg,
                boxShadow: SING_THEME.shadows.sm
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: SING_COLORS.neutral.gray[900] }}>
                  {faq.q}
                </h3>
                <p style={{ color: SING_COLORS.neutral.gray[600], lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${SING_COLORS.primary.main} 0%, ${SING_COLORS.accent.main} 100%)`,
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '24px' }}>
            Prêt à simplifier votre facturation ?
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
            Rejoignez des centaines d'entreprises qui font confiance à SING FacturePro
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '16px 40px',
              background: '#fff',
              color: SING_COLORS.primary.main,
              border: 'none',
              borderRadius: SING_THEME.borderRadius.lg,
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: SING_THEME.shadows.xl,
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            Commencer gratuitement
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', background: SING_COLORS.neutral.gray[900], color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <FileText size={32} color={SING_COLORS.secondary.main} />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>SING FacturePro</span>
          </div>
          <p style={{ color: SING_COLORS.neutral.gray[400], marginBottom: '16px' }}>
            Solution de facturation professionnelle pour les entreprises gabonaises
          </p>
          <p style={{ color: SING_COLORS.neutral.gray[500], fontSize: '14px' }}>
            © 2025 SING FacturePro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
