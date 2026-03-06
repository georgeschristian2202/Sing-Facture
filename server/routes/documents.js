import express from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Liste des documents (devis, factures, etc.)
router.get('/', (req, res) => {
  const { type, statut } = req.query;
  
  try {
    let query = `
      SELECT d.*, c.nom as client_nom 
      FROM documents d 
      JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ' AND d.type = ?';
      params.push(type);
    }
    if (statut) {
      query += ' AND d.statut = ?';
      params.push(statut);
    }

    query += ' ORDER BY d.date DESC, d.created_at DESC';

    const stmt = db.prepare(query);
    const documents = stmt.all(...params);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Détail d'un document avec ses lignes
router.get('/:id', (req, res) => {
  try {
    const docStmt = db.prepare(`
      SELECT d.*, c.nom as client_nom, c.adresse, c.tel, c.email 
      FROM documents d 
      JOIN clients c ON d.client_id = c.id 
      WHERE d.id = ?
    `);
    const document = docStmt.get(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const lignesStmt = db.prepare('SELECT * FROM lignes_document WHERE document_id = ?');
    const lignes = lignesStmt.all(req.params.id);

    res.json({ ...document, lignes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un document
router.post('/', (req, res) => {
  const { type, numero, client_id, date, reference, lignes, conditions_paiement, statut } = req.body;

  if (!type || !numero || !client_id || !lignes || lignes.length === 0) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    // Calculer les totaux
    const solde_ht = lignes.reduce((sum, l) => sum + (l.quantite * l.prix_unitaire), 0);
    const remise = solde_ht * 0.095;
    const sous_total = solde_ht - remise;
    const tps = sous_total * 0.095;
    const css = sous_total * 0.01;
    const net_a_payer = sous_total - tps - css;

    // Insérer le document
    const docStmt = db.prepare(`
      INSERT INTO documents (type, numero, client_id, date, reference, solde_ht, remise, sous_total, tps, css, net_a_payer, solde_du, conditions_paiement, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = docStmt.run(
      type, numero, client_id, date || new Date().toISOString().split('T')[0],
      reference, solde_ht, remise, sous_total, tps, css, net_a_payer, net_a_payer,
      conditions_paiement, statut || 'Active'
    );

    const documentId = result.lastInsertRowid;

    // Insérer les lignes
    const ligneStmt = db.prepare(`
      INSERT INTO lignes_document (document_id, produit_id, designation, quantite, prix_unitaire, total_ht)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const ligne of lignes) {
      const total_ht = ligne.quantite * ligne.prix_unitaire;
      ligneStmt.run(documentId, ligne.produit_id, ligne.designation, ligne.quantite, ligne.prix_unitaire, total_ht);
    }

    res.status(201).json({ id: documentId, numero, net_a_payer });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Numéro de document déjà existant' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier le statut d'un document
router.patch('/:id/statut', (req, res) => {
  const { statut } = req.body;

  if (!statut) {
    return res.status(400).json({ error: 'Statut requis' });
  }

  try {
    const stmt = db.prepare('UPDATE documents SET statut = ? WHERE id = ?');
    stmt.run(statut, req.params.id);
    res.json({ message: 'Statut modifié' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un document
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Document supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
