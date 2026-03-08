import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import prisma from '../config/database.js';
import { formatCurrency } from './calculationService.js';

/**
 * Service de génération de PDF avec couleurs SING
 * Reproduit la logique VBA d'export PDF
 * 
 * Couleurs officielles SING:
 * - Primary (Pantone 228 C): #8E0B56 (Magenta/Rose)
 * - Secondary (Pantone 606 C): #DFC52F (Jaune)
 * - Accent (Pantone 3145 C): #00758D (Turquoise)
 * - Tertiary (Pantone 7553 C): #5C4621 (Marron)
 * - Complement (Pantone 547 C): #0C303C (Bleu foncé)
 */

const SING_COLORS = {
  primary: '#8E0B56',      // Pantone 228 C - Magenta/Rose
  secondary: '#DFC52F',    // Pantone 606 C - Jaune
  accent: '#00758D',       // Pantone 3145 C - Turquoise
  tertiary: '#5C4621',     // Pantone 7553 C - Marron
  complement: '#0C303C',   // Pantone 547 C - Bleu foncé
  black: '#1D1D1B',        // Pantone Neutral Black C
  gray: '#808080'
};

interface PDFGenerationOptions {
  documentId: number;
  type: 'DEVIS' | 'FACTURE' | 'AVOIR';
}

/**
 * Générer un PDF pour un document
 * @param options - Options de génération
 * @returns Buffer du PDF
 */
