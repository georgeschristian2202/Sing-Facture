import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateDocument } from '../services/calculationService.js';
import { generateNextReference } from '../services/documentNumberService.js';
import { generateDocumentPDF, generateFileName } from '../services/pdfService.js';
import { createRecapFromFacture } from '../services/recapService.js';

const router = Router();
router.use(authenticateToken);

// GET tous les documents
router.get('/', async (req, res) => {
  try {
    const { type, statut, client_id } = req.query;
    
    const documents = await prisma.document.findMany({
      where: {
        ...(type && { type: type as any }),
        ...(statut && { statut: statut as any }),
        ...(client_id && { clientId: parseInt(client_id as string) })
      },
      include: {
        client: {
          select: { nom: true }
        }
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(documents);
  } catch (error) {
    console.error('Erreur GET documents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET statistiques
router.get('/stats/summary', async (req, res) => {
  try {
    const [actives, payees, annulees] = await Promise.all([
      prisma.document.count({ where: { type: 'FACTURE', statut: 'ACTIVE' } }),
      prisma.document.count({ where: { type: 'FACTURE', statut: 'PAYEE' } }),
      prisma.document.count({ where: { type: 'FACTURE', statut: 'ANNULEE' } })
    ]);

    const caActif = await prisma.document.aggregate({
      where: { type: 'FACTURE', statut: 'ACTIVE' },
      _sum: { netAPayer: true }
    });

    const caPaye = await prisma.document.aggregate({
      where: { type: 'FACTURE', statut: 'PAYEE' },
      _sum: { netAPayer: true }
    });

    const soldeDuTotal = await prisma.document.aggregate({
      where: { type: 'FACTURE', statut: 'ACTIVE' },
      _sum: { soldeDu: true }
    });

    res.json({
      factures_actives: actives,
      factures_payees: payees,
      factures_annulees: annulees,
      ca_actif: caActif._sum.netAPayer || 0,
      solde_du_total: soldeDuTotal._sum.soldeDu || 0,
      ca_paye: caPaye._sum.netAPayer || 0
    });
  } catch (error) {
    console.error('Erreur GET stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST générer un nouveau numéro de document
router.post('/generate-number', async (req, res) => {
  try {
    const { type, date } = req.body;

    if (!type || !date) {
      return res.status(400).json({ error: 'Type et date requis' });
    }

    const numero = await generateNextReference({
      type: type as 'DEVIS' | 'FACTURE' | 'AVOIR',
      date: new Date(date)
    });

    res.json({ numero });
  } catch (error) {
    console.error('Erreur génération numéro:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST calculer un document (avant création)
router.post('/calculate', async (req, res) => {
  try {
    const { lignes, appliquerRemise = true } = req.body;

    if (!lignes || !Array.isArray(lignes)) {
      return res.status(400).json({ error: 'Lignes requises' });
    }

    const result = await calculateDocument(lignes, appliquerRemise);

    res.json(result);
  } catch (error) {
    console.error('Erreur calcul:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer une facture et alimenter le récap
router.post('/facture-with-recap', async (req, res) => {
  try {
    const {
      numero,
      clientId,
      date,
      reference,
      lignes,
      appliquerRemise = true,
      conditionsPaiement
    } = req.body;

    if (!numero || !clientId || !date || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Calculer les montants
    const calcul = await calculateDocument(lignes, appliquerRemise);

    // Créer la facture
    const facture = await prisma.document.create({
      data: {
        type: 'FACTURE',
        numero,
        clientId,
        date: new Date(date),
        reference,
        soldeHt: calcul.soldeHt,
        remise: calcul.remise,
        sousTotal: calcul.sousTotal,
        tps: calcul.tps,
        css: calcul.css,
        netAPayer: calcul.netAPayer,
        soldeDu: calcul.soldeDu,
        statut: 'ACTIVE',
        conditionsPaiement,
        lignes: {
          create: calcul.lignes.map(ligne => ({
            produitId: ligne.produitId,
            designation: ligne.designation,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            totalHt: ligne.totalHt
          }))
        }
      },
      include: {
        lignes: true
      }
    });

    // Créer l'entrée dans le récap (automatique)
    const recapEntry = await createRecapFromFacture(facture.id);

    res.status(201).json({
      facture,
      recapEntry
    });
  } catch (error: any) {
    console.error('Erreur création facture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un document avec ses lignes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: true,
        lignes: {
          include: {
            produit: {
              select: { code: true, label: true }
            }
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    res.json(document);
  } catch (error) {
    console.error('Erreur GET document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET générer PDF d'un document
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      select: { type: true, numero: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const pdfBuffer = await generateDocumentPDF({
      documentId: parseInt(id),
      type: document.type as 'DEVIS' | 'FACTURE' | 'AVOIR'
    });

    const fileName = generateFileName(document.numero, document.type);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un document
router.post('/', async (req, res) => {
  try {
    const {
      type,
      numero,
      clientId,
      date,
      reference,
      soldeHt,
      remise,
      sousTotal,
      tps,
      css,
      netAPayer,
      soldeDu,
      statut = 'ACTIVE',
      conditionsPaiement,
      lignes
    } = req.body;

    if (!type || !numero || !clientId || !date || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const document = await prisma.document.create({
      data: {
        type,
        numero,
        clientId,
        date: new Date(date),
        reference,
        soldeHt,
        remise,
        sousTotal,
        tps,
        css,
        netAPayer,
        soldeDu,
        statut,
        conditionsPaiement,
        lignes: {
          create: lignes.map((ligne: any) => ({
            produitId: ligne.produitId,
            designation: ligne.designation,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            totalHt: ligne.totalHt
          }))
        }
      },
      include: {
        lignes: true
      }
    });

    res.status(201).json(document);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce numéro de document existe déjà' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Client ou produit invalide' });
    }
    console.error('Erreur POST document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un document
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, soldeDu, reference, conditionsPaiement } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        ...(statut && { statut }),
        ...(soldeDu !== undefined && { soldeDu }),
        ...(reference !== undefined && { reference }),
        ...(conditionsPaiement !== undefined && { conditionsPaiement })
      }
    });

    res.json(document);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    console.error('Erreur PUT document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.document.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Document supprimé avec succès' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    console.error('Erreur DELETE document:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
