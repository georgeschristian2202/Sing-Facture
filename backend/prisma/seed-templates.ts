/**
 * Seed pour créer des templates PDF de démonstration
 * 
 * Usage:
 *   npx tsx prisma/seed-templates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding templates PDF de démonstration...\n');

  try {
    // Récupérer la première organisation
    const organisation = await prisma.organisation.findFirst();

    if (!organisation) {
      console.log('⚠️  Aucune organisation trouvée. Créez d\'abord une organisation via l\'inscription.');
      return;
    }

    console.log(`✓ Organisation trouvée : ${organisation.nom}\n`);

    // Vérifier si des templates existent déjà
    const existingTemplates = await prisma.pdfTemplate.findMany({
      where: { organisationId: organisation.id }
    });

    if (existingTemplates.length > 0) {
      console.log(`⚠️  ${existingTemplates.length} template(s) existe(nt) déjà pour cette organisation.`);
      console.log('   Voulez-vous les supprimer et recréer ? (Ctrl+C pour annuler)\n');
      
      // Attendre 3 secondes
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('   Suppression des templates existants...');
      await prisma.pdfTemplate.deleteMany({
        where: { organisationId: organisation.id }
      });
      console.log('   ✓ Templates supprimés\n');
    }

    // Créer des templates de démonstration
    const templates = [
      {
        nom: 'Devis Standard SING',
        type: 'DEVIS',
        couleurPrimaire: '#003366',  // Bleu SING
        couleurSecondaire: '#FDB913', // Jaune SING
        couleurTexte: '#000000',
        police: 'Helvetica',
        parDefaut: true,
        description: 'Template par défaut pour les devis'
      },
      {
        nom: 'Facture Professionnelle',
        type: 'FACTURE',
        couleurPrimaire: '#1E40AF',  // Bleu plus foncé
        couleurSecondaire: '#FBBF24', // Jaune plus clair
        couleurTexte: '#111827',
        police: 'Arial',
        parDefaut: true,
        description: 'Template professionnel pour les factures'
      },
      {
        nom: 'Bon de Commande Moderne',
        type: 'COMMANDE',
        couleurPrimaire: '#059669',  // Vert
        couleurSecondaire: '#FCD34D', // Jaune
        couleurTexte: '#1F2937',
        police: 'Helvetica',
        parDefaut: true,
        description: 'Template moderne pour les bons de commande'
      },
      {
        nom: 'Bon de Livraison Simple',
        type: 'LIVRAISON',
        couleurPrimaire: '#7C3AED',  // Violet
        couleurSecondaire: '#A78BFA', // Violet clair
        couleurTexte: '#1F2937',
        police: 'Arial',
        parDefaut: true,
        description: 'Template simple pour les bons de livraison'
      },
      {
        nom: 'Devis Élégant',
        type: 'DEVIS',
        couleurPrimaire: '#0F172A',  // Bleu très foncé
        couleurSecondaire: '#F59E0B', // Orange
        couleurTexte: '#1E293B',
        police: 'Times New Roman',
        parDefaut: false,
        description: 'Template élégant alternatif pour les devis'
      }
    ];

    console.log('Création des templates...\n');

    for (const template of templates) {
      const created = await prisma.pdfTemplate.create({
        data: {
          organisationId: organisation.id,
          nom: template.nom,
          type: template.type as any,
          fichierOriginal: `/uploads/templates/demo_${template.type.toLowerCase()}.pdf`,
          couleurPrimaire: template.couleurPrimaire,
          couleurSecondaire: template.couleurSecondaire,
          couleurTexte: template.couleurTexte,
          police: template.police,
          marges: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          actif: true,
          parDefaut: template.parDefaut
        }
      });

      const defaultBadge = created.parDefaut ? '⭐ PAR DÉFAUT' : '';
      console.log(`✓ ${created.nom} (${created.type}) ${defaultBadge}`);
      console.log(`  Couleurs: ${created.couleurPrimaire} / ${created.couleurSecondaire}`);
      console.log(`  Police: ${created.police}\n`);
    }

    console.log('=====================================');
    console.log('✓ Seed terminé avec succès !');
    console.log('=====================================\n');

    console.log('Templates créés :');
    const allTemplates = await prisma.pdfTemplate.findMany({
      where: { organisationId: organisation.id },
      orderBy: { type: 'asc' }
    });

    const groupedByType = allTemplates.reduce((acc, t) => {
      if (!acc[t.type]) acc[t.type] = [];
      acc[t.type].push(t);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(groupedByType).forEach(([type, temps]) => {
      console.log(`\n${type}:`);
      temps.forEach(t => {
        console.log(`  - ${t.nom} ${t.parDefaut ? '⭐' : ''}`);
      });
    });

    console.log('\n📝 Note importante :');
    console.log('Ces templates sont des exemples de démonstration.');
    console.log('Les fichiers PDF réels n\'existent pas encore.');
    console.log('Pour utiliser le système :');
    console.log('1. Uploadez vos propres templates PDF via l\'interface');
    console.log('2. Ou supprimez ces templates de démo et créez les vôtres\n');

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
