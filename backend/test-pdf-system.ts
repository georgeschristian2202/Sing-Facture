/**
 * Script de test pour le système de templates PDF
 * 
 * Usage:
 *   npx tsx test-pdf-system.ts
 */

import { PrismaClient } from '@prisma/client';
import { TemplateService } from './src/services/templateService';
import { PdfGenerationService } from './src/services/pdfGenerationService';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();
const templateService = new TemplateService();
const pdfService = new PdfGenerationService();

async function main() {
  console.log('🧪 Test du Système de Templates PDF\n');
  console.log('=====================================\n');

  try {
    // Test 1 : Vérifier la connexion à la base de données
    console.log('Test 1 : Connexion à la base de données...');
    await prisma.$connect();
    console.log('✓ Connexion réussie\n');

    // Test 2 : Vérifier que la table pdf_templates existe
    console.log('Test 2 : Vérification de la table pdf_templates...');
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pdf_templates'
      );
    `;
    console.log('✓ Table pdf_templates existe\n');

    // Test 3 : Lister les templates existants
    console.log('Test 3 : Liste des templates...');
    const templates = await prisma.pdfTemplate.findMany();
    console.log(`✓ ${templates.length} template(s) trouvé(s)`);
    templates.forEach(t => {
      console.log(`  - ${t.nom} (${t.type}) ${t.parDefaut ? '[PAR DÉFAUT]' : ''}`);
    });
    console.log('');

    // Test 4 : Vérifier le dossier d'upload
    console.log('Test 4 : Vérification du dossier d\'upload...');
    const uploadDir = path.join(__dirname, 'uploads', 'templates');
    try {
      await fs.access(uploadDir);
      console.log(`✓ Dossier d'upload existe : ${uploadDir}\n`);
    } catch {
      console.log(`⚠ Dossier d'upload n'existe pas, création...`);
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`✓ Dossier créé : ${uploadDir}\n`);
    }

    // Test 5 : Vérifier qu'il y a au moins une organisation
    console.log('Test 5 : Vérification des organisations...');
    const organisations = await prisma.organisation.findMany({
      take: 1
    });
    
    if (organisations.length === 0) {
      console.log('⚠ Aucune organisation trouvée');
      console.log('  Créez une organisation via l\'inscription\n');
    } else {
      console.log(`✓ Organisation trouvée : ${organisations[0].nom}\n`);

      // Test 6 : Vérifier qu'il y a au moins un document
      console.log('Test 6 : Vérification des documents...');
      const documents = await prisma.document.findMany({
        where: { organisationId: organisations[0].id },
        take: 1,
        include: {
          client: true,
          lignes: true
        }
      });

      if (documents.length === 0) {
        console.log('⚠ Aucun document trouvé');
        console.log('  Créez un devis ou une facture pour tester la génération PDF\n');
      } else {
        console.log(`✓ Document trouvé : ${documents[0].numero} (${documents[0].type})`);
        console.log(`  Client : ${documents[0].client.nom}`);
        console.log(`  Lignes : ${documents[0].lignes.length}`);
        console.log(`  Montant : ${documents[0].netAPayer} FCFA\n`);

        // Test 7 : Tester la génération de PDF (optionnel)
        const shouldGeneratePdf = process.argv.includes('--generate-pdf');
        
        if (shouldGeneratePdf) {
          console.log('Test 7 : Génération d\'un PDF de test...');
          try {
            const pdfBuffer = await pdfService.generateDocumentPdf(
              documents[0].id,
              organisations[0].id,
              documents[0].type as any
            );

            const testPdfPath = path.join(__dirname, 'test-output.pdf');
            await fs.writeFile(testPdfPath, pdfBuffer);
            console.log(`✓ PDF généré avec succès : ${testPdfPath}`);
            console.log(`  Taille : ${(pdfBuffer.length / 1024).toFixed(2)} KB\n`);
          } catch (error: any) {
            console.log(`✗ Erreur lors de la génération du PDF : ${error.message}\n`);
          }
        } else {
          console.log('Test 7 : Génération de PDF (skippé)');
          console.log('  Utilisez --generate-pdf pour tester la génération\n');
        }
      }
    }

    // Test 8 : Vérifier les paramètres
    console.log('Test 8 : Vérification des paramètres...');
    if (organisations.length > 0) {
      const parametres = await prisma.parametres.findUnique({
        where: { organisationId: organisations[0].id }
      });

      if (parametres) {
        console.log('✓ Paramètres trouvés');
        console.log(`  Entreprise : ${parametres.nomEntreprise}`);
        console.log(`  TPS : ${parametres.tauxTps}`);
        console.log(`  CSS : ${parametres.tauxCss}\n`);
      } else {
        console.log('⚠ Aucun paramètre trouvé\n');
      }
    }

    // Résumé
    console.log('=====================================');
    console.log('✓ Tests terminés avec succès !');
    console.log('=====================================\n');

    console.log('Prochaines étapes :');
    console.log('1. Démarrer le serveur : npm run dev');
    console.log('2. Se connecter à l\'application');
    console.log('3. Aller dans "Templates PDF"');
    console.log('4. Uploader un template PDF');
    console.log('5. Générer un document PDF\n');

  } catch (error: any) {
    console.error('\n✗ Erreur lors des tests :', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
