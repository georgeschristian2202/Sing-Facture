import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { DocumentService } from '../services/documentService.js';
import { RecapService } from '../services/recapService.js';
import { PDFService } from '../services/pdfService.js';

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

// GET statistiques
router.get('/stats/summary', async (req, res) => {
  try {
    const [actives, payees, annulees, totals] = await Promise.all([
      prisma.document.count({ where: { type: 'FACTURE', statut: 'ACTIVE' } }),
      prisma.document.count({ where: { type: 'FACTURE', statut: 'PAYEE' } }),
      prisma.document.count({ where: { type: 'FACTURE', statut: 'ANNULEE' } }),
      prisma.document.aggregate({
        where: { type: 'FACTURE' },
        _sum: {
          netAPayer: true,
          soldeDu: true
        }
      })
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

export default router;


// POST créer un document depuis des codes produits (logique VBA)
router.post('/generate', async (req, res) => {
  try {
    const {
      type,
      clientId,
      date,
      reference,
      conditionsPaiement,
      codeProduits,
      quantites,
      appliquerRemise
    } = req.body;

    if (!type || !clientId || !codeProduits || !Array.isArray(codeProduits)) {
      return res.status(400).json({ 
        error: 'Champs requis: type, clientId, codeProduits (array)' 
      });
    }

    // Créer le document avec la logique VBA
    const document = await DocumentService.createDocument({
      type,
      clientId,
      date: date ? new Date(date) : new Date(),
      reference,
      conditionsPaiement,
      codeProduits,
      quantites,
      appliquerRemise
    });

    // Si c'est une facture, alimenter le récap automatiquement
    if (type === 'FACTURE') {
      await RecapService.alimenterDepuisFacture(document.id);
    }

    res.status(201).json(document);
  } catch (error: any) {
    console.error('Erreur POST generate document:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// GET générer le prochain numéro de document
router.get('/next-number/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { date } = req.query;

    if (!['DEVIS', 'FACTURE', 'AVOIR'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const numero = await DocumentService.generateNextNumber(
      type as 'DEVIS' | 'FACTURE' | 'AVOIR',
      date ? new Date(date as string) : new Date()
    );

    res.json({ numero });
  } catch (error) {
    console.error('Erreur GET next-number:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET récapitulatif des factures
router.get('/recap', async (req, res) => {
  try {
    const { dateDebut, dateFin, statut } = req.query;

    const filters: any = {};
    if (dateDebut) filters.dateDebut = new Date(dateDebut as string);
    if (dateFin) filters.dateFin = new Date(dateFin as string);
    if (statut) filters.statut = statut as string;

    const recap = await RecapService.getRecapitulatif(filters);

    res.json(recap);
  } catch (error) {
    console.error('Erreur GET recap:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST calculer les montants d'un document (preview)
router.post('/calculate', async (req, res) => {
  try {
    const { soldeHt, appliquerRemise } = req.body;

    if (soldeHt === undefined) {
      return res.status(400).json({ error: 'soldeHt requis' });
    }

    // Récupérer les taux depuis les paramètres
    const parametres = await prisma.parametres.findUnique({
      where: { id: 1 }
    });

    const tauxRemise = parametres ? Number(parametres.tauxRemise) : 0.095;
    const tauxTps = parametres ? Number(parametres.tauxTps) : 0.095;
    const tauxCss = parametres ? Number(parametres.tauxCss) : 0.01;

    const amounts = DocumentService.calculateAmounts(
      Number(soldeHt),
      tauxRemise,
      tauxTps,
      tauxCss,
      appliquerRemise !== false
    );

    res.json(amounts);
  } catch (error) {
    console.error('Erreur POST calculate:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET prévisualiser les lignes depuis des codes produits
router.post('/preview-lignes', async (req, res) => {
  try {
    const { codeProduits } = req.body;

    if (!codeProduits || !Array.isArray(codeProduits)) {
      return res.status(400).json({ error: 'codeProduits (array) requis' });
    }

    const lignes = await DocumentService.generateLignesFromProduits(codeProduits);

    res.json(lignes);
  } catch (error) {
    console.error('Erreur POST preview-lignes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// GET générer le PDF d'un document
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await PDFService.generateDocumentPDF(parseInt(id));

    // Récupérer le numéro du document pour le nom du fichier
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      select: { numero: true, type: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const filename = PDFService.sanitizeFileName(document.numero) + '.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Erreur GET PDF:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});
