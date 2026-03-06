import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Stats {
  factures_actives: number;
  factures_payees: number;
  factures_annulees: number;
  ca_actif: number;
  solde_du_total: number;
  ca_paye: number;
}

interface Client {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  code: string;
  label: string;
  prix: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, clientsData, produitsData] = await Promise.all([
        api.getStats(),
        api.getClients(),
        api.getProduits({ actif: true })
      ]);

      setStats(statsData);
      setClients(clientsData);
      setProduits(produitsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(Math.round(value)) + ' FCFA';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '20px', color: '#6b7280' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>
          Tableau de bord
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>
          Bienvenue dans votre gestion commerciale — SING S.A., Libreville, Gabon
        </p>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧾</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Factures actives</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {stats?.factures_actives || 0}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Chiffre d'affaires actif</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#065f46' }}>
              {formatCurrency(stats?.ca_actif)}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Clients</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {clients.length}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Produits actifs</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {produits.length}
            </div>
          </div>
        </div>

        {/* Clients récents */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
            Clients récents
          </h2>
          {clients.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              Aucun client enregistré
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{client.nom}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produits */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
            Catalogue produits ({produits.length})
          </h2>
          {produits.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              Aucun produit enregistré
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {produits.slice(0, 5).map((produit) => (
                <div key={produit.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#1a56db', marginRight: '10px' }}>{produit.code}</span>
                    <span style={{ color: '#374151' }}>{produit.label}</span>
                  </div>
                  <div style={{ fontWeight: '600', color: '#065f46' }}>
                    {formatCurrency(produit.prix)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
