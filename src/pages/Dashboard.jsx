import { useState } from "react";

const COLORS = {
  primary: "#1a56db",
  primaryDark: "#1e429f",
  secondary: "#0e9f6e",
  danger: "#e02424",
  warning: "#c27803",
  bg: "#f9fafb",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  muted: "#6b7280",
};

const SERVICES = {
  "SING Logiciels": ["Assistance Technique elab", "Développement informatique", "Service Cloud", "Gestion Messagerie", "Autres logiciels"],
  "SING Conseil": ["Innovation Day", "Retraite d'Innovation Stratégique", "Entreprise en Mode Startup", "Cellule d'Efficience Opérationnelle", "Assistance Maîtrise Ouvrage", "Autres conseil"],
  "Incubateur": ["Mise à disposition de salle", "Mise à disposition Bureaux", "Mise à Disposition Coworking", "Autres incubateur"],
  "Programme": ["Appuis à l'Exécution des Projets Techlinic", "Assistance technique Hackaton", "Assistance technique Programme Cohorte", "Autres programme"],
};

const PRODUCTS = [
  { code: "S1", label: "Assistance technique - Programme crysalis", prix: 1119, categorie: "Programme" },
  { code: "S2", label: "Assistance technique – Programme 3 mois – 5 bénéficiaires", prix: 8886, categorie: "SING Logiciels" },
  { code: "S3", label: "Organisation comité de sélection et attribution de fonds", prix: 500074, categorie: "Programme" },
];

const CLIENTS = [
  { nom: "SING", adresse: "BP. 2280, Centre Ville, Libreville – Gabon", tel: "+241 74 13 71 03", pays: "Gabon" },
  { nom: "Emmanuel Edgardo", adresse: "10, rue Cambacérès 75008 Paris", tel: "01 42 66 68 49", pays: "Gabon" },
  { nom: "Gracia Cestin", adresse: "BP 65054 31033 Toulouse", tel: "01 58 22 17 10", pays: "Gabon" },
];

const TAXES = { tps: 0.095, css: 0.01, remise: 0.095 };

