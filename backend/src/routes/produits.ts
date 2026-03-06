import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const { categorie, actif } = req.query;
    
    const produits = await prisma.produit.findMany({
      where: {
        ...(categorie && { categorie: categorie as string }),
        ...(actif !== undefined && { actif: actif === 'true' })
      },
      orderBy: [
        { categorie: 'asc' },
        { label: 'asc' }
      ]
    });

    res.json(produits);
  } catch (error) {
    console.error('Erreur GET produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET catégories uniques
router.get('/categories', async (req, res) => {
  try {
    const produits = await prisma.produit.findMany({
      select: { categorie: true },
      distinct: ['categorie'],
      orderBy: { categorie: 'asc' }
    });

    res.json(produits.map(p => p.categorie));
  } catch (error) {
    console.error('Erreur GET catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await prisma.produit.findUnique({
      where: { id: parseInt(id) }
    });

    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(produit);
  } catch (error) {
    console.error('Erreur GET produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un produit
router.post('/', async (req, res) => {
  try {
    const { code, label, prix, categorie, description, actif = true } = req.body;

    if (!code || !label || prix === undefined || !categorie) {
      return res.status(400).json({ error: 'Champs requis: code, label, prix, categorie' });
    }

    const produit = await prisma.produit.create({
      data: { code, label, prix, categorie, description, actif }
    });

    res.status(201).json(produit);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce code produit existe déjà' });
    }
    console.error('Erreur POST produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, label, prix, categorie, description, actif } = req.body;

    const produit = await prisma.produit.update({
      where: { id: parseInt(id) },
      data: {
        ...(code && { code }),
        ...(label && { label }),
        ...(prix !== undefined && { prix }),
        ...(categorie && { categorie }),
        ...(description !== undefined && { description }),
        ...(actif !== undefined && { actif })
      }
    });

    res.json(produit);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ce code produit existe déjà' });
    }
    console.error('Erreur PUT produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produit.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Impossible de supprimer ce produit car il est lié à des documents' });
    }
    console.error('Erreur DELETE produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
