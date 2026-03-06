import express from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Liste des produits
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM produits WHERE actif = 1 ORDER BY categorie, code');
    const produits = stmt.all();
    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un produit
router.post('/', (req, res) => {
  const { code, label, prix, categorie, description } = req.body;

  if (!code || !label || !prix || !categorie) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const stmt = db.prepare('INSERT INTO produits (code, label, prix, categorie, description) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(code, label, prix, categorie, description);
    res.status(201).json({ id: result.lastInsertRowid, code, label, prix, categorie });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Code produit déjà existant' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un produit
router.put('/:id', (req, res) => {
  const { code, label, prix, categorie, description, actif } = req.body;

  try {
    const stmt = db.prepare('UPDATE produits SET code = ?, label = ?, prix = ?, categorie = ?, description = ?, actif = ? WHERE id = ?');
    stmt.run(code, label, prix, categorie, description, actif !== undefined ? actif : 1, req.params.id);
    res.json({ message: 'Produit modifié' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un produit
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('UPDATE produits SET actif = 0 WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Produit désactivé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