const SAMPLE_FACTURES = [
  { id: "2026/02/001", date: "09/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 2505965, statut: "Active", netAPayer: 2075126.97, solde: 2075126.97 },
  { id: "2026/02/001", date: "17/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 5595, statut: "Annulée", netAPayer: 4633.08, solde: 4633.08 },
  { id: "2026/02/002", date: "20/02/2026", client: "SING", designation: "Assistance technique - Programme crysalis", ht: 2005891, statut: "Active", netAPayer: 1661028.19, solde: 1661028.19 },
];

const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

const Badge = ({ text, type }) => {
  const styles = {
    Active: { bg: "#d1fae5", color: "#065f46" },
    Annulée: { bg: "#fee2e2", color: "#991b1b" },
    Devis: { bg: "#e0f2fe", color: "#0369a1" },
    Commande: { bg: "#fef3c7", color: "#92400e" },
    Livraison: { bg: "#ede9fe", color: "#5b21b6" },
    Facture: { bg: "#d1fae5", color: "#065f46" },
  };
  const s = styles[text] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {text}
    </span>
  );
};

const Sidebar = ({ active, setActive }) => {
  const items = [
    { key: "dashboard", icon: "📊", label: "Tableau de bord" },
    { key: "devis", icon: "📋", label: "Devis" },
    { key: "commandes", icon: "📦", label: "Bons de commande" },
    { key: "livraisons", icon: "🚚", label: "Bons de livraison" },
    { key: "factures", icon: "🧾", label: "Factures" },
    { key: "recap", icon: "📈", label: "Récapitulatif" },
    { key: "clients", icon: "👥", label: "Clients" },
    { key: "catalogue", icon: "🗂️", label: "Catalogue" },
    { key: "parametres", icon: "⚙️", label: "Paramètres" },
  ];
  return (
    <div style={{ width: 230, background: "#1e293b", minHeight: "100vh", display: "flex", flexDirection: "column", padding: "0 0 20px 0", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #334155" }}>
        <div style={{ color: "#38bdf8", fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>SING S.A.</div>
        <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>Gestion Commerciale</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
              background: active === item.key ? "#0f172a" : "transparent",
              color: active === item.key ? "#38bdf8" : "#cbd5e1",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13,
              fontWeight: active === item.key ? 600 : 400, marginBottom: 2,
              borderLeft: active === item.key ? "3px solid #38bdf8" : "3px solid transparent",
              textAlign: "left",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 20px", borderTop: "1px solid #334155" }}>
        <div style={{ color: "#64748b", fontSize: 11 }}>Version web • SING © 2026</div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, sub, color, icon }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", flex: 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 6 }}>{label}</div>
        <div style={{ color: color || "#111827", fontWeight: 700, fontSize: 22 }}>{value}</div>
        {sub && <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 28 }}>{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const total = SAMPLE_FACTURES.filter(f => f.statut === "Active").reduce((s, f) => s + f.netAPayer, 0);
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Tableau de bord</h2>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>Bienvenue dans votre gestion commerciale — SING S.A., Libreville, Gabon</p>

      {/* Workflow banner */}
      <div style={{ background: "linear-gradient(135deg, #1e40af, #0891b2)", borderRadius: 12, padding: "16px 24px", marginBottom: 24, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>🔄 Flux commercial</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {["📋 Devis", "📦 Bon de Commande", "🚚 Bon de Livraison", "🧾 Facture", "📈 Récapitulatif"].map((step, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 500 }}>{step}</span>
              {i < arr.length - 1 && <span style={{ opacity: 0.6 }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Factures actives" value="2" sub="sur 3 émises" color="#0369a1" icon="🧾" />
        <KpiCard label="Chiffre d'affaires net" value={fmt(total)} sub="factures actives" color="#065f46" icon="💰" />
        <KpiCard label="Solde en attente" value={fmt(total)} sub="à recouvrer" color="#92400e" icon="⏳" />
        <KpiCard label="Taux de remise" value="9,5%" sub="paramétré" color="#5b21b6" icon="🏷️" />
      </div>

      {/* Taxes info */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "TPS", val: "9,5%", desc: "Taxe sur Prestations de Services" },
          { label: "CSS", val: "1%", desc: "Contribution Spéciale de Solidarité" },
          { label: "TVA", val: "18%", desc: "Non utilisée actuellement" },
        ].map((t) => (
          <div key={t.label} style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontWeight: 700, color: "#1a56db", fontSize: 16 }}>{t.val} <span style={{ color: "#111827", fontSize: 13 }}>{t.label}</span></div>
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Recent invoices */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 14 }}>Dernières factures</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["N° Facture", "Date", "Désignation", "HT (FCFA)", "Net à payer", "Statut"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_FACTURES.map((f, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1a56db" }}>{f.id}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{f.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", maxWidth: 220 }}>{f.designation}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{new Intl.NumberFormat("fr-FR").format(f.ht)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{fmt(f.netAPayer)}</td>
                <td style={{ padding: "12px 16px" }}><Badge text={f.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DocumentForm = ({ type, icon }) => {
  const [client, setClient] = useState(CLIENTS[0].nom);
  const [lignes, setLignes] = useState([{ produit: PRODUCTS[0].code, qte: 1, prixUnit: PRODUCTS[0].prix, desc: PRODUCTS[0].label }]);
  const [remise, setRemise] = useState(true);

  const addLigne = () => setLignes([...lignes, { produit: "", qte: 1, prixUnit: 0, desc: "" }]);
  const updateLigne = (i, field, val) => {
    const updated = [...lignes];
    if (field === "produit") {
      const p = PRODUCTS.find(p => p.code === val);
      updated[i] = { ...updated[i], produit: val, prixUnit: p ? p.prix : 0, desc: p ? p.label : "" };
    } else {
      updated[i] = { ...updated[i], [field]: val };
    }
    setLignes(updated);
  };

  const soldeHT = lignes.reduce((s, l) => s + l.qte * l.prixUnit, 0);
  const montantRemise = remise ? soldeHT * TAXES.remise : 0;
  const sousTotal2 = soldeHT - montantRemise;
  const tps = sousTotal2 * TAXES.tps;
  const css = sousTotal2 * TAXES.css;
  const netAPayer = sousTotal2 - tps - css;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{icon} Nouveau {type}</h2>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>Remplissez les informations pour générer le document.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Informations générales</div>
          <label style={{ fontSize: 13, color: "#374151", display: "block", marginBottom: 4 }}>Client</label>
          <select value={client} onChange={e => setClient(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
            {CLIENTS.map(c => <option key={c.nom}>{c.nom}</option>)}
          </select>
          <label style={{ fontSize: 13, color: "#374151", display: "block", marginBottom: 4 }}>N° de référence (marché/BC)</label>
          <input placeholder="Ex: BC-2026-001" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Conditions de paiement</div>
          {["Paiement en totalité dès réception", "Acompte 20% dès validation de l'offre", "Acompte 30% dès validation", "Acompte 50% dès validation"].map(m => (
            <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>
              <input type="radio" name="paiement" /> {m}
            </label>
          ))}
        </div>
      </div>

      {/* Lignes de prestations */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Lignes de prestations</div>
          <button onClick={addLigne} style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer" }}>+ Ajouter une ligne</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Code", "Désignation", "Qté", "Prix unit. HT", "Total HT"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 12px" }}>
                  <select value={l.produit} onChange={e => updateLigne(i, "produit", e.target.value)}
                    style={{ padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }}>
                    <option value="">--</option>
                    {PRODUCTS.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}
                  </select>
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <input value={l.desc} onChange={e => updateLigne(i, "desc", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }} />
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <input type="number" value={l.qte} onChange={e => updateLigne(i, "qte", Number(e.target.value))}
                    style={{ width: 60, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }} />
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <input type="number" value={l.prixUnit} onChange={e => updateLigne(i, "prixUnit", Number(e.target.value))}
                    style={{ width: 110, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12 }} />
                </td>
                <td style={{ padding: "8px 12px", fontWeight: 600, fontSize: 13 }}>
                  {new Intl.NumberFormat("fr-FR").format(l.qte * l.prixUnit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Récapitulatif financier */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Catégories de service (pour le récap)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.entries(SERVICES).map(([cat, subs]) => (
              <div key={cat} style={{ background: "#f9fafb", borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: "#1a56db", marginBottom: 6 }}>{cat}</div>
                {subs.map(s => <div key={s} style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>• {s}</div>)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Calcul financier</div>
          {[
            ["Solde HT", soldeHT],
            ["Remise (9,5%)", -montantRemise],
            ["Sous-total 2", sousTotal2],
            ["TPS (9,5%)", -tps],
            ["CSS (1%)", -css],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: "#6b7280" }}>{label}</span>
              <span style={{ color: val < 0 ? "#e02424" : "#111827", fontWeight: val < 0 ? 500 : 400 }}>
                {val < 0 ? "- " : ""}{new Intl.NumberFormat("fr-FR").format(Math.abs(val))}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "2px solid #1a56db", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Net à payer</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#065f46" }}>{fmt(netAPayer)}</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={remise} onChange={e => setRemise(e.target.checked)} />
            Appliquer la remise (9,5%)
          </label>
          <button style={{ marginTop: 16, width: "100%", background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            💾 Enregistrer & Exporter PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const RecapPage = () => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>📈 Récapitulatif des factures</h2>
    <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>Vue consolidée de toutes les factures émises.</p>
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <input placeholder="🔍 Rechercher..." style={{ flex: 1, padding: "9px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }} />
      <select style={{ padding: "9px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}>
        <option>Tous les statuts</option>
        <option>Active</option>
        <option>Annulée</option>
      </select>
      <button style={{ padding: "9px 16px", background: "#0e9f6e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>⬇ Exporter Excel</button>
    </div>
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["Date", "Désignation", "N° Facture", "Solde HT", "Remise", "Sous-total 2", "TPS 9,5%", "CSS 1%", "Net à payer", "Solde dû", "Statut"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SAMPLE_FACTURES.map((f, i) => {
            const remise = f.ht * TAXES.remise;
            const st2 = f.ht - remise;
            const tps = st2 * TAXES.tps;
            const css = st2 * TAXES.css;
            return (
              <tr key={i} style={{ borderTop: "1px solid #f3f4f6", opacity: f.statut === "Annulée" ? 0.5 : 1 }}>
                <td style={{ padding: "11px 12px", fontSize: 12 }}>{f.date}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, maxWidth: 180 }}>{f.designation}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, fontWeight: 600, color: "#1a56db" }}>{f.id}</td>
                <td style={{ padding: "11px 12px", fontSize: 12 }}>{new Intl.NumberFormat("fr-FR").format(f.ht)}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, color: "#e02424" }}>-{new Intl.NumberFormat("fr-FR").format(Math.round(remise))}</td>
                <td style={{ padding: "11px 12px", fontSize: 12 }}>{new Intl.NumberFormat("fr-FR").format(Math.round(st2))}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, color: "#e02424" }}>-{new Intl.NumberFormat("fr-FR").format(Math.round(tps))}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, color: "#e02424" }}>-{new Intl.NumberFormat("fr-FR").format(Math.round(css))}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, fontWeight: 700, color: "#065f46" }}>{fmt(f.netAPayer)}</td>
                <td style={{ padding: "11px 12px", fontSize: 12, fontWeight: 600 }}>{fmt(f.solde)}</td>
                <td style={{ padding: "11px 12px" }}><Badge text={f.statut} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const ClientsPage = () => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>👥 Gestion des clients</h2>
    <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>Base de données des clients et représentants.</p>
    <button style={{ marginBottom: 20, background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>+ Nouveau client</button>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {CLIENTS.map((c, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{c.nom}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 4 }}>📍 {c.adresse}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 4 }}>📞 {c.tel}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>🌍 {c.pays}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "7px 0", background: "#eff6ff", color: "#1a56db", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>✏️ Modifier</button>
            <button style={{ flex: 1, padding: "7px 0", background: "#fff7ed", color: "#c2410c", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>🗑️ Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CataloguePage = () => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🗂️ Catalogue des prestations</h2>
    <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>Table T_PACKS — toutes les prestations paramétrées.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
      {Object.entries(SERVICES).map(([cat, subs]) => (
        <div key={cat} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#1a56db", fontSize: 15, marginBottom: 12 }}>{cat}</div>
          {subs.map(s => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
              <span>{s}</span>
              <Badge text="Actif" type="Active" />
            </div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 14 }}>Prestations avec tarifs</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["Code", "Description", "Prix unitaire HT (FCFA)", "Catégorie", "Statut"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((p, i) => (
            <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1a56db", fontSize: 13 }}>{p.code}</td>
              <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.label}</td>
              <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{new Intl.NumberFormat("fr-FR").format(p.prix)}</td>
              <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.categorie}</td>
              <td style={{ padding: "12px 16px" }}><Badge text="Active" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ParametresPage = () => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>⚙️ Paramètres</h2>
    <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>Configuration générale de l'application.</p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>🏢 Informations de l'entreprise</div>
        {[["Nom", "SING S.A."], ["Adresse", "BP. 2280, Centre Ville, Libreville – Gabon"], ["Téléphone", "+241 74 13 71 03"], ["Email", "info@sing.ga"], ["Site web", "https://www.sing.ga/"], ["RCCM", "RG LBV 2018B22204"], ["Capital", "50 000 000 FCFA"]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{k}</label>
            <input defaultValue={v} style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
          </div>
        ))}
        <button style={{ marginTop: 8, background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>💾 Enregistrer</button>
      </div>
      <div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>💰 Configuration fiscale</div>
          {[["TPS (Taxe sur Prestations de Services)", "9.5", "%"], ["CSS (Contribution Spéciale de Solidarité)", "1", "%"], ["TVA (non utilisée)", "18", "%"], ["Taux de remise par défaut", "9.5", "%"]].map(([l, v, u]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{l}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input defaultValue={v} style={{ width: 60, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, textAlign: "right" }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>{u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>🏦 RIB Bancaires</div>
          {[["UBA Gabon", "40025 05801 80100300296 81"], ["AFG Bank", "40001 09070 07000615101 36"]].map(([b, r]) => (
            <div key={b} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{b}</label>
              <input defaultValue={r} style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12, boxSizing: "border-box", fontFamily: "monospace" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "devis": return <DocumentForm type="Devis" icon="📋" />;
      case "commandes": return <DocumentForm type="Bon de Commande" icon="📦" />;
      case "livraisons": return <DocumentForm type="Bon de Livraison" icon="🚚" />;
      case "factures": return <DocumentForm type="Facture" icon="🧾" />;
      case "recap": return <RecapPage />;
      case "clients": return <ClientsPage />;
      case "catalogue": return <CataloguePage />;
      case "parametres": return <ParametresPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar active={page} setActive={setPage} />
      <main style={{ flex: 1, padding: 32, overflowY: "auto", maxHeight: "100vh" }}>
        {renderPage()}
      </main>
    </div>
  );
}
