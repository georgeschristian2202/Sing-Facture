import { useState, useEffect, useRef } from "react";

const FEATURES = [
  { icon: "📋", title: "Devis en 1 clic", desc: "Créez des devis professionnels depuis votre catalogue. Chaque ligne auto-remplit description courte, description détaillée et prix unitaire." },
  { icon: "📦", title: "Bons de commande", desc: "Transformez un devis accepté en bon de commande en un seul clic. Zéro ressaisie, traçabilité totale." },
  { icon: "🚚", title: "Bons de livraison", desc: "Suivez vos livraisons et liez-les aux commandes. Historique complet du cycle commercial." },
  { icon: "🧾", title: "Facturation automatique", desc: "TPS 9,5%, CSS 1% et remise paramétrables par entreprise. Calculs instantanés, PDF personnalisé." },
  { icon: "📈", title: "Récapitulatif temps réel", desc: "CA ventilé par catégorie de service, soldes dus, statuts. Export Excel et PDF en un clic." },
  { icon: "⚙️", title: "Paramétrage centralisé", desc: "Catalogue prestations, descriptions courtes/détaillées, taxes, logo, couleurs, RIB — tout éditable en live." },
];

const FLOW = [
  { icon: "📋", label: "Devis", color: "#3b82f6" },
  { icon: "📦", label: "Commande", color: "#8b5cf6" },
  { icon: "🚚", label: "Livraison", color: "#f59e0b" },
  { icon: "🧾", label: "Facture", color: "#10b981" },
  { icon: "📈", label: "Récap", color: "#ef4444" },
];

const PLANS = [
  { name: "Starter", price: "15 000", per: "FCFA/mois", color: "#3b82f6",
    features: ["1 utilisateur", "50 factures/mois", "Catalogue 20 prestations", "Export PDF", "Support email"] },
  { name: "Business", price: "45 000", per: "FCFA/mois", color: "#8b5cf6", badge: "Populaire",
    features: ["5 utilisateurs", "Factures illimitées", "Catalogue illimité", "Logo & couleurs perso", "Export Excel + PDF", "Support prioritaire"] },
  { name: "Entreprise", price: "Sur devis", per: "", color: "#10b981",
    features: ["Utilisateurs illimités", "Multi-structures", "Accès API", "Personnalisation complète", "Formation incluse", "Support dédié"] },
];

const TESTIMONIALS = [
  { name: "Marie-Claire NDONG", role: "Directrice Financière", co: "TechGabon SARL", av: "MC",
    text: "Avant je passais des heures sur Excel. Maintenant mes factures sont prêtes en 3 minutes et mes clients reçoivent le PDF directement par email." },
  { name: "Patrick OBAMA", role: "Gérant", co: "Innovatech Libreville", av: "PO",
    text: "Le lien entre description courte et détaillée des prestations est exactement ce qu'il me fallait. Ça correspond parfaitement à notre réalité terrain." },
  { name: "Sylvie MBOUMBA", role: "Comptable", co: "Consulting Plus", av: "SM",
    text: "Le récapitulatif mensuel ventilé par catégorie de service me sauve la vie à chaque clôture. Fini les tableaux Excel bricolés." },
];

