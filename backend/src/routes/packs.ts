import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET tous les packs de l'organisation
router.get('/', async (req: AuthRequest, res) => {
  try {
    const organisationId = req.user!.organisationId;
    const { actif, sousService } = req.query;
    
    const where: any = { organisationId };
    
    if (actif !== undefined) {
      where.actif = actif === 'true';
    }
    
    if (sousService) {
      where.sousService = sousService;
    }
    
    const packs = await prisma.pack.findMany({
      where,
      orderBy: { code: 'asc' },
      include: {
        details: {
          orderBy: { ordre: 'asc' }
        }
      }
    });
    
    res.json(packs);
  } catch (error) {
    console.error('Erreur GET packs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET les sous-services uniques
router.get('/sous-services', async (req: AuthRequest, res) => {
  try {
    const organisationId = req.user!.organisationId;
    
    const packs = await prisma.pack.findMany({
      where: { organisationId, actif: true },
      select: { sousService: true },
      distinct: ['sousService']
    });
    
    const sousServices = packs.map(p => p.sousService);
    res.json(sousServices);
  } catch (error) {
    console.error('Erreur GET sous-services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un pack par ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const organisationId = req.user!.organisationId;
    
    const pack = await prisma.pack.findFirst({
      where: { 
        id: parseInt(id),
        organisationId 
      },
      include: {
        details: {
          orderBy: { ordre: 'asc' }
        }
      }
    });

    if (!pack) {
      return res.status(404).json({ error: 'Pack non trouvé' });
    }

    res.json(pack);
  } catch (error) {
    console.error('Erreur GET pack:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un pack
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { code, descCourte, prixUnitaire, sousService, details = [] } = req.body;
    const organisationId = req.user!.organisationId;

    if (!code || !descCourte || !prixUnitaire || !sousService) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const pack = await prisma.pack.create({
      data: { 
        code, 
        descCourte, 
        prixUnitaire,
        sousService,
        organisationId,
        actif: true,
        details: {
          create: details.map((desc: string, index: number) => ({
            ordre: index + 1,
            descriptionLongue: desc
          }))
        }
      },
      include: {
        details: true
      }
    });

    res.status(201).json(pack);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce code pack existe déjà' });
    }
    console.error('Erreur POST pack:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un pack
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { code, descCourte, prixUnitaire, sousService, actif, details } = req.body;
    const organisationId = req.user!.organisationId;

    // Vérifier que le pack appartient à l'organisation
    const existing = await prisma.pack.findFirst({
      where: { id: parseInt(id), organisationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Pack non trouvé' });
    }

    // Mettre à jour le pack et ses détails
    const pack = await prisma.pack.update({
      where: { id: parseInt(id) },
      data: {
        ...(code && { code }),
        ...(descCourte && { descCourte }),
        ...(prixUnitaire !== undefined && { prixUnitaire }),
        ...(sousService && { sousService }),
        ...(actif !== undefined && { actif }),
        ...(details && {
          details: {
            deleteMany: {},
            create: details.map((desc: string, index: number) => ({
              ordre: index + 1,
              descriptionLongue: desc
            }))
          }
        })
      },
      include: {
        details: {
          orderBy: { ordre: 'asc' }
        }
      }
    });

    res.json(pack);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pack non trouvé' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce code pack existe déjà' });
    }
    console.error('Erreur PUT pack:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un pack
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const organisationId = req.user!.organisationId;

    // Vérifier que le pack appartient à l'organisation
    const existing = await prisma.pack.findFirst({
      where: { id: parseInt(id), organisationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Pack non trouvé' });
    }

    await prisma.pack.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Pack supprimé avec succès' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pack non trouvé' });
    }
    console.error('Erreur DELETE pack:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
