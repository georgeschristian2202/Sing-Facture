import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SingLogo from '../components/SingLogo';
import { 
  FileText, 
  ShoppingCart,
  Truck,
  Receipt,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Menu,
  X,
  Zap,
  Shield,
  Users,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <SingLogo size="sm" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#fonctionnalites" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                Tarifs
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                Contact
              </a>
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-gray-700 hover:text-[#00758D] transition-colors font-medium cursor-pointer"
              >
                Se connecter
              </button>
              <button
                onClick={handleGetStarted}
                className="px-5 py-2 bg-[#00758D] text-white rounded-xl font-semibold hover:bg-[#00303C] transition-colors cursor-pointer shadow-md"
              >
                Essai gratuit
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#00303C] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-4">
                <a href="#fonctionnalites" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                  Fonctionnalités
                </a>
                <a href="#tarifs" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                  Tarifs
                </a>
                <a href="#contact" className="text-gray-700 hover:text-[#00758D] transition-colors font-medium">
                  Contact
                </a>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-gray-700 hover:text-[#00758D] transition-colors font-medium cursor-pointer text-left"
                >
                  Se connecter
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-5 py-2 bg-[#00758D] text-white rounded-xl font-semibold hover:bg-[#00303C] transition-colors cursor-pointer"
                >
                  Essai gratuit
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Fond Teal Foncé */}
      <section className="pt-24 pb-20 px-6 bg-gradient-to-br from-[#00303C] via-[#00758D] to-[#00303C] relative overflow-hidden">
        {/* Décoration arrière-plan animée */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC32F]/10 rounded-full blur-3xl translate-x-32 -translate-y-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8E0B56]/10 rounded-full blur-3xl -translate-x-16 translate-y-16 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 bg-[#DFC32F]/20 text-[#DFC32F] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-bounce">
                <Zap className="w-3.5 h-3.5" />
                Solution SaaS N°1 pour la gestion commerciale en Afrique
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
                Gérez votre<br />
                <span className="text-[#DFC32F] animate-pulse">facturation</span><br />
                comme un pro
              </h1>
              <p className="text-lg text-teal-100 mb-8 leading-relaxed max-w-lg">
                De la création du devis à l'encaissement, SING-Facturation automatise tout votre cycle commercial. 
                Calcul des taxes TPS/CSS, PDF professionnels, récapitulatifs financiers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-[#DFC32F] text-[#00303C] font-bold px-8 py-4 rounded-2xl hover:bg-amber-300 hover:scale-105 hover:shadow-2xl transition-all shadow-lg text-lg cursor-pointer transform"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#fonctionnalites"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-medium px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-lg cursor-pointer"
                >
                  Voir les fonctionnalités
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-teal-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#DFC32F]" />
                  Sans carte bancaire
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#DFC32F]" />
                  14 jours d'essai
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#DFC32F]" />
                  Résiliation libre
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Mockup */}
            <div className={`hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 bg-white/10 rounded-full h-5 ml-2" />
                </div>
                {/* Fake dashboard */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['CA Total', 'Factures', 'Solde dû'].map((t, i) => (
                      <div key={t} className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-teal-200 mb-1">{t}</p>
                        <p className="text-white font-bold text-sm">{['2.4M FCFA', '24', '380K FCFA'][i]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-teal-200 mb-2">Dernières factures</p>
                    {['2026/03/001 — SING — 145 200 FCFA', '2026/03/002 — Pauline L. — 87 500 FCFA', '2026/02/030 — Gracia C. — 500 074 FCFA'].map(f => (
                      <div key={f} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                        <span className="text-white/80 text-xs">{f.split(' — ')[0]}</span>
                        <span className="text-[#DFC32F] text-xs font-semibold">{f.split('— ').pop()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[40, 65, 50, 80, 60].map((h, i) => (
                      <div key={i} className="bg-white/20 rounded-md" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Fond Teal Foncé */}
      <section className="bg-[#00303C] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Entreprises clientes' },
              { value: '50K+', label: 'Factures générées' },
              { value: '99.9%', label: 'Disponibilité' },
              { value: '14j', label: "D'essai gratuit" },
            ].map((s, i) => (
              <div key={s.label} className="transform hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl font-black text-[#DFC32F] animate-pulse">{s.value}</p>
                <p className="text-teal-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section - Fond Gris Clair */}
      <section className="py-20 bg-[#EDEDED]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#00303C] mb-4">Un cycle commercial complet</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              De la prospection à l'encaissement, gérez chaque étape de votre processus commercial en quelques clics.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            {[
              { label: 'Devis', icon: FileText, color: 'bg-[#00758D]' },
              { label: 'Bon de Commande', icon: ShoppingCart, color: 'bg-[#8E0B56]' },
              { label: 'Bon de Livraison', icon: Truck, color: 'bg-[#5C4621]' },
              { label: 'Facture', icon: Receipt, color: 'bg-[#00303C]' },
              { label: 'Récapitulatif', icon: BarChart3, color: 'bg-[#DFC32F]' },
            ].map((step, i, arr) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center group">
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer`}>
                      <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-semibold text-[#00303C] mt-2 text-center">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block animate-pulse" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Fond Blanc */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#00758D] font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="text-4xl font-black text-[#00303C] mt-2 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une suite complète d'outils pour gérer votre activité commerciale avec professionnalisme.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Devis Professionnels',
                desc: 'Créez des devis en quelques clics, avec calcul automatique des taxes TPS/TVA et CSS.',
                color: 'bg-[#00758D]/10 text-[#00758D]'
              },
              {
                icon: ShoppingCart,
                title: 'Bons de Commande',
                desc: 'Convertissez un devis en bon de commande automatiquement en un clic.',
                color: 'bg-[#8E0B56]/10 text-[#8E0B56]'
              },
              {
                icon: Truck,
                title: 'Bons de Livraison',
                desc: 'Gérez vos livraisons et gardez une trace officielle de chaque prestation effectuée.',
                color: 'bg-[#DFC32F]/20 text-[#5C4621]'
              },
              {
                icon: Receipt,
                title: 'Facturation Complète',
                desc: 'Générez des factures conformes avec numérotation automatique et pied de page légal.',
                color: 'bg-[#00303C]/10 text-[#00303C]'
              },
              {
                icon: BarChart3,
                title: 'Tableau Récapitulatif',
                desc: 'Visualisez toutes vos factures avec ventilation par catégorie et suivi des paiements.',
                color: 'bg-[#00758D]/10 text-[#00758D]'
              },
              {
                icon: Globe,
                title: 'Multi-tenant SaaS',
                desc: 'Solution cloud accessible partout, avec séparation stricte des données par entreprise.',
                color: 'bg-[#8E0B56]/10 text-[#8E0B56]'
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-[#00303C] text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features Section - Fond Teal Foncé */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#00303C] to-[#00758D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#DFC32F] blur-3xl animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#DFC32F]/20 text-[#DFC32F] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Star className="w-3.5 h-3.5" />
                Fonctionnalités Premium
              </div>
              <h2 className="text-3xl font-black text-white mb-6">Personnalisez vos documents à votre image</h2>
              <div className="space-y-4">
                {[
                  { title: 'Upload de votre modèle de facture', desc: 'Téléversez votre propre template de facture. L\'application génère vos documents sur la base de votre modèle existant.' },
                  { title: 'Génération illimitée', desc: 'Créez autant de devis, bons de commande, bons de livraison et factures que vous voulez sans restriction.' },
                  { title: 'Personnalisation complète', desc: 'Couleurs, logo, pied de page légal, RIB — tout est paramétrable pour correspondre à votre identité visuelle.' },
                  { title: 'Exports & Rapports avancés', desc: 'Récapitulatif financier complet avec ventilation par catégorie et export des données.' },
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-4 transform hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-10 h-10 bg-[#DFC32F]/20 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-[#DFC32F]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-teal-200 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 border border-white/20 hover:scale-105 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#DFC32F] animate-pulse" />
                <span className="text-white font-bold text-lg">Plan Pro — Fonctionnalités incluses</span>
              </div>
              <div className="space-y-3">
                {[
                  'Factures & documents illimités',
                  'Upload modèle de facture personnalisé',
                  'PDF haute qualité avec votre logo',
                  'RIB bancaire sur les documents',
                  'Calcul automatique TPS + CSS',
                  'Suivi paiements & soldes dus',
                  'Récapitulatif financier complet',
                  'Support prioritaire dédié'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#DFC32F] flex-shrink-0" />
                    <span className="text-white/90 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleGetStarted}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-[#DFC32F] text-[#00303C] font-bold py-3.5 rounded-2xl hover:bg-amber-300 hover:scale-105 transition-all cursor-pointer transform"
              >
                Activer le Premium
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Fond Gris Clair */}
      <section id="tarifs" className="py-24 bg-[#EDEDED]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#00758D] font-semibold text-sm uppercase tracking-wider">Tarifs</span>
            <h2 className="text-4xl font-black text-[#00303C] mt-2 mb-4">Des prix transparents</h2>
            <p className="text-gray-600">Commencez gratuitement, évoluez selon vos besoins.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'Gratuit',
                priceDetail: '',
                badge: null,
                features: [
                  '5 factures / mois',
                  '2 clients max',
                  'Export PDF basique',
                  'Support email',
                ],
                cta: 'Commencer gratuitement',
                ctaStyle: 'border-2 border-[#00758D] text-[#00758D] hover:bg-[#00758D] hover:text-white',
                color: 'border-gray-200'
              },
              {
                name: 'Pro',
                price: '15 000',
                priceDetail: 'FCFA / mois',
                badge: 'Populaire',
                features: [
                  'Factures illimitées',
                  'Clients illimités',
                  'Export PDF haute qualité',
                  'Modèle de facture personnalisé',
                  'Upload de votre propre modèle',
                  'Support prioritaire',
                  'Récapitulatif avancé',
                ],
                cta: 'Essai 14 jours gratuit',
                ctaStyle: 'bg-[#00758D] text-white hover:bg-[#00303C]',
                color: 'border-[#00758D]'
              },
              {
                name: 'Entreprise',
                price: '45 000',
                priceDetail: 'FCFA / mois',
                badge: null,
                features: [
                  'Tout du plan Pro',
                  'Multi-utilisateurs (10)',
                  'API d\'intégration',
                  'Modèles illimités',
                  'Manager de compte dédié',
                  'Formation équipe incluse',
                  'SLA 99.9% uptime',
                ],
                cta: 'Contacter les ventes',
                ctaStyle: 'bg-[#DFC32F] text-[#00303C] hover:bg-amber-400 font-bold',
                color: 'border-[#DFC32F]'
              },
            ].map(plan => (
              <div key={plan.name} className={`bg-white rounded-3xl border-2 ${plan.color} p-8 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 relative`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00758D] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#00303C] mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-[#00303C]">{plan.price}</span>
                  {plan.priceDetail && <span className="text-gray-500 text-sm ml-1">{plan.priceDetail}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-[#00758D] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all text-sm font-semibold ${plan.ctaStyle} cursor-pointer hover:scale-105 transform`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Fond Blanc */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#00303C]">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Marie Obame',
                role: 'Directrice Administrative, Tech Gabon',
                text: 'SING-Facturation a transformé notre gestion commerciale. Les calculs automatiques TPS/CSS nous font gagner un temps précieux.'
              },
              {
                name: 'Jean-Pierre Mouloungui',
                role: 'Gérant, Conseil & Stratégie Libreville',
                text: 'La conversion automatique devis → facture est révolutionnaire. Plus d\'erreurs de saisie, nos clients reçoivent des documents impeccables.'
              },
              {
                name: 'Sandrine Mintsa',
                role: 'Comptable, SOFITEX Gabon',
                text: 'Le récapitulatif financier avec la ventilation par catégorie correspond exactement à ce que notre cabinet attendait.'
              },
            ].map(t => (
              <div key={t.name} className="bg-[#EDEDED] rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-[#DFC32F] fill-[#DFC32F] hover:scale-125 transition-transform" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-[#00303C] text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section - Fond Teal Foncé */}
      <section id="contact" className="py-20 bg-[#00303C]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Prêt à simplifier votre facturation ?</h2>
          <p className="text-teal-200 text-lg mb-10">
            Rejoignez des centaines d'entreprises africaines qui font confiance à SING-Facturation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 bg-[#DFC32F] text-[#00303C] font-bold px-10 py-4 rounded-2xl hover:bg-amber-300 hover:scale-110 hover:shadow-2xl transition-all text-lg shadow-xl cursor-pointer transform animate-pulse"
            >
              Démarrer maintenant — C'est gratuit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-medium px-10 py-4 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all text-lg cursor-pointer transform"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Fond Très Foncé */}
      <footer className="bg-[#1D1D1B] py-12 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <SingLogo size="md" />
              <p className="mt-3 text-gray-500 max-w-xs">
                Solution SaaS de gestion commerciale et facturation pour les entreprises africaines.
              </p>
              <p className="mt-2 text-xs text-gray-600">SING S.A. — RG LBV 2018B22204 — Libreville, GABON</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Produit</h4>
              <ul className="space-y-2">
                {['Fonctionnalités', 'Tarifs', 'Documentation', 'Changelog'].map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#DFC32F] transition-colors cursor-pointer">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Entreprise</h4>
              <ul className="space-y-2">
                {['À propos', 'Contact', 'Politique de confidentialité', 'CGU'].map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#DFC32F] transition-colors cursor-pointer">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 SING-Facturation. Tous droits réservés.</p>
            <p className="text-xs flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Conçu et développé pour l'Afrique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