function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Appear({ children, delay = 0, style = {} }) {
  const [ref, visible] = useVisible();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0px)" : "translateY(36px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
function Navbar({ onOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(10,14,26,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🧾</div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 19 }}>FacturePro</span>
          <span style={{ color: "#475569", fontSize: 11, marginLeft: 2, fontStyle: "italic" }}>by SING S.A.</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Fonctionnalités", "Paramétrage", "Tarifs", "Témoignages"].map(l => (
            <a key={l} href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "8px 18px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Connexion</button>
          <button onClick={onOpen} style={{ padding: "8px 20px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Essai gratuit →</button>
        </div>
      </div>
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────────────── */
function Hero({ onOpen }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % FLOW.length), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{
      minHeight: "100vh", background: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.13) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.10) 0%, transparent 50%), #0a0e1a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "130px 32px 80px", textAlign: "center",
    }}>
      {/* Badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 30, padding: "6px 18px", marginBottom: 30 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
        <span style={{ color: "#93c5fd", fontSize: 13 }}>Fiscalité gabonaise TPS + CSS déjà configurée · 14 jours offerts</span>
      </div>

      {/* Titre */}
      <h1 style={{ fontSize: "clamp(36px,5.5vw,70px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 22, maxWidth: 820, letterSpacing: -1.5 }}>
        Votre cycle commercial complet,{" "}
        <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          du devis à la facture
        </span>
      </h1>

      <p style={{ fontSize: 19, color: "#64748b", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.75 }}>
        Remplacez votre fichier Excel par une application web collaborative. Vos prestations, vos taxes, votre mise en page — tout personnalisable.
      </p>

      {/* Flow animé */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 54, flexWrap: "wrap", justifyContent: "center" }}>
        {FLOW.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 20px",
              background: i === active ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${i === active ? s.color : "rgba(255,255,255,0.07)"}`,
              borderRadius: 30, transition: "all 0.45s ease",
              boxShadow: i === active ? `0 0 22px ${s.color}50` : "none",
              transform: i === active ? "scale(1.10)" : "scale(1)",
            }}>
              <span style={{ fontSize: 17 }}>{s.icon}</span>
              <span style={{ color: i === active ? "#fff" : "#475569", fontSize: 13, fontWeight: 600, transition: "color 0.35s" }}>{s.label}</span>
            </div>
            {i < FLOW.length - 1 && <span style={{ color: "#1e293b", fontSize: 16 }}>›</span>}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onOpen} style={{ padding: "15px 38px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 32px rgba(59,130,246,0.35)", transition: "transform .2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          Commencer gratuitement →
        </button>
        <button style={{ padding: "15px 34px", background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid #1e293b", borderRadius: 12, fontSize: 16, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#475569"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; }}>
          📺 Voir la démo
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 56, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
        {[["100+", "Entreprises actives"], ["15 000+", "Factures générées"], ["99,9%", "Disponibilité"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>{n}</div>
            <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURES ────────────────────────────────────────────────── */
function Features() {
  return (
    <section style={{ background: "#0a0e1a", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <Appear>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14 }}>FONCTIONNALITÉS</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Tout le cycle commercial,<br />dans un seul outil web</h2>
            <p style={{ color: "#475569", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>Basé sur le flux éprouvé d'ApplicationV2.xlsm — maintenant accessible depuis n'importe quel appareil.</p>
          </div>
        </Appear>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px,1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <Appear key={i} delay={i * 0.07}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 26, transition: "all .3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.07)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 34, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONFIG SECTION ──────────────────────────────────────────── */
function ConfigSection() {
  const [tab, setTab] = useState("prestations");
  const TABS = [
    { id: "prestations", label: "📦 Prestations" },
    { id: "taxes", label: "💰 Taxes & Remises" },
    { id: "facture", label: "🧾 Modèle PDF" },
  ];
  const PRESTS = [
    { code: "S1", cat: "Programme", courte: "Assistance technique - Programme crysalis", detail: "Identification entrepreneurs · Sessions d'information · Grilles de notation · Présélections", prix: "1 119 FCFA" },
    { code: "S2", cat: "Programme", courte: "Assistance tech – 3 mois – 5 bénéficiaires", detail: "Mobilisation jury · Organisation demoday · Rapport synthèse · Communication entrepreneurs", prix: "8 886 FCFA" },
    { code: "S3", cat: "SING Logiciels", courte: "Organisation comité de sélection", detail: "Suivi financier 2 mois · Entretien et sélection · Feuilles de route · Flash report · Rapport final", prix: "500 074 FCFA" },
  ];
  const content = {
    prestations: (
      <div>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 18 }}>Chaque prestation possède un code, une <strong style={{ color: "#93c5fd" }}>description courte</strong> (affichée sur le PDF) et une <strong style={{ color: "#a78bfa" }}>description détaillée</strong> (visible par votre équipe).</p>
        {PRESTS.map((p, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
                  <span style={{ background: "rgba(59,130,246,0.18)", color: "#93c5fd", borderRadius: 5, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{p.code}</span>
                  <span style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{p.cat}</span>
                </div>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>📄 {p.courte}</div>
                <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>📝 {p.detail}</div>
              </div>
              <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{p.prix}</div>
            </div>
          </div>
        ))}
        <button style={{ marginTop: 8, width: "100%", padding: "11px", background: "transparent", color: "#3b82f6", border: "1px dashed #3b82f6", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Ajouter une prestation</button>
      </div>
    ),
    taxes: (
      <div>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 18 }}>Configurez la fiscalité de votre pays. Pour le Gabon : TPS + CSS toujours appliqués.</p>
        {[
          { label: "Type de taxe", val: "TPS — Taxe sur Prestations de Services", badge: "Actif", color: "#10b981" },
          { label: "Taux TPS", val: "9,5 %", editable: true },
          { label: "Taux CSS", val: "1,0 % (toujours actif)", editable: true },
          { label: "Taux TVA", val: "18,0 %", muted: true, badge: "Désactivé", badgeColor: "#ef4444" },
          { label: "Remise par défaut", val: "9,5 %", editable: true },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 8 }}>
            <span style={{ color: r.muted ? "#334155" : "#94a3b8", fontSize: 14 }}>{r.label}</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: r.muted ? "#334155" : "#e2e8f0", fontWeight: 700, fontSize: 15 }}>{r.val}</span>
              {r.badge && <span style={{ background: `${r.badgeColor || r.color}22`, color: r.badgeColor || r.color, fontSize: 11, borderRadius: 4, padding: "2px 8px" }}>{r.badge}</span>}
              {r.editable && <button style={{ background: "rgba(255,255,255,0.06)", color: "#64748b", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>✏️ Modifier</button>}
            </div>
          </div>
        ))}
      </div>
    ),
    facture: (
      <div>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 18 }}>Personnalisez votre modèle de facture PDF — votre logo, vos couleurs, vos RIB bancaires.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 18 }}>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Logo entreprise</div>
            <div style={{ border: "2px dashed #1e293b", borderRadius: 8, height: 70, display: "flex", alignItems: "center", justifyContent: "center", color: "#334155", fontSize: 13, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#334155"; }}>
              📂 Uploader votre logo
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 18 }}>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Couleur principale</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["#3b82f6","#8b5cf6","#10b981","#ef4444","#f59e0b","#0f172a"].map((c, i) => (
                <div key={c} style={{ width: 30, height: 30, borderRadius: 8, background: c, cursor: "pointer", border: i === 0 ? "2px solid #fff" : "2px solid transparent", transition: "transform .15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px", marginBottom: 10 }}>
          <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>RIB bancaires sur la facture</div>
          {[["UBA Gabon", "40025 05801 80100300296 81"], ["AFG Bank", "40001 09070 07000615101 36"]].map(([b, r]) => (
            <div key={b} style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
              <span>🏦 {b}</span><span style={{ color: "#64748b", fontFamily: "monospace" }}>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 18px" }}>
          <span style={{ color: "#93c5fd", fontSize: 13 }}>🔢 Numérotation auto : <strong>AAAA/MM/NNN</strong> → exemple : <strong>2026/03/001</strong></span>
        </div>
      </div>
    ),
  };

  return (
    <section style={{ background: "linear-gradient(180deg,#0a0e1a,#0d1117)", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <Appear>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "#8b5cf6", fontWeight: 700, fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14 }}>PARAMÉTRAGE CENTRALISÉ</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Configurez tout depuis<br />votre tableau de bord</h2>
            <p style={{ color: "#475569", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>Plus besoin de modifier un fichier Excel. Chaque paramètre se met à jour en live pour toute votre équipe.</p>
          </div>
        </Appear>
        <Appear delay={0.1}>
          <div style={{ maxWidth: 800, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.035)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              <span style={{ color: "#334155", fontSize: 12, marginLeft: 10 }}>Paramètres — FacturePro Dashboard</span>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: "13px 10px", background: "transparent", border: "none",
                  borderBottom: tab === t.id ? "2px solid #3b82f6" : "2px solid transparent",
                  color: tab === t.id ? "#fff" : "#475569", fontWeight: tab === t.id ? 700 : 400,
                  fontSize: 13, cursor: "pointer", transition: "all .2s",
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{ padding: 24 }}>{content[tab]}</div>
          </div>
        </Appear>
      </div>
    </section>
  );
}

/* ── PRICING ─────────────────────────────────────────────────── */
function Pricing() {
  return (
    <section style={{ background: "#0a0e1a", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <Appear>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "#10b981", fontWeight: 700, fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14 }}>TARIFS</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Simple, transparent, en FCFA</h2>
            <p style={{ color: "#475569", fontSize: 17 }}>Aucune surprise. Résiliez à tout moment.</p>
          </div>
        </Appear>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 22 }}>
          {PLANS.map((p, i) => (
            <Appear key={i} delay={i * 0.1}>
              <div style={{
                background: p.badge ? "linear-gradient(135deg,rgba(59,130,246,0.07),rgba(139,92,246,0.07))" : "rgba(255,255,255,0.025)",
                border: `1px solid ${p.badge ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 18, padding: 30, position: "relative",
                boxShadow: p.badge ? "0 0 50px rgba(139,92,246,0.12)" : "none",
              }}>
                {p.badge && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 16px" }}>
                    ⭐ {p.badge}
                  </div>
                )}
                <div style={{ color: "#94a3b8", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{p.name}</div>
                <div style={{ marginBottom: 22 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>{p.price}</span>
                  {p.per && <span style={{ color: "#475569", fontSize: 13, marginLeft: 6 }}>{p.per}</span>}
                </div>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 11, color: "#64748b", fontSize: 14 }}>
                    <span style={{ color: p.color, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
                <button style={{ marginTop: 22, width: "100%", padding: "13px", background: p.badge ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.05)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {p.badge ? "Commencer maintenant →" : "Choisir ce plan"}
                </button>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section style={{ background: "linear-gradient(180deg,#0a0e1a,#0d1117)", padding: "96px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <Appear>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Ils nous font confiance</h2>
            <p style={{ color: "#475569", fontSize: 17 }}>Des entreprises africaines qui ont remplacé leurs fichiers Excel.</p>
          </div>
        </Appear>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <Appear key={i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
                <div style={{ color: "#3b82f6", fontSize: 32, marginBottom: 14, lineHeight: 1 }}>❝</div>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{t.av}</div>
                  <div>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#475569", fontSize: 12 }}>{t.role} · {t.co}</div>
                  </div>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SIGNUP MODAL ────────────────────────────────────────────── */
function Modal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nom: "", entreprise: "", email: "", tel: "", pays: "Gabon" });
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { display: "block", width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 15, marginBottom: 13, boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, width: "100%", maxWidth: 460, padding: "40px 36px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 24, lineHeight: 1 }}>×</button>
        {step === 1 ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🧾</div>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Créer votre espace</h2>
            <p style={{ color: "#475569", fontSize: 14, marginBottom: 26 }}>14 jours d'essai Business — sans carte bancaire.</p>
            <input placeholder="👤 Votre nom complet" value={form.nom} onChange={e => up("nom", e.target.value)} style={inputStyle} />
            <input placeholder="🏢 Nom de votre entreprise" value={form.entreprise} onChange={e => up("entreprise", e.target.value)} style={inputStyle} />
            <input type="email" placeholder="📧 Email professionnel" value={form.email} onChange={e => up("email", e.target.value)} style={inputStyle} />
            <input placeholder="📞 Téléphone" value={form.tel} onChange={e => up("tel", e.target.value)} style={inputStyle} />
            <select value={form.pays} onChange={e => up("pays", e.target.value)} style={{ ...inputStyle, marginBottom: 22 }}>
              {["Gabon", "Cameroun", "Congo", "Côte d'Ivoire", "Sénégal", "Mali", "Autre"].map(p => <option key={p} style={{ background: "#0d1117" }}>{p}</option>)}
            </select>
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Créer mon espace gratuitement →
            </button>
            <p style={{ color: "#334155", fontSize: 12, textAlign: "center", marginTop: 14 }}>En continuant, vous acceptez nos CGU et notre politique de confidentialité.</p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 60, marginBottom: 18 }}>🎉</div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Bienvenue, {form.nom.split(" ")[0] || "vous"} !</h2>
            <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
              L'espace de <strong style={{ color: "#93c5fd" }}>{form.entreprise || "votre entreprise"}</strong> est en cours de création.<br />
              Vérifiez <strong style={{ color: "#e2e8f0" }}>{form.email}</strong> pour activer votre compte.
            </p>
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
              <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>✅ Votre espace inclut :</div>
              {[
                "Espace privé et isolé pour votre entreprise",
                "Fiscalité pré-configurée (TPS 9,5% + CSS 1%)",
                "Catalogue de prestations prêt à personnaliser",
                "Modèle de facture PDF avec votre logo",
                "14 jours d'essai Business offerts",
              ].map(t => <div key={t} style={{ color: "#475569", fontSize: 13, marginBottom: 6 }}>• {t}</div>)}
            </div>
            <button onClick={onClose} style={{ padding: "12px 32px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── FOOTER ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#060912", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "60px 32px 36px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36, marginBottom: 44 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🧾</div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>FacturePro</span>
            </div>
            <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>Gestion commerciale complète pour les entreprises africaines. Développé par SING S.A., Libreville, Gabon.</p>
            <div style={{ color: "#334155", fontSize: 12, marginTop: 14 }}>📞 +241 74 13 71 03 · info@sing.ga</div>
          </div>
          {[
            ["Produit", ["Fonctionnalités", "Tarifs", "Démo", "API"]],
            ["Support", ["Documentation", "FAQ", "Contact", "Statut"]],
            ["Légal", ["CGU", "Confidentialité", "Mentions légales"]],
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 16 }}>{title}</div>
              {items.map(l => <div key={l} style={{ color: "#334155", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "#64748b"} onMouseLeave={e => e.target.style.color = "#334155"}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "#1e293b", fontSize: 12 }}>© 2026 SING S.A. — RCCM : RG LBV 2018B22204 — Capital : 50 000 000 FCFA</div>
          <div style={{ color: "#1e293b", fontSize: 12 }}>Fait avec ❤️ à Libreville, Gabon</div>
        </div>
      </div>
    </footer>
  );
}

/* ── APP ─────────────────────────────────────────────────────── */
export default function App() {
  const [modal, setModal] = useState(false);
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0a0e1a" }}>
      <Navbar onOpen={() => setModal(true)} />
      <Hero onOpen={() => setModal(true)} />
      <Features />
      <ConfigSection />
      <Pricing />
      <Testimonials />

      {/* CTA Final */}
      <section style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%), #0a0e1a", padding: "96px 32px", textAlign: "center" }}>
        <Appear>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: "#fff", marginBottom: 18, letterSpacing: -1 }}>Prêt à dire adieu à Excel ?</h2>
          <p style={{ color: "#475569", fontSize: 19, marginBottom: 40 }}>Rejoignez des centaines d'entreprises africaines qui ont fait le saut.</p>
          <button onClick={() => setModal(true)} style={{ padding: "17px 50px", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", border: "none", borderRadius: 14, fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 44px rgba(59,130,246,0.35)", transition: "transform .2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Démarrer gratuitement — 14 jours offerts
          </button>
        </Appear>
      </section>

      <Footer />
      {modal && <Modal onClose={() => setModal(false)} />}
    </div>
  );
}
