import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET paramètres
router.get('/', async (req, res) => {
  try {
    const parametres = await prisma.parametres.findUnique({
      where: { id: 1 }
    });
    
    if (!parametres) {
      return res.status(404).json({ error: 'Paramètres non trouvés' });
    }

    res.json(parametres);
  } catch (error) {
    console.error('Erreur GET paramètres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour les paramètres (admin seulement)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const {
      nomEntreprise,
      adresse,
      telephone,
      email,
      siteWeb,
      rccm,
      capital,
      tauxTps,
      tauxCss,
      tauxTva,
      tauxRemise,
      ribUba,
      ribAfg
    } = req.body;

    const parametres = await prisma.parametres.update({
      where: { id: 1 },
      data: {
        ...(nomEntreprise && { nomEntreprise }),
        ...(adresse !== undefined && { adresse }),
        ...(telephone && { telephone }),
        ...(email && { email }),
        ...(siteWeb && { siteWeb }),
        ...(rccm && { rccm }),
        ...(capital && { capital }),
        ...(tauxTps !== undefined && { tauxTps }),
        ...(tauxCss !== undefined && { tauxCss }),
        ...(tauxTva !== undefined && { tauxTva }),
        ...(tauxRemise !== undefined && { tauxRemise }),
        ...(ribUba && { ribUba }),
        ...(ribAfg && { ribAfg })
      }
    });

    res.json(parametres);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Paramètres non trouvés' });
    }
    console.error('Erreur PUT paramètres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
