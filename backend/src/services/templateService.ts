import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';

const prisma = new PrismaClient();

// Dossier de stockage des templates
const TEMPLATES_DIR = path.join(process.cwd(), 'uploads', 'templates');

// Créer le dossier s'il n'existe pas
async function ensureTemplatesDir() {
  try {
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur création dossier templates:', error);
  }
}

/**
 * Extraire les couleurs dominantes d'un PDF
 */
async function extractColors(pdfBuffer: Buffer): Promise<{ primary: string; secondary: string; text: string }> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    // Analyse basique - à améliorer avec une vraie extraction de couleurs
    // Pour l'instant, on retourne des valeurs par défaut
    return {
      primary: '#003366',    // Bleu foncé par défaut
      secondary: '#FFD700',  // Or par défaut
      text: '#333333'        // Gris foncé par défaut
    };
  } catch (error) {
    console.error('Erreur extraction couleurs:', error);
    return {
      primary: '#003366',
      secondary: '#FFD700',
      text: '#333333'
    };
  }
}

/**
 * Extraire les polices utilisées dans le PDF
 */
async function extractFonts(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(pdfBuffer);
    // Analyse basique du contenu
    // Pour l'instant, on retourne une police par défaut
    return 'Arial, sans-serif';
  } catch (error) {
    console.error('Erreur extraction polices:', error);
    return 'Arial, sans-serif';
  }
}

/**
 * Analyser la structure du PDF (marges, sections)
 */
async function analyzeLayout(pdfBuffer: Buffer): Promise<any> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    const { width, height } = firstPage.getSize();
    
    return {
      marges: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      },
      pageSize: {
        width,
        height
      },
      sections: {
        header: { height: 150 },
        body: { minHeight: 400 },
        footer: { height: 100 }
      }
    };
  } catch (error) {
    console.error('Erreur analyse layout:', error);
    return {
      marges: { top: 50, right: 50, bottom: 50, left: 50 },
      pageSize: { width: 595, height: 842 }, // A4
      sections: {
        header: { height: 150 },
        body: { minHeight: 400 },
        footer: { height: 100 }
      }
    };
  }
}

/**
 * Uploader et analyser un template PDF
 */
export async function uploadTemplate(
  organisationId: number,
  nom: string,
  type: string,
  file: Express.Multer.File
) {
  await ensureTemplatesDir();
  
  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const filename = `template_${organisationId}_${type}_${timestamp}.pdf`;
  const filepath = path.join(TEMPLATES_DIR, filename);
  
  // Sauvegarder le fichier
  await fs.writeFile(filepath, file.buffer);
  
  // Analyser le PDF
  const colors = await extractColors(file.buffer);
  const font = await extractFonts(file.buffer);
  const layout = await analyzeLayout(file.buffer);
  
  // Créer l'entrée en base de données
  const template = await prisma.pdfTemplate.create({
    data: {
      organisationId,
      nom,
      type: type as any,
      fichierOriginal: filepath,
      couleurPrimaire: colors.primary,
      couleurSecondaire: colors.secondary,
      couleurTexte: colors.text,
      police: font,
      marges: layout.marges,
      sections: layout.sections,
      actif: true,
      parDefaut: false
    }
  });
  
  return template;
}

/**
 * Récupérer tous les templates d'une organisation
 */
export async function getTemplates(organisationId: number, type?: string) {
  const where: any = { organisationId, actif: true };
  if (type) {
    where.type = type;
  }
  
  return await prisma.pdfTemplate.findMany({
    where,
    orderBy: [
      { parDefaut: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

/**
 * Récupérer un template par ID
 */
export async function getTemplateById(id: number, organisationId: number) {
  return await prisma.pdfTemplate.findFirst({
    where: {
      id,
      organisationId
    }
  });
}

/**
 * Définir un template comme par défaut
 */
export async function setDefaultTemplate(id: number, organisationId: number, type: string) {
  // Retirer le flag par défaut des autres templates du même type
  await prisma.pdfTemplate.updateMany({
    where: {
      organisationId,
      type: type as any,
      parDefaut: true
    },
    data: {
      parDefaut: false
    }
  });
  
  // Définir le nouveau template par défaut
  return await prisma.pdfTemplate.update({
    where: { id },
    data: { parDefaut: true }
  });
}

/**
 * Supprimer un template
 */
export async function deleteTemplate(id: number, organisationId: number) {
  const template = await prisma.pdfTemplate.findFirst({
    where: { id, organisationId }
  });
  
  if (!template) {
    throw new Error('Template non trouvé');
  }
  
  // Supprimer le fichier
  try {
    await fs.unlink(template.fichierOriginal);
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
  }
  
  // Supprimer l'entrée en base
  return await prisma.pdfTemplate.delete({
    where: { id }
  });
}

/**
 * Mettre à jour les styles d'un template manuellement
 */
export async function updateTemplateStyles(
  id: number,
  organisationId: number,
  styles: {
    couleurPrimaire?: string;
    couleurSecondaire?: string;
    couleurTexte?: string;
    police?: string;
    marges?: any;
  }
) {
  return await prisma.pdfTemplate.update({
    where: { id },
    data: styles
  });
}
