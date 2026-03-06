import prisma from '../config/database.js';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

/**
 * Service de génération de PDF
 * Équivalent VBA: Devis_Sing_Imprimer(), Facture_Enregistrer(), etc.
 */
export class PDFService {
  /**
   * Génère un PDF pour un document
   * @param documentId ID du document
   * @returns Buffer du PDF
   */
  static async generateDocumentPDF(documentId: number): Promise<Buffer> {
    // Récupérer le document complet
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        client: true,
        lignes: {
          include: {
            produit: true
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    });

    if (!document) {
      throw new Error('Document non trouvé');
    }

    // Récupérer les paramètres de l'entreprise
    const parametres = await prisma.parametres.findUnique({
      where: { id: 1 }
    });

    if (!parametres) {
      throw new Error('Paramètres non trouvés');
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // ============================================
        // EN-TÊTE ENTREPRISE
        // ============================================
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text(parametres.nomEntreprise, { align: 'center' });

        doc.fontSize(10)
           .font('Helvetica')
           .text(parametres.adresse, { align: 'center' })
           .text(`Tél: ${parametres.telephone} | Email: ${parametres.email}`, { align: 'center' })
           .text(`Site: ${parametres.siteWeb}`, { align: 'center' })
           .moveDown();

        doc.fontSize(9)
           .text(`RCCM: ${parametres.rccm} | Capital: ${parametres.capital}`, { align: 'center' })
           .moveDown(2);

        // ============================================
        // TYPE DE DOCUMENT
        // ============================================
        const typeLabels = {
          DEVIS: 'DEVIS',
          FACTURE: 'FACTURE',
          AVOIR: 'AVOIR'
        };

        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text(typeLabels[document.type], { align: 'center' })
           .moveDown();

        // ============================================
        // INFORMATIONS DOCUMENT
        // ============================================
        const y = doc.y;

        // Colonne gauche - Client
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('CLIENT', 50, y);

        doc.font('Helvetica')
           .text(document.client.nom, 50, y + 15)
           .text(document.client.adresse || '', 50, y + 30)
           .text(document.client.tel || '', 50, y + 45)
           .text(document.client.email || '', 50, y + 60);

        // Colonne droite - Infos document
        doc.font('Helvetica-Bold')
           .text('N° Document:', 350, y, { width: 100 })
           .text('Date:', 350, y + 15, { width: 100 });

        if (document.reference) {
          doc.text('Référence:', 350, y + 30, { width: 100 });
        }

        doc.font('Helvetica')
           .text(document.numero, 450, y)
           .text(new Date(document.date).toLocaleDateString('fr-FR'), 450, y + 15);

        if (document.reference) {
          doc.text(document.reference, 450, y + 30);
        }

        doc.moveDown(6);

        // ============================================
        // TABLEAU DES LIGNES
        // ============================================
        const tableTop = doc.y;
        const colCode = 50;
        const colDesignation = 100;
        const colQte = 380;
        const colPrixUnit = 430;
        const colTotal = 490;

        // En-tête du tableau
        doc.fontSize(9)
           .font('Helvetica-Bold')
           .text('Code', colCode, tableTop)
           .text('Désignation', colDesignation, tableTop)
           .text('Qté', colQte, tableTop)
           .text('Prix Unit.', colPrixUnit, tableTop)
           .text('Total HT', colTotal, tableTop);

        // Ligne de séparation
        doc.moveTo(50, tableTop + 15)
           .lineTo(545, tableTop + 15)
           .stroke();

        let currentY = tableTop + 25;

        // Lignes du document
        for (const ligne of document.lignes) {
          const code = ligne.produit?.code || '';
          const designation = ligne.designation;
          const quantite = ligne.quantite > 0 ? ligne.quantite.toString() : '';
          const prixUnit = ligne.prixUnitaire > 0 
            ? new Intl.NumberFormat('fr-FR').format(Number(ligne.prixUnitaire))
            : '';
          const total = ligne.totalHt > 0
            ? new Intl.NumberFormat('fr-FR').format(Number(ligne.totalHt))
            : '';

          // Déterminer si c'est une ligne principale (avec code et prix)
          const isMainLine = code !== '' && ligne.prixUnitaire > 0;

          if (isMainLine) {
            doc.font('Helvetica-Bold').fontSize(10);
          } else {
            doc.font('Helvetica').fontSize(9);
          }

          // Vérifier si on doit passer à une nouvelle page
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }

          doc.text(code, colCode, currentY, { width: 40 })
             .text(designation, colDesignation, currentY, { width: 270 })
             .text(quantite, colQte, currentY, { width: 40, align: 'center' })
             .text(prixUnit, colPrixUnit, currentY, { width: 50, align: 'right' })
             .text(total, colTotal, currentY, { width: 50, align: 'right' });

          currentY += isMainLine ? 20 : 15;
        }

        // ============================================
        // TOTAUX
        // ============================================
        currentY += 20;

        const totauxX = 400;
        const montantsX = 490;

        doc.font('Helvetica')
           .fontSize(10)
           .text('Solde HT:', totauxX, currentY)
           .text(new Intl.NumberFormat('fr-FR').format(Number(document.soldeHt)) + ' FCFA', 
                 montantsX, currentY, { align: 'right' });

        currentY += 15;

        if (Number(document.remise) > 0) {
          doc.text('Remise (9,5%):', totauxX, currentY)
             .text('- ' + new Intl.NumberFormat('fr-FR').format(Number(document.remise)) + ' FCFA', 
                   montantsX, currentY, { align: 'right' });
          currentY += 15;
        }

        doc.text('Sous-total:', totauxX, currentY)
           .text(new Intl.NumberFormat('fr-FR').format(Number(document.sousTotal)) + ' FCFA', 
                 montantsX, currentY, { align: 'right' });

        currentY += 15;

        doc.text('TPS (9,5%):', totauxX, currentY)
           .text('- ' + new Intl.NumberFormat('fr-FR').format(Number(document.tps)) + ' FCFA', 
                 montantsX, currentY, { align: 'right' });

        currentY += 15;

        doc.text('CSS (1%):', totauxX, currentY)
           .text('- ' + new Intl.NumberFormat('fr-FR').format(Number(document.css)) + ' FCFA', 
                 montantsX, currentY, { align: 'right' });

        currentY += 20;

        // Net à payer en gras
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .text('NET À PAYER:', totauxX, currentY)
           .text(new Intl.NumberFormat('fr-FR').format(Number(document.netAPayer)) + ' FCFA', 
                 montantsX, currentY, { align: 'right' });

        // ============================================
        // CONDITIONS DE PAIEMENT
        // ============================================
        if (document.conditionsPaiement) {
          doc.moveDown(2)
             .font('Helvetica')
             .fontSize(9)
             .text('Conditions de paiement:', 50)
             .text(document.conditionsPaiement, 50, doc.y, { width: 500 });
        }

        // ============================================
        // PIED DE PAGE - RIB
        // ============================================
        doc.fontSize(8)
           .font('Helvetica')
           .text('RIB UBA: ' + parametres.ribUba, 50, 750)
           .text('RIB AFG: ' + parametres.ribAfg, 50, 765);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Nettoie le nom de fichier (équivalent VBA: SanitizeFileName)
   */
  static sanitizeFileName(filename: string): string {
    const badChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
    let sanitized = filename;
    
    for (const char of badChars) {
      sanitized = sanitized.replace(new RegExp('\\' + char, 'g'), '-');
    }
    
    return sanitized;
  }
}
