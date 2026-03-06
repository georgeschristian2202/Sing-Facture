import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test de connexion
prisma.$connect()
  .then(() => {
    console.log('✅ Connecté à PostgreSQL via Prisma');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion PostgreSQL:', error);
    process.exit(1);
  });

export default prisma;
