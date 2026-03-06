import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initialisation de la base de données...\n');

  // ============================================
  // UTILISATEURS
  // ============================================
  console.log('👤 Création des utilisateurs...');

  const users = [
    {
      email: 'admin@sing.ga',
      password: await bcrypt.hash('admin123', 10),
      nom: 'Administrateur SING',
      role: 'ADMIN' as const
    },
    {
      email: 'demo@sing.ga',
      password: await bcrypt.hash('demo123', 10),
      nom: 'Utilisateur Demo',
      role: 'USER' as const
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
    console.log(`  ✓ ${user.nom} (${user.email})`);
  }

  // ============================================
  // CLIENTS
  // ============================================
  console.log('\n🏢 Création des clients...');

  const clients = [
    {
      nom: 'SING S.A.',
      adresse: 'BP. 2280, Centre Ville, Libreville',
      tel: '+241 74 13 71 03',
      email: 'info@sing.ga',
      pays: 'Gabon'
    },
    {
      nom: 'Emmanuel Edgardo',
      adresse: '10, rue Cambacérès 75008 Paris',
      tel: '+33 1 42 66 68 49',
      email: 'emmanuel.edgardo@example.com',
      pays: 'France'
    },
    {
      nom: 'Gracia Cestin',
      adresse: 'BP 65054 31033 Toulouse',
      tel: '+33 1 58 22 17 10',
      email: 'gracia.cestin@example.com',
      pays: 'France'
    },
    {
      nom: 'Ministère de l\'Économie',
      adresse: 'Boulevard Triomphal, Libreville',
      tel: '+241 01 76 54 32',
      email: 'contact@economie.gouv.ga',
      pays: 'Gabon'
    },
    {
      nom: 'Total Gabon',
      adresse: 'Boulevard de l\'Indépendance, Libreville',
      tel: '+241 01 77 00 00',
      email: 'contact@total.ga',
      pays: 'Gabon'
    },
    {
      nom: 'Banque Gabonaise de Développement',
      adresse: 'Avenue du Colonel Parant, Libreville',
      tel: '+241 01 76 24 24',
      email: 'info@bgd.ga',
      pays: 'Gabon'
    }
  ];

  for (const client of clients) {
    await prisma.client.create({ data: client });
    console.log(`  ✓ ${client.nom}`);
  }

  // ============================================
  // PRODUITS
  // ============================================
  console.log('\n📦 Création des produits...');

  const produits = [
    // Programme
    {
      code: 'PROG-001',
      label: 'Assistance technique - Programme Crysalis',
      prix: 1119,
      categorie: 'Programme',
      description: 'Assistance technique complète pour le programme Crysalis incluant suivi, formation et support'
    },
    {
      code: 'PROG-002',
      label: 'Assistance technique – Programme 3 mois – 5 bénéficiaires',
      prix: 8886,
      categorie: 'Programme',
      description: 'Programme d\'assistance sur 3 mois pour 5 bénéficiaires avec accompagnement personnalisé'
    },
    {
      code: 'PROG-003',
      label: 'Organisation comité de sélection et attribution de fonds',
      prix: 500074,
      categorie: 'Programme',
      description: 'Organisation complète du comité de sélection, évaluation des dossiers et attribution de fonds'
    },
    {
      code: 'PROG-004',
      label: 'Programme d\'incubation 6 mois',
      prix: 350000,
      categorie: 'Programme',
      description: 'Programme complet d\'incubation sur 6 mois avec mentorat et ressources'
    },

    // SING Logiciels
    {
      code: 'LOG-001',
      label: 'Développement application web sur mesure',
      prix: 250000,
      categorie: 'SING Logiciels',
      description: 'Développement d\'une application web personnalisée selon vos besoins'
    },
    {
      code: 'LOG-002',
      label: 'Développement application mobile (iOS/Android)',
      prix: 450000,
      categorie: 'SING Logiciels',
      description: 'Application mobile native pour iOS et Android'
    },
    {
      code: 'LOG-003',
      label: 'Service Cloud mensuel - Starter',
      prix: 15000,
      categorie: 'SING Logiciels',
      description: 'Hébergement cloud, maintenance et support technique - Formule Starter'
    },
    {
      code: 'LOG-004',
      label: 'Service Cloud mensuel - Business',
      prix: 35000,
      categorie: 'SING Logiciels',
      description: 'Hébergement cloud, maintenance et support technique - Formule Business'
    },
    {
      code: 'LOG-005',
      label: 'Service Cloud mensuel - Enterprise',
      prix: 75000,
      categorie: 'SING Logiciels',
      description: 'Hébergement cloud, maintenance et support technique - Formule Enterprise'
    },
    {
      code: 'LOG-006',
      label: 'Maintenance et support annuel',
      prix: 120000,
      categorie: 'SING Logiciels',
      description: 'Contrat de maintenance et support technique pour 12 mois'
    },

    // SING Conseil
    {
      code: 'CONS-001',
      label: 'Innovation Day',
      prix: 75000,
      categorie: 'SING Conseil',
      description: 'Journée d\'innovation pour votre entreprise avec ateliers et brainstorming'
    },
    {
      code: 'CONS-002',
      label: 'Retraite d\'Innovation Stratégique (2 jours)',
      prix: 150000,
      categorie: 'SING Conseil',
      description: 'Retraite stratégique de 2 jours pour définir votre vision et stratégie d\'innovation'
    },
    {
      code: 'CONS-003',
      label: 'Audit digital et transformation numérique',
      prix: 200000,
      categorie: 'SING Conseil',
      description: 'Audit complet de votre maturité digitale avec plan de transformation'
    },
    {
      code: 'CONS-004',
      label: 'Formation équipe - Design Thinking',
      prix: 95000,
      categorie: 'SING Conseil',
      description: 'Formation de 2 jours au Design Thinking pour vos équipes'
    },
    {
      code: 'CONS-005',
      label: 'Accompagnement stratégique mensuel',
      prix: 125000,
      categorie: 'SING Conseil',
      description: 'Accompagnement stratégique mensuel avec sessions de coaching'
    },

    // Incubateur
    {
      code: 'INCUB-001',
      label: 'Mise à disposition de salle (journée)',
      prix: 25000,
      categorie: 'Incubateur',
      description: 'Location de salle équipée pour événements, formations ou réunions'
    },
    {
      code: 'INCUB-002',
      label: 'Coworking mensuel - Poste fixe',
      prix: 50000,
      categorie: 'Incubateur',
      description: 'Accès coworking avec poste fixe dédié pour 1 mois'
    },
    {
      code: 'INCUB-003',
      label: 'Coworking mensuel - Poste flexible',
      prix: 35000,
      categorie: 'Incubateur',
      description: 'Accès coworking avec poste flexible pour 1 mois'
    },
    {
      code: 'INCUB-004',
      label: 'Bureau privé mensuel',
      prix: 150000,
      categorie: 'Incubateur',
      description: 'Bureau privé équipé pour 2-4 personnes'
    },
    {
      code: 'INCUB-005',
      label: 'Domiciliation commerciale annuelle',
      prix: 180000,
      categorie: 'Incubateur',
      description: 'Service de domiciliation avec gestion du courrier'
    },

    // Services additionnels
    {
      code: 'SERV-001',
      label: 'Formation personnalisée (jour)',
      prix: 85000,
      categorie: 'Formation',
      description: 'Formation sur mesure adaptée à vos besoins'
    },
    {
      code: 'SERV-002',
      label: 'Consulting technique (jour)',
      prix: 95000,
      categorie: 'Consulting',
      description: 'Expertise technique pour vos projets'
    },
    {
      code: 'SERV-003',
      label: 'Support technique premium (mois)',
      prix: 45000,
      categorie: 'Support',
      description: 'Support technique prioritaire avec SLA garanti'
    }
  ];

  const categories = new Set<string>();
  for (const produit of produits) {
    await prisma.produit.create({ data: produit });
    categories.add(produit.categorie);
    console.log(`  ✓ ${produit.code} - ${produit.label}`);
  }

  // ============================================
  // PARAMÈTRES
  // ============================================
  console.log('\n⚙️  Création des paramètres...');

  await prisma.parametres.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  });
  console.log('  ✓ Paramètres par défaut créés');

  // ============================================
  // STATISTIQUES
  // ============================================
  console.log('\n📊 Statistiques:');
  console.log(`  • ${users.length} utilisateurs créés`);
  console.log(`  • ${clients.length} clients créés`);
  console.log(`  • ${produits.length} produits créés`);
  console.log(`  • ${categories.size} catégories: ${Array.from(categories).join(', ')}`);

  // ============================================
  // INFORMATIONS DE CONNEXION
  // ============================================
  console.log('\n🔐 Comptes de test créés:');
  console.log('\n  Administrateur:');
  console.log('    Email: admin@sing.ga');
  console.log('    Mot de passe: admin123');
  console.log('\n  Utilisateur:');
  console.log('    Email: demo@sing.ga');
  console.log('    Mot de passe: demo123');

  console.log('\n✅ Base de données initialisée avec succès!');
  console.log('\n🚀 Vous pouvez maintenant démarrer le serveur avec: npm run dev\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
