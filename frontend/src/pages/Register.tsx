import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Building2, User, Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react';
import SingLogo from '../components/SingLogo';

const steps = [
  { id: 1, label: 'Compte', icon: User },
  { id: 2, label: 'Entreprise', icon: Building2 },
  { id: 3, label: 'Abonnement', icon: CreditCard },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Gratuit',
    features: ['5 factures/mois', '2 clients max', 'Support email'],
    color: 'border-gray-200',
    selected: 'border-[#00758D] bg-[#00758D]/5',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '15 000 FCFA/mois',
    features: ['Factures illimitées', 'Upload modèle perso', 'PDF haut de gamme', 'Support prioritaire'],
    color: 'border-gray-200',
    selected: 'border-[#00758D] bg-[#00758D]/5',
    recommended: true,
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    price: '45 000 FCFA/mois',
    features: ['Tout du Pro', 'Multi-utilisateurs', 'API + Manager dédié'],
    color: 'border-gray-200',
    selected: 'border-[#00758D] bg-[#00758D]/5',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [form, setForm] = useState({
    // Compte
    nom_complet: '',
    email: '',
    telephone: '',
    password: '',
    confirm_password: '',
    // Entreprise
    nom_entreprise: '',
    secteur_activite: '',
    adresse_entreprise: '',
    ville: '',
    pays: 'Gabon',
    telephone_entreprise: '',
    email_entreprise: '',
    site_web: '',
    rccm: '',
    num_statistique: '',
    capital: '',
    num_impot: '',
    forme_juridique: '',
    // Abonnement
    plan: 'starter',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const secteurs = [
    'Technologie / Informatique',
    'Conseil & Stratégie',
    'BTP / Immobilier',
    'Commerce & Distribution',
    'Santé & Médical',
    'Éducation & Formation',
    'Industrie & Manufacture',
    'Transport & Logistique',
    'Hôtellerie & Restauration',
    'Agriculture & Agroalimentaire',
    'Communication & Médias',
    'Finance & Assurance',
    'Autre',
  ];

  const formes = [
    'SARL',
    'SA',
    'SAS',
    'SASU',
    'EURL',
    'SNC',
    'GIE',
    'Entreprise individuelle',
    'Association',
    'ONG',
    'Autre'
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      // TODO: Appel API pour créer le compte
      console.log('Form data:', form);
      navigate('/login');
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00758D]/30 focus:border-[#00758D] transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Cover Image */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#00303C] via-[#00758D] to-[#8E0B56] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#DFC32F]/10 rounded-full blur-3xl -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8E0B56]/20 rounded-full blur-3xl translate-x-16 translate-y-16" />
        </div>

        <div className="relative z-10">
          <SingLogo size="lg" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-black text-white leading-tight">
            Gérez toute votre facturation depuis un seul endroit
          </h2>
          <div className="space-y-3">
            {[
              'Devis, Bons de commande, Factures',
              'Calcul automatique TPS + CSS',
              'Templates PDF professionnels',
              'Suivi des paiements en temps réel'
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-teal-100 text-sm">
                <CheckCircle className="w-4 h-4 text-[#DFC32F] flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <p className="text-white/80 text-sm italic">
              "SING-Facturation nous a permis de diviser par 3 le temps passé sur notre comptabilité client."
            </p>
            <p className="text-[#DFC32F] font-semibold text-xs mt-2">— Marie Obame, Tech Gabon</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-teal-200/60 text-xs">© 2026 SING-Facturation • Libreville, Gabon</p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-8 py-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <SingLogo size="md" />
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isDone
                        ? 'bg-[#00758D] text-white'
                        : isActive
                        ? 'bg-[#00303C] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    {s.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-8 rounded-full ${step > s.id ? 'bg-[#00758D]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <h1 className="text-2xl font-black text-[#00303C] mb-1">
            {step === 1 && 'Créez votre compte'}
            {step === 2 && 'Votre entreprise'}
            {step === 3 && 'Choisissez votre plan'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {step === 1 && 'Informations de connexion à votre espace personnel'}
            {step === 2 && 'Ces informations apparaîtront sur vos documents commerciaux'}
            {step === 3 && 'Commencez gratuitement, évoluez selon vos besoins'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* STEP 1 — Compte */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nom complet *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form.nom_complet}
                      onChange={e => set('nom_complet', e.target.value)}
                      required
                      placeholder="Jean Dupont"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Adresse email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      required
                      placeholder="jean@entreprise.com"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form.telephone}
                      onChange={e => set('telephone', e.target.value)}
                      required
                      placeholder="+241 XX XX XX XX"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      required
                      placeholder="Min. 8 caractères"
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirmer le mot de passe *</label>
                  <input
                    type="password"
                    value={form.confirm_password}
                    onChange={e => set('confirm_password', e.target.value)}
                    required
                  
                    className={inputClass}
                  />
                  {form.confirm_password && form.password !== form.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 — Entreprise */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Nom de l'entreprise *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={form.nom_entreprise}
                        onChange={e => set('nom_entreprise', e.target.value)}
                        required
                        placeholder="ACME S.A."
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Forme juridique *</label>
                    <select
                      value={form.forme_juridique}
                      onChange={e => set('forme_juridique', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Sélectionner...</option>
                      {formes.map(f => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Secteur d'activité *</label>
                    <select
                      value={form.secteur_activite}
                      onChange={e => set('secteur_activite', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Sélectionner...</option>
                      {secteurs.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}>Adresse du siège social *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={form.adresse_entreprise}
                        onChange={e => set('adresse_entreprise', e.target.value)}
                        required
                        placeholder="Rue, quartier, BP..."
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Ville *</label>
                    <input
                      value={form.ville}
                      onChange={e => set('ville', e.target.value)}
                      required
                      placeholder="Libreville"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Pays *</label>
                    <input
                      value={form.pays}
                      onChange={e => set('pays', e.target.value)}
                      required
                      placeholder="Gabon"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Téléphone entreprise *</label>
                    <input
                      value={form.telephone_entreprise}
                      onChange={e => set('telephone_entreprise', e.target.value)}
                      required
                      placeholder="+241 XX XX XX XX"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email professionnel *</label>
                    <input
                      type="email"
                      value={form.email_entreprise}
                      onChange={e => set('email_entreprise', e.target.value)}
                      required
                      placeholder="contact@entreprise.com"
                      className={inputClass}
                   />
                  </div>

                  <div>
                    <label className={labelClass}>Site Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={form.site_web}
                        onChange={e => set('site_web', e.target.value)}
                        placeholder="https://..."
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>N° RCCM</label>
                    <input
                      value={form.rccm}
                      onChange={e => set('rccm', e.target.value)}
                      placeholder="RG LBV 2024BXXXXX"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>N° Statistique (NIF)</label>
                    <input
                      value={form.num_statistique}
                      onChange={e => set('num_statistique', e.target.value)}
                      placeholder="XXXXXXX"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>N° Impôt</label>
                    <input
                      va
                      onChange={e => set('num_impot', e.target.value)}
                      placeholder="N° contribuable..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Capital social (FCFA)</label>
                    <input
                      value={form.capital}
                      onChange={e => set('capital', e.target.value)}
                      placeholder="1 000 000 FCFA"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Plan */}
            {step === 3 && (
              <div className="space-y-4">
                {plans.map(plan => (
                  <label
                    key={plan.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-[#00758D] bg-[#00758D]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => {
                        setSelectedPlan(plan.id);
                        set('plan', plan.id);
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#00303C]">{plan.name}</span>
                        {plan.recommended && (
                          <span className="text-xs bg-[#00758D] text-white px-2 py-0.5 rounded-full">
                            Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-[#DFC32F] font-semibold text-sm mb-2">{plan.price}</p>
                      <ul className="space-y-1">
                        {plan.features.map(f => (
                          <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-[#00758D]" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                ))}

                <div className="bg-[#EDEDED] rounded-xl p-4 text-xs text-gray-500">
                  <p>
                    Vous pouvez changer de plan à tout moment depuis votre espace. Les plans payants bénéficient de 14
                    jours d'essai gratuit sans engagement.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="cgu" required className="mt-0.5" />
                  <label htmlFor="cgu" className="text-xs text-gray-500">
                    J'accepte les{' '}
                    <a href="#" className="text-[#00758D] underline">
                      Conditions Générales d'Utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-[#00758D] underline">
                      Politique de Confidentialité
                    </a>{' '}
                    de SING-Facturation.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold text-sm hover:border-gray-300 transition-colors cursor-pointer"
                >
                  ← Retour
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-[#00758D] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#00303C] transition-colors cursor-pointer"
              >
                {step < 3 ? 'Continuer →' : 'Créer mon compte →'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Vous avez déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#00758D] font-semibold hover:text-[#00303C] cursor-pointer"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
