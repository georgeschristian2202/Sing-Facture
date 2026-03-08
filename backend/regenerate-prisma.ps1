# Script pour régénérer Prisma Client
Write-Host "🔄 Régénération du Prisma Client..." -ForegroundColor Cyan

# Supprimer l'ancien client
Write-Host "📦 Suppression de l'ancien client..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

# Régénérer
Write-Host "⚙️  Génération du nouveau client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client régénéré avec succès!" -ForegroundColor Green
    Write-Host "🚀 Vous pouvez maintenant redémarrer le serveur avec: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erreur lors de la régénération" -ForegroundColor Red
}
