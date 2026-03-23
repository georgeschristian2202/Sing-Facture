import express from 'express';
import { PdfGenerationService } from '../services/pdfGenerationService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const pdfService = new PdfGenerationService();

/**
 * POST /api/pdf/generate/:type/:id
 * Génère un PDF pour un document
 */
router.post('/generate/:type/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const type = req.params.type.toUpperCase();
    const organisationId = req.user.organisationId;

    const validTypes = ['DEVIS', 'FACTURE', 'COMMANDE', 'LIVRAISON'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type. Must be one of: ' + validTypes.join(', ') 
      });
    }

    // Générer le PDF
    const pdfBuffer = await pdfService.generateDocumentPdf(
      documentId,
      organisationId,
      type as any
    );

    // Définir les headers pour le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_${documentId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Envoyer le PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF' });
  }
});

/**
 * GET /api/pdf/preview/:type/:id
 * Prévisualise un PDF dans le navigateur
 */
router.get('/preview/:type/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const type = req.params.type.toUpperCase();
    const organisationId = req.user.organisationId;

    const validTypes = ['DEVIS', 'FACTURE', 'COMMANDE', 'LIVRAISON'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type. Must be one of: ' + validTypes.join(', ') 
      });
    }

    // Générer le PDF
    const pdfBuffer = await pdfService.generateDocumentPdf(
      documentId,
      organisationId,
      type as any
    );

    // Définir les headers pour l'affichage dans le navigateur
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Envoyer le PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error previewing PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to preview PDF' });
  }
});

export default router;
