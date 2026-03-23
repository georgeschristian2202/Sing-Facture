# Script PowerShell pour Windows
Write-Host "🚀 Installation du Système de Templates PDF" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Vérifier que nous sommes dans le dossier backend
if (-not (Test-Path "package.json")) {
    Write-Error "Ce script doit être exécuté depuis le dossier backend"
    exit 1
}

Write-Host "Étape 1/5 : Installation des dépendances npm..."
npm install pdf-lib pdf-parse puppeteer multer

if ($LASTEXITCODE -eq 0) {
    Write-Success "Dépendances installées"
} else {
    Write-Error "Erreur lors de l'installation des dépendances"
    exit 1
}

Write-Host ""
Write-Host "Étape 2/5 : Création du dossier d'upload..."
New-Item -ItemType Directory -Force -Path "uploads\templates" | Out-Null

if ($?) {
    Write-Success "Dossier uploads\templates créé"
} else {
    Write-Warning "Le dossier existe déjà ou erreur de création"
}

Write-Host ""
Write-Host "Étape 3/5 : Application des migrations Prisma..."
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Success "Migrations appliquées"
} else {
    Write-Error "Erreur lors de l'application des migrations"
    exit 1
}

Write-Host ""
Write-Host "Étape 4/5 : Génération du client Prisma..."
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Success "Client Prisma généré"
} else {
    Write-Error "Erreur lors de la génération du client Prisma"
    exit 1
}

Write-Host ""
Write-Host "Étape 5/5 : Vérification de l'installation..."

# Vérifier que les fichiers de service existent
if ((Test-Path "src\services\templateService.ts") -and (Test-Path "src\services\pdfGenerationService.ts")) {
    Write-Success "Services PDF trouvés"
} else {
    Write-Error "Services PDF manquants"
    exit 1
}

# Vérifier que les routes existent
if ((Test-Path "src\routes\templates.ts") -and (Test-Path "src\routes\pdf.ts")) {
    Write-Success "Routes API trouvées"
} else {
    Write-Error "Routes API manquantes"
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "✓ Installation terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :"
Write-Host "1. Démarrer le serveur : npm run dev"
Write-Host "2. Tester l'API : curl http://localhost:5000/api/health"
Write-Host "3. Uploader un template depuis l'interface web"
Write-Host ""
Write-Host "Documentation complète : ..\PDF_TEMPLATE_SYSTEM.md"
Write-Host "===========================================" -ForegroundColor Cyan
