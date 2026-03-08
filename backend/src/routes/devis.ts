import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateDocument } from '../services/calculationService.js';
import { generateNextReference } from '../services/documentNumberService.js';

const router = Router();
router.use(authenticateToken);

// GET tous les devis
router.get('/', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const { statut, clientId, dateDebut, dateFin } = req.query;
    
    const devis = await prisma.document.findMany({
      where: {
        organisationId,
        type: 'DEVIS',
        ...(statut && { statut: statut as any }),
        ...(clientId && { clientId: parseInt(clientId as string) }),
        ...(dateDebut && dateFin && {
          date: {
            gte: new Date(dateDebut as string),
            lte: new Date(dateFin as string)
          }
        })
      },
      include: {
        client: {
          select: { 
            id: true,
            nom: true,
            adresse: true,
            tel: true,
            email: true,
            pays: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(devis);
  } catch (error) {
    console.error('Erreur GET devis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET prochain numéro de devis
router.get('/numero-suivant', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const numero = await generateNextReference({
      type: 'DEVIS',
      organisationId,
      date
    });

    res.json({ numero });
  } catch (error) {
    console.error('Erreur génération numéro devis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un devis avec détails complets
router.get('/:id', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const { id } = req.params;

    const devis = await prisma.document.findFirst({
      where: { 
        id: parseInt(id),
        organisationId,
        type: 'DEVIS'
      },
      include: {
        client: {
          include: {
            representants: true
          }
        },
        lignes: {
          include: {
            produit: {
              select: { code: true, label: true, categorie: true }
            }
          },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    res.json(devis);
  } catch (error) {
    console.error('Erreur GET devis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un nouveau devis
router.post('/', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const {
      clientId,
      representantId,
      date,
      objet,
      reference,
      lignes,
      conditionsPaiement,
      modalitesPaiement
    } = req.body;

    if (!clientId || !date || !lignes || lignes.length === 0) {
      return res.status(400).json({ error: 'Client, date et lignes requis' });
    }

    // Générer le numéro automatiquement
    const numero = await generateNextReference({
      type: 'DEVIS',
      organisationId,
      date: new Date(date)
    });

    // Calculer les montants
    const lignesCalcul = lignes.map((l: any) => ({
      produitId: l.produitId,
      designation: l.designation,
      quantite: l.quantite,
      prixUnitaire: l.prixUnitaire
    }));

    const calcul = await calculateDocument(lignesCalcul, true);

    // Créer le devis
    const devis = await prisma.document.create({
      data: {
        type: 'DEVIS',
        numero,
        clientId,
        organisationId,
        date: new Date(date),
        reference: objet || reference,
        soldeHt: calcul.soldeHt,
        remise: calcul.remise,
        sousTotal: calcul.sousTotal,
        tps: calcul.tps,
        css: calcul.css,
        netAPayer: calcul.netAPayer,
        soldeDu: calcul.soldeDu,
        statut: 'ACTIVE',
        conditionsPaiement: conditionsPaiement || modalitesPaiement?.join(', '),
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
        client: true,
        lignes: true
      }
    });

    res.status(201).json(devis);
  } catch (error: any) {
    console.error('Erreur création devis:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce numéro de devis existe déjà' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Client ou produit invalide' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un devis
router.put('/:id', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const { id } = req.params;
    const {
      clientId,
      date,
      objet,
      reference,
      lignes,
      statut,
      conditionsPaiement
    } = req.body;

    // Vérifier que le devis existe et appartient à l'organisation
    const existingDevis = await prisma.document.findFirst({
      where: { 
        id: parseInt(id),
        organisationId,
        type: 'DEVIS'
      }
    });

    if (!existingDevis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    // Si les lignes sont modifiées, recalculer
    let updateData: any = {
      ...(clientId && { clientId }),
      ...(date && { date: new Date(date) }),
      ...(objet && { reference: objet }),
      ...(reference && { reference }),
      ...(statut && { statut }),
      ...(conditionsPaiement && { conditionsPaiement })
    };

    if (lignes && lignes.length > 0) {
      // Supprimer les anciennes lignes
      await prisma.ligneDocument.deleteMany({
        where: { documentId: parseInt(id) }
      });

      // Recalculer
      const lignesCalcul = lignes.map((l: any) => ({
        produitId: l.produitId,
        designation: l.designation,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire
      }));

      const calcul = await calculateDocument(lignesCalcul, true);

      updateData = {
        ...updateData,
        soldeHt: calcul.soldeHt,
        remise: calcul.remise,
        sousTotal: calcul.sousTotal,
        tps: calcul.tps,
        css: calcul.css,
        netAPayer: calcul.netAPayer,
        soldeDu: calcul.soldeDu,
        lignes: {
          create: calcul.lignes.map(ligne => ({
            produitId: ligne.produitId,
            designation: ligne.designation,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            totalHt: ligne.totalHt
          }))
        }
      };
    }

    const devis = await prisma.document.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        client: true,
        lignes: true
      }
    });

    res.json(devis);
  } catch (error: any) {
    console.error('Erreur mise à jour devis:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un devis
router.delete('/:id', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const { id } = req.params;

    // Vérifier que le devis existe et appartient à l'organisation
    const devis = await prisma.document.findFirst({
      where: { 
        id: parseInt(id),
        organisationId,
        type: 'DEVIS'
      }
    });

    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    await prisma.document.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Devis supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression devis:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST convertir un devis en bon de commande
router.post('/:id/convertir-bc', async (req, res) => {
  try {
    const { organisationId } = req.user;
    const { id } = req.params;

    // Récupérer le devis
    const devis = await prisma.document.findFirst({
      where: { 
        id: parseInt(id),
        organisationId,
        type: 'DEVIS'
      },
      include: {
        lignes: true
      }
    });

    if (!devis) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    // Générer le numéro de BC
    const numeroBC = await generateNextReference({
      type: 'COMMANDE',
      organisationId,
      date: new Date()
    });

    // Créer le bon de commande
    const bonCommande = await prisma.document.create({
      data: {
        type: 'COMMANDE',
        numero: numeroBC,
        clientId: devis.clientId,
        organisationId,
        date: new Date(),
        reference: `Converti de ${devis.numero}`,
        soldeHt: devis.soldeHt,
        remise: devis.remise,
        sousTotal: devis.sousTotal,
        tps: devis.tps,
        css: devis.css,
        netAPayer: devis.netAPayer,
        soldeDu: devis.soldeDu,
        statut: 'ACTIVE',
        conditionsPaiement: devis.conditionsPaiement,
        lignes: {
          create: devis.lignes.map(ligne => ({
            produitId: ligne.produitId,
            designation: ligne.designation,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            totalHt: ligne.totalHt
          }))
        }
      },
      include: {
        client: true,
        lignes: true
      }
    });

    res.status(201).json(bonCommande);
  } catch (error) {
    console.error('Erreur conversion devis en BC:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
