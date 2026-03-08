import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed des packs SING...');

  // Récupérer la première organisation (pour le test)
  const org = await prisma.organisation.findFirst();
  
  if (!org) {
    console.error('❌ Aucune organisation trouvée. Créez d'abord un compte.');
    return;
  }

  console.log(`✅ Organisation trouvée: ${org.nom}`);

  // Packs basés sur les captures d'écran Excel
  const packsData = [
    {
      code: 'S1',
      descCourte: 'Assistance informatique - SING Réseau',
      prixUnitaire: 1187500,
      sousService: 'Assistance informatique - SING Réseau',
      details: [
        'Assistance Economique web',
        'Développement informatique',
        'Service Conseil',
        'Gestion Messagerie',
        'Autre logiciel',
        'Assistance Matériel-Gestion'
      ]
    },
    {
      code: 'S2',
      descCourte: 'Assistance technique - SING conseil',
      prixUnitaire: 836875,
      sousService: 'Assistance technique - SING conseil',
      details: [
        'Mobilisation Day',
        'Mise d\'application Conseil',
        'Mise d\'application Expertise',
        'Mise d\'application Consulting',
        'Assistance technique Programme Culture'
      ]
    },
    {
      code: 'S3',
      descCourte: 'Immatriculation - mise à disposition assurance',
      prixUnitaire: 500000,
      sousService: 'Immatriculation - mise à disposition assurance',
      details: [
        'Mise d\'application Conseil',
        'Mise d\'application Expertise',
        'Mise d\'application Consulting',
        'Autre programme'
      ]
    },
    {
      code: 'S1-1',
      descCourte: 'Identification des entrepreneurs',
      prixUnitaire: 250000,
      sousService: 'Assistance technique Programme',
      details: [
        'Organisation et animation des sessions d\'informations',
        'Conception et configuration des grilles de notation',
        'Organisation des prédélections'
      ]
    },
    {
      code: 'S2-1',
      descCourte: 'Mobilisation et préparation du jury',
      prixUnitaire: 180000,
      sousService: 'Assistance technique Programme',
      details: [
        'Organisation logistique du demoday',
        'Gestion du demoday',
        'Rapport de synthèse'
      ]
    },
    {
      code: 'S2-2',
      descCourte: 'Communication avec les entrepreneurs',
      prixUnitaire: 150000,
      sousService: 'Assistance technique Programme',
      details: [
        'Suivi financier et commercial - 2 mois',
        'Suivi financier et commercial - 1 mois'
      ]
    },
    {
      code: 'S3-1',
      descCourte: 'Entretien et sélection',
      prixUnitaire: 120000,
      sousService: 'Assistance technique Programme',
      details: [
        'Mise en place des feuilles de route'
      ]
    }
  ];

  // Créer les packs
  for (const packData of packsData) {
    console.log(`\n📦 Création du pack ${packData.code}...`);
    
    try {
      const pack = await prisma.pack.create({
        data: {
          code: packData.code,
          descCourte: packData.descCourte,
          prixUnitaire: packData.prixUnitaire,
          sousService: packData.sousService,
          organisationId: org.id,
          actif: true,
          details: {
            create: packData.details.map((detail, index) => ({
              ordre: index + 1,
              descriptionLongue: detail
            }))
          }
        },
        include: {
          details: true
        }
      });

      console.log(`✅ Pack ${pack.code} créé avec ${pack.details.length} détails`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️  Pack ${packData.code} existe déjà, ignoré`);
      } else {
        console.error(`❌ Erreur création pack ${packData.code}:`, error.message);
      }
    }
  }

  console.log('\n✅ Seed des packs terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
