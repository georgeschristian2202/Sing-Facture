import express from 'express';
import multer from 'multer';
import { TemplateService } from '../services/templateService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const templateService = new TemplateService();

// Configuration de multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

/**
 * POST /api/templates/upload
 * Upload et analyse d'un template PDF
 */
router.post('/upload', authenticateToken, upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { nom, type } = req.body;
    const organisationId = req.user.organisationId;
    const userId = req.user.userId;

    if (!nom || !type) {
      return res.status(400).json({ error: 'Missing required fields: nom, type' });
    }

    const validTypes = ['DEVIS', 'FACTURE', 'COMMANDE', 'LIVRAISON'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be one of: ' + validTypes.join(', ') });
    }

    const template = await templateService.saveTemplate(
      organisationId,
      nom,
      type,
      req.file.buffer,
      userId
    );

    res.json({
      message: 'Template uploaded successfully',
      template: {
        id: template.id,
        nom: template.nom,
        type: template.type,
        couleurPrimaire: template.couleurPrimaire,
        couleurSecondaire: template.couleurSecondaire,
        couleurTexte: template.couleurTexte,
        police: template.police,
        actif: template.actif,
        parDefaut: template.parDefaut,
        createdAt: template.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error uploading template:', error);
    res.status(500).json({ error: error.message || 'Failed to upload template' });
  }
});

/**
 * GET /api/templates
 * Liste tous les templates de l'organisation
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { type } = req.query;

    const templates = await templateService.listTemplates(
      organisationId,
      type as string | undefined
    );

    res.json(templates);
  } catch (error: any) {
    console.error('Error listing templates:', error);
    res.status(500).json({ error: error.message || 'Failed to list templates' });
  }
});

/**
 * PUT /api/templates/:id/default
 * Définit un template comme par défaut
 */
router.put('/:id/default', authenticateToken, async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    const organisationId = req.user.organisationId;

    const template = await templateService.setDefaultTemplate(templateId, organisationId);

    res.json({
      message: 'Template set as default',
      template
    });
  } catch (error: any) {
    console.error('Error setting default template:', error);
    res.status(500).json({ error: error.message || 'Failed to set default template' });
  }
});

/**
 * PUT /api/templates/:id
 * Met à jour un template
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    const organisationId = req.user.organisationId;
    const { nom, couleurPrimaire, couleurSecondaire, couleurTexte, police, actif } = req.body;

    // Vérifier que le template appartient à l'organisation
    const existingTemplate = await templateService.listTemplates(organisationId);
    const template = existingTemplate.find(t => t.id === templateId);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Mettre à jour le template
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const updatedTemplate = await prisma.pdfTemplate.update({
      where: { id: templateId },
      data: {
        ...(nom && { nom }),
        ...(couleurPrimaire && { couleurPrimaire }),
        ...(couleurSecondaire && { couleurSecondaire }),
        ...(couleurTexte && { couleurTexte }),
        ...(police && { police }),
        ...(actif !== undefined && { actif })
      }
    });

    res.json({
      message: 'Template updated successfully',
      template: updatedTemplate
    });
  } catch (error: any) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: error.message || 'Failed to update template' });
  }
});

/**
 * DELETE /api/templates/:id
 * Supprime un template
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    const organisationId = req.user.organisationId;

    await templateService.deleteTemplate(templateId, organisationId);

    res.json({ message: 'Template deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: error.message || 'Failed to delete template' });
  }
});

export default router;
