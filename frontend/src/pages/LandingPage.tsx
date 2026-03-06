import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
          SING FacturePro
        </h1>
        <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '40px' }}>
          Gestion commerciale complète pour votre entreprise
        </p>
        <Link 
          to="/dashboard"
          style={{
            display: 'inline-block',
            padding: '15px 40px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Accéder au Dashboard →
        </Link>
      </div>
    </div>
  );
}
