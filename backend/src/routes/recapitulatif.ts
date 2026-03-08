import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getRecapitulatif, getRecapStatistics, exportRecapToCSV } from '../services/recapService.js';

const router = Router();

router.use(authenticateToken);

// GET récapitulatif des factures
router.get('/', async (req, res) => {
  try {
    const { dateDebut, dateFin, statut } = req.query;

    const filters: any = {};

    if (dateDebut) {
      filters.dateDebut = new Date(dateDebut as string);
    }

    if (dateFin) {
      filters.dateFin = new Date(dateFin as string);
    }

    if (statut) {
      filters.statut = statut as string;
    }

    const recap = await getRecapitulatif(filters);

    res.json(recap);
  } catch (error) {
    console.error('Erreur GET récapitulatif:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET statistiques du récapitulatif
router.get('/statistics', async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;

    const filters: any = {};

    if (dateDebut) {
      filters.dateDebut = new Date(dateDebut as string);
    }

    if (dateFin) {
      filters.dateFin = new Date(dateFin as string);
    }

    const stats = await getRecapStatistics(filters);

    res.json(stats);
  } catch (error) {
    console.error('Erreur GET statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET export CSV du récapitulatif
router.get('/export/csv', async (req, res) => {
  try {
    const { dateDebut, dateFin, statut } = req.query;

    const filters: any = {};

    if (dateDebut) {
      filters.dateDebut = new Date(dateDebut as string);
    }

    if (dateFin) {
      filters.dateFin = new Date(dateFin as string);
    }

    if (statut) {
      filters.statut = statut as string;
    }

    const recap = await getRecapitulatif(filters);
    const csv = exportRecapToCSV(recap);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="recapitulatif.csv"');
    res.send('\uFEFF' + csv); // BOM pour Excel
  } catch (error) {
    console.error('Erreur export CSV:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
