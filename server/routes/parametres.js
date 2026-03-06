import express from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Récupérer les paramètres
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM parametres WHERE id = 1');
    const parametres = stmt.get();
    res.json(parametres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier les paramètres
router.put('/', (req, res) => {
  const {
    nom_entreprise, adresse, telephone, email, site_web, rccm, capital,
    taux_tps, taux_css, taux_tva, taux_remise, rib_uba, rib_afg
  } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE parametres SET
        nom_entreprise = ?, adresse = ?, telephone = ?, email = ?, site_web = ?,
        rccm = ?, capital = ?, taux_tps = ?, taux_css = ?, taux_tva = ?,
        taux_remise = ?, rib_uba = ?, rib_afg = ?
      WHERE id = 1
    `);
    stmt.run(
      nom_entreprise, adresse, telephone, email, site_web, rccm, capital,
      taux_tps, taux_css, taux_tva, taux_remise, rib_uba, rib_afg
    );
    res.json({ message: 'Paramètres mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
