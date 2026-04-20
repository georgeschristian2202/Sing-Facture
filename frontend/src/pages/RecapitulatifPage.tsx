import { SING_COLORS } from '../config/colors';
import { BarChart3 } from 'lucide-react';

export default function RecapitulatifPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: SING_COLORS.primary.dark, margin: '0 0 8px 0' }}>
          Récapitulatif
        </h1>
        <p style={{ color: SING_COLORS.neutral.gray[600], margin: 0 }}>
          Vue consolidée de votre activité
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <BarChart3 size={64} color={SING_COLORS.primary.light} style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: SING_COLORS.primary.dark, marginBottom: '8px' }}>
          Module Récapitulatif
        </h2>
        <p style={{ color: SING_COLORS.neutral.gray[600] }}>
          Ce module sera bientôt disponible
        </p>
      </div>
    </div>
  );
}