export async function generateDocumentPDF(options: PDFGenerationOptions): Promise<Buffer> {
  const { documentId } = options;

  // Récupérer le document avec toutes ses relations
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      client: true,
      lignes: {
        include: {
          produit: true
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

  // Créer le document PDF
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Buffer pour stocker le PDF
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  // Bande de couleur SING en haut
  doc.rect(0, 0, 595, 10).fill(SING_COLORS.primary);
  doc.rect(0, 10, 595, 5).fill(SING_COLORS.secondary);
  
  doc.fillColor(SING_COLORS.black);
  doc.moveDown(1);

  // En-tête entreprise avec couleurs SING
  doc.fontSize(20).font('Helvetica-Bold').fillColor(SING_COLORS.primary).text(parametres.nomEntreprise, { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor(SING_COLORS.black).text(parametres.adresse, { align: 'center' });
  doc.text(`Tél: ${parametres.telephone} | Email: ${parametres.email}`, { align: 'center' });
  doc.text(`RCCM: ${parametres.rccm} | Capital: ${parametres.capital}`, { align: 'center' });
  doc.moveDown(2);

  // Type de document avec couleur SING
  const typeLabel = document.type === 'DEVIS' ? 'DEVIS' : 
                    document.type === 'FACTURE' ? 'FACTURE' : 'AVOIR';
  doc.fontSize(16).font('Helvetica-Bold').fillColor(SING_COLORS.accent).text(typeLabel, { align: 'center' });
  doc.fontSize(12).fillColor(SING_COLORS.black).text(`N° ${document.numero}`, { align: 'center' });
  doc.fontSize(10).text(`Date: ${new Date(document.date).toLocaleDateString('fr-FR')}`, { align: 'center' });
  doc.moveDown(2);

  // Informations client avec accent SING
  doc.fontSize(12).font('Helvetica-Bold').fillColor(SING_COLORS.primary).text('CLIENT');
  doc.fontSize(10).font('Helvetica').fillColor(SING_COLORS.black);
  doc.text(document.client.nom);
  if (document.client.adresse) doc.text(document.client.adresse);
  if (document.client.tel) doc.text(`Tél: ${document.client.tel}`);
  if (document.client.email) doc.text(`Email: ${document.client.email}`);
  doc.moveDown(2);

  // Référence si présente
  if (document.reference) {
    doc.fontSize(10).text(`Référence: ${document.reference}`);
    doc.moveDown(1);
  }

  // Tableau des lignes
  const tableTop = doc.y;
  const colWidths = {
    code: 60,
    designation: 200,
    qte: 50,
    prixUnit: 80,
    total: 80
  };

  // En-têtes du tableau avec couleur SING
  doc.fontSize(10).font('Helvetica-Bold').fillColor(SING_COLORS.primary);
  let x = 50;
  doc.text('Code', x, tableTop);
  x += colWidths.code;
  doc.text('Désignation', x, tableTop);
  x += colWidths.designation;
  doc.text('Qté', x, tableTop);
  x += colWidths.qte;
  doc.text('Prix Unit.', x, tableTop);
  x += colWidths.prixUnit;
  doc.text('Total HT', x, tableTop);

  // Ligne de séparation avec couleur SING
  doc.strokeColor(SING_COLORS.accent).lineWidth(2);
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  doc.strokeColor(SING_COLORS.black).lineWidth(1);

  // Lignes du document
  let y = tableTop + 25;
  doc.font('Helvetica').fontSize(9).fillColor(SING_COLORS.black);

  for (const ligne of document.lignes) {
    x = 50;
    doc.text(ligne.produit.code, x, y, { width: colWidths.code });
    x += colWidths.code;
    doc.text(ligne.designation, x, y, { width: colWidths.designation });
    x += colWidths.designation;
    doc.text(ligne.quantite.toString(), x, y, { width: colWidths.qte, align: 'center' });
    x += colWidths.qte;
    doc.text(formatCurrency(Number(ligne.prixUnitaire)), x, y, { width: colWidths.prixUnit, align: 'right' });
    x += colWidths.prixUnit;
    doc.text(formatCurrency(Number(ligne.totalHt)), x, y, { width: colWidths.total, align: 'right' });
    
    y += 20;
    
    // Nouvelle page si nécessaire
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
  }

  // Ligne de séparation
  doc.strokeColor(SING_COLORS.accent).lineWidth(2);
  doc.moveTo(50, y).lineTo(550, y).stroke();
  doc.strokeColor(SING_COLORS.black).lineWidth(1);
  y += 20;

  // Totaux avec couleur SING
  doc.fontSize(10).font('Helvetica-Bold').fillColor(SING_COLORS.black);
  const totalsX = 400;
  
  doc.text('Solde HT:', totalsX, y);
  doc.text(formatCurrency(Number(document.soldeHt)), totalsX + 120, y, { align: 'right' });
  y += 20;

  if (Number(document.remise) > 0) {
    doc.text('Remise:', totalsX, y);
    doc.text(`- ${formatCurrency(Number(document.remise))}`, totalsX + 120, y, { align: 'right' });
    y += 20;
  }

  doc.text('Sous-total:', totalsX, y);
  doc.text(formatCurrency(Number(document.sousTotal)), totalsX + 120, y, { align: 'right' });
  y += 20;

  doc.text('TPS (9,5%):', totalsX, y);
  doc.text(`- ${formatCurrency(Number(document.tps))}`, totalsX + 120, y, { align: 'right' });
  y += 20;

  doc.text('CSS (1%):', totalsX, y);
  doc.text(`- ${formatCurrency(Number(document.css))}`, totalsX + 120, y, { align: 'right' });
  y += 20;

  // Net à payer avec couleur SING
  doc.fontSize(12).font('Helvetica-Bold').fillColor(SING_COLORS.primary);
  doc.text('NET À PAYER:', totalsX, y);
  doc.text(formatCurrency(Number(document.netAPayer)), totalsX + 120, y, { align: 'right' });
  y += 30;
  doc.fillColor(SING_COLORS.black);

  // Conditions de paiement
  if (document.conditionsPaiement) {
    doc.fontSize(9).font('Helvetica');
    doc.text('Conditions de paiement:', 50, y);
    doc.text(document.conditionsPaiement, 50, y + 15, { width: 500 });
    y += 40;
  }

  // RIB bancaires avec couleur SING
  doc.fontSize(9).font('Helvetica-Bold').fillColor(SING_COLORS.primary);
  doc.text('Coordonnées bancaires:', 50, y);
  y += 15;
  doc.font('Helvetica').fontSize(8).fillColor(SING_COLORS.black);
  doc.text(`UBA Gabon: ${parametres.ribUba}`, 50, y);
  y += 12;
  doc.text(`AFG Bank: ${parametres.ribAfg}`, 50, y);

  // Bande de couleur SING en bas
  doc.rect(0, 832, 595, 5).fill(SING_COLORS.secondary);
  doc.rect(0, 837, 595, 5).fill(SING_COLORS.primary);

  // Finaliser le PDF
  doc.end();

  // Attendre que le PDF soit généré
  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', reject);
  });
}

/**
 * Générer le nom de fichier pour un document
 */
export function generateFileName(numero: string, type: string): string {
  // Nettoyer les caractères interdits
  const sanitized = numero.replace(/[\\/:*?"<>|]/g, '-');
  return `${sanitized}.pdf`;
}
