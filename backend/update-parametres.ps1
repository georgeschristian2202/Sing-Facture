# Script pour mettre à jour les paramètres
Write-Host "Mise à jour du schéma Prisma..." -ForegroundColor Cyan

# Générer le client Prisma
Write-Host "`nGénération du client Prisma..." -ForegroundColor Yellow
npm exec prisma generate

# Appliquer les migrations
Write-Host "`nApplication des migrations..." -ForegroundColor Yellow
npm exec prisma migrate deploy

Write-Host "`nMise à jour terminée!" -ForegroundColor Green
