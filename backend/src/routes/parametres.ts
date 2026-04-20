import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET paramètres
router.get('/', async (req, res) => {
  try {
    const user = (req as any).user;
    const parametres = await prisma.parametres.findUnique({
      where: { organisationId: user.organisationId }
    });
    
    if (!parametres) {
      // Créer les paramètres par défaut si ils n'existent pas
      const newParametres = await prisma.parametres.create({
        data: {
          organisationId: user.organisationId,
          nomEntreprise: 'Mon Entreprise',
          adresse: '',
          telephone: '',
          email: '',
          siteWeb: '',
          rccm: '',
          numStatistique: '',
          capital: '',
          tauxTps: 0.095,
          tauxCss: 0.01,
          tauxTva: 0.18,
          tauxRemise: 0.095,
          typeTaxe: 'TVA',
          ribUba: '',
          ribAfg: '',
          modalitesPaiement: [],
          conditionsPaiement: []
        }
      });
      return res.json(newParametres);
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
    const user = (req as any).user;
    const {
      nomEntreprise,
      adresse,
      telephone,
      email,
      siteWeb,
      rccm,
      numStatistique,
      capital,
      tauxTps,
      tauxCss,
      tauxTva,
      tauxRemise,
      typeTaxe,
      ribUba,
      ribAfg,
      modalitesPaiement,
      conditionsPaiement
    } = req.body;

    const parametres = await prisma.parametres.upsert({
      where: { organisationId: user.organisationId },
      update: {
        ...(nomEntreprise !== undefined && { nomEntreprise }),
        ...(adresse !== undefined && { adresse }),
        ...(telephone !== undefined && { telephone }),
        ...(email !== undefined && { email }),
        ...(siteWeb !== undefined && { siteWeb }),
        ...(rccm !== undefined && { rccm }),
        ...(numStatistique !== undefined && { numStatistique }),
        ...(capital !== undefined && { capital }),
        ...(tauxTps !== undefined && { tauxTps }),
        ...(tauxCss !== undefined && { tauxCss }),
        ...(tauxTva !== undefined && { tauxTva }),
        ...(tauxRemise !== undefined && { tauxRemise }),
        ...(typeTaxe !== undefined && { typeTaxe }),
        ...(ribUba !== undefined && { ribUba }),
        ...(ribAfg !== undefined && { ribAfg }),
        ...(modalitesPaiement !== undefined && { modalitesPaiement }),
        ...(conditionsPaiement !== undefined && { conditionsPaiement })
      },
      create: {
        organisationId: user.organisationId,
        nomEntreprise: nomEntreprise || 'Mon Entreprise',
        adresse: adresse || '',
        telephone: telephone || '',
        email: email || '',
        siteWeb: siteWeb || '',
        rccm: rccm || '',
        numStatistique: numStatistique || '',
        capital: capital || '',
        tauxTps: tauxTps || 0.095,
        tauxCss: tauxCss || 0.01,
        tauxTva: tauxTva || 0.18,
        tauxRemise: tauxRemise || 0.095,
        typeTaxe: typeTaxe || 'TVA',
        ribUba: ribUba || '',
        ribAfg: ribAfg || '',
        modalitesPaiement: modalitesPaiement || [],
        conditionsPaiement: conditionsPaiement || []
      }
    });

    res.json(parametres);
  } catch (error: any) {
    console.error('Erreur PUT paramètres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
