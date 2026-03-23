import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';

interface TemplateStyle {
  couleurPrimaire?: string;
  couleurSecondaire?: string;
  couleurTexte?: string;
  police?: string;
  marges?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Service d'analyse et d'extraction de styles depuis un PDF template
 */
export class PdfTemplateService {
  private uploadsDir = path.join(process.cwd(), 'uploads', 'templates');

  constructor() {
    this.ensureUploadDir();
  }

  /**
   * Crée le dossier uploads si nécessaire
   */
  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Erreur création dossier uploads:', error);
    }
  }

  /**
   * Analyse un PDF et extrait ses styles
   */
  async analyzeTemplate(filePath: string): Promise<TemplateStyle> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Analyse avec pdf-parse pour extraire le contenu
      const pdfData = await pdfParse(fileBuffer);
      
      // Analyse avec pdf-lib pour extraire les métadonnées
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Extraction des couleurs (analyse basique du contenu)
      const colors = this.extractColors(pdfData.text);
      
      // Extraction des polices (depuis les métadonnées)
      const fonts = await this.extractFonts(pdfDoc);

      // Calcul des marges (estimation basée sur les dimensions)
      const marges = this.estimateMargins(width, height);

      return {
        couleurPrimaire: colors.primary || '#003366',
        couleurSecondaire: colors.secondary || '#FFD700',
        couleurTexte: colors.text || '#000000',
        police: fonts[0] || 'Arial',
        marges
      };
    } catch (error) {
      console.error('Erreur analyse template:', error);
      throw new Error('Impossible d\'analyser le template PDF');
    }
  }

  /**
   * Extrait les couleurs dominantes du PDF
   * Note: Analyse basique - peut être améliorée avec des librairies spécialisées
   */
  private extractColors(text: string): { primary?: string; secondary?: string; text?: string } {
    // Recherche de codes couleur hex dans le texte
    const hexPattern = /#[0-9A-Fa-f]{6}/g;
    const matches = text.match(hexPattern);
    
    if (matches && matches.length > 0) {
      return {
        primary: matches[0],
        secondary: matches[1] || matches[0],
        text: '#000000'
      };
    }

    // Couleurs par défaut si aucune trouvée
    return {
      primary: '#003366',
      secondary: '#FFD700',
      text: '#000000'
    };
  }

  /**
   * Extrait les polices utilisées dans le PDF
   */
  private async extractFonts(pdfDoc: PDFDocument): Promise<string[]> {
    try {
      // Récupération des polices embarquées
      const fonts: string[] = [];
      
      // Note: pdf-lib ne fournit pas directement la liste des polices
      // On retourne des polices standards
      fonts.push('Helvetica', 'Arial', 'Times-Roman');
      
      return fonts;
    } catch (error) {
      console.error('Erreur extraction polices:', error);
      return ['Arial'];
    }
  }

  /**
   * Estime les marges du document
   */
  private estimateMargins(width: number, height: number): { top: number; right: number; bottom: number; left: number } {
    // Marges standard (10% de chaque côté)
    return {
      top: Math.round(height * 0.1),
      right: Math.round(width * 0.1),
      bottom: Math.round(height * 0.1),
      left: Math.round(width * 0.1)
    };
  }

  /**
   * Sauvegarde un fichier uploadé
   */
  async saveUploadedFile(file: Express.Multer.File, organisationId: number, type: string): Promise<string> {
    const filename = `template_${organisationId}_${type}_${Date.now()}.pdf`;
    const filepath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(filepath, file.buffer);
    
    return filepath;
  }

  /**
   * Supprime un fichier template
   */
  async deleteTemplate(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Erreur suppression template:', error);
    }
  }

  /**
   * Vérifie si un fichier est un PDF valide
   */
  async isValidPdf(file: Express.Multer.File): Promise<boolean> {
    try {
      await PDFDocument.load(file.buffer);
      return true;
    } catch {
      return false;
    }
  }
}

export const pdfTemplateService = new PdfTemplateService();
