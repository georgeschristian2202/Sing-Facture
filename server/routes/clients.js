import express from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Tous les endpoints nécessitent l'authentification
router.use(authMiddleware);

// Liste des clients
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clients ORDER BY nom');
    const clients = stmt.all();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un client
router.post('/', (req, res) => {
  const { nom, adresse, tel, email, pays } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom est requis' });
  }

  try {
    const stmt = db.prepare('INSERT INTO clients (nom, adresse, tel, email, pays) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(nom, adresse, tel, email, pays || 'Gabon');
    res.status(201).json({ id: result.lastInsertRowid, nom, adresse, tel, email, pays });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un client
router.put('/:id', (req, res) => {
  const { nom, adresse, tel, email, pays } = req.body;

  try {
    const stmt = db.prepare('UPDATE clients SET nom = ?, adresse = ?, tel = ?, email = ?, pays = ? WHERE id = ?');
    stmt.run(nom, adresse, tel, email, pays, req.params.id);
    res.json({ message: 'Client modifié' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un client
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
