import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import produitsRoutes from './routes/produits.js';
import documentsRoutes from './routes/documents.js';
import parametresRoutes from './routes/parametres.js';
import recapitulatifRoutes from './routes/recapitulatif.js';
import packsRoutes from './routes/packs.js';
import devisRoutes from './routes/devis.js';
// import templatesRoutes from './routes/templates.js';
// import pdfRoutes from './routes/pdf.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/produits', produitsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/parametres', parametresRoutes);
app.use('/api/recapitulatif', recapitulatifRoutes);
app.use('/api/packs', packsRoutes);
app.use('/api/devis', devisRoutes);
// app.use('/api/templates', templatesRoutes); // TODO: Implémenter les services
// app.use('/api/pdf', pdfRoutes); // TODO: Implémenter les services

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SING FacturePro API',
    version: '2.0.0',
    database: 'PostgreSQL + Prisma',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log('\n🚀 Serveur SING FacturePro démarré');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🌍 CORS: ${CORS_ORIGIN}`);
  console.log(`🗄️  Database: PostgreSQL + Prisma ORM`);
  console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}\n`);
});
