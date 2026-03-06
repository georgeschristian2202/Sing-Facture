import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import produitsRoutes from './routes/produits.js';
import documentsRoutes from './routes/documents.js';
import parametresRoutes from './routes/parametres.js';
import './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/produits', produitsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/parametres', parametresRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SING FacturePro API' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
});
