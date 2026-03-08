#!/bin/bash
# Script pour régénérer Prisma Client

echo "🔄 Régénération du Prisma Client..."

# Supprimer l'ancien client
echo "📦 Suppression de l'ancien client..."
rm -rf node_modules/.prisma

# Régénérer
echo "⚙️  Génération du nouveau client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client régénéré avec succès!"
    echo "🚀 Vous pouvez maintenant redémarrer le serveur avec: npm run dev"
else
    echo "❌ Erreur lors de la régénération"
fi
