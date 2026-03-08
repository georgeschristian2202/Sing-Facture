import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET tous les clients de l'organisation
router.get('/', async (req: AuthRequest, res) => {
  try {
    const organisationId = req.user!.organisationId;
    
    const clients = await prisma.client.findMany({
      where: { organisationId },
      orderBy: { nom: 'asc' },
      include: {
        representants: {
          orderBy: { principal: 'desc' } // Représentant principal en premier
        },
        _count: {
          select: { documents: true }
        }
      }
    });
    
    res.json(clients);
  } catch (error) {
    console.error('Erreur GET clients:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un client par ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const organisationId = req.user!.organisationId;
    
    const client = await prisma.client.findFirst({
      where: { 
        id: parseInt(id),
        organisationId 
      },
      include: {
        representants: {
          orderBy: { principal: 'desc' }
        },
        documents: {
          orderBy: { date: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            numero: true,
            date: true,
            netAPayer: true,
            statut: true
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    res.json(client);
  } catch (error) {
    console.error('Erreur GET client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un client
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { nom, adresse, tel, email, pays = 'Gabon', representants = [] } = req.body;
    const organisationId = req.user!.organisationId;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const client = await prisma.client.create({
      data: { 
        nom, 
        adresse, 
        tel, 
        email, 
        pays,
        organisationId,
        representants: {
          create: representants.map((rep: any) => ({
            nom: rep.nom,
            fonction: rep.fonction,
            tel: rep.tel,
            email: rep.email,
            principal: rep.principal || false
          }))
        }
      },
      include: {
        representants: true
      }
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Erreur POST client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un client
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, tel, email, pays, representants = [] } = req.body;
    const organisationId = req.user!.organisationId;

    // Vérifier que le client appartient à l'organisation
    const existing = await prisma.client.findFirst({
      where: { id: parseInt(id), organisationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    // Supprimer les anciens représentants et créer les nouveaux
    await prisma.representant.deleteMany({
      where: { clientId: parseInt(id) }
    });

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom && { nom }),
        ...(adresse !== undefined && { adresse }),
        ...(tel !== undefined && { tel }),
        ...(email !== undefined && { email }),
        ...(pays && { pays }),
        representants: {
          create: representants.map((rep: any) => ({
            nom: rep.nom,
            fonction: rep.fonction,
            tel: rep.tel,
            email: rep.email,
            principal: rep.principal || false
          }))
        }
      },
      include: {
        representants: true
      }
    });

    res.json(client);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    console.error('Erreur PUT client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un client
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const organisationId = req.user!.organisationId;

    // Vérifier que le client appartient à l'organisation
    const existing = await prisma.client.findFirst({
      where: { id: parseInt(id), organisationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Client supprimé avec succès' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Impossible de supprimer ce client car il est lié à des documents' });
    }
    console.error('Erreur DELETE client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
