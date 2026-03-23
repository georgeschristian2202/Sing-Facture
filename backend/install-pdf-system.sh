#!/bin/bash

echo "🚀 Installation du Système de Templates PDF"
echo "==========================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Vérifier que nous sommes dans le dossier backend
if [ ! -f "package.json" ]; then
    error "Ce script doit être exécuté depuis le dossier backend"
    exit 1
fi

echo "Étape 1/5 : Installation des dépendances npm..."
npm install pdf-lib pdf-parse puppeteer multer

if [ $? -eq 0 ]; then
    success "Dépendances installées"
else
    error "Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "Étape 2/5 : Création du dossier d'upload..."
mkdir -p uploads/templates

if [ $? -eq 0 ]; then
    success "Dossier uploads/templates créé"
else
    warning "Le dossier existe déjà ou erreur de création"
fi

echo ""
echo "Étape 3/5 : Application des migrations Prisma..."
npx prisma db push

if [ $? -eq 0 ]; then
    success "Migrations appliquées"
else
    error "Erreur lors de l'application des migrations"
    exit 1
fi

echo ""
echo "Étape 4/5 : Génération du client Prisma..."
npx prisma generate

if [ $? -eq 0 ]; then
    success "Client Prisma généré"
else
    error "Erreur lors de la génération du client Prisma"
    exit 1
fi

echo ""
echo "Étape 5/5 : Vérification de l'installation..."

# Vérifier que les fichiers de service existent
if [ -f "src/services/templateService.ts" ] && [ -f "src/services/pdfGenerationService.ts" ]; then
    success "Services PDF trouvés"
else
    error "Services PDF manquants"
    exit 1
fi

# Vérifier que les routes existent
if [ -f "src/routes/templates.ts" ] && [ -f "src/routes/pdf.ts" ]; then
    success "Routes API trouvées"
else
    error "Routes API manquantes"
    exit 1
fi

echo ""
echo "==========================================="
echo -e "${GREEN}✓ Installation terminée avec succès !${NC}"
echo ""
echo "Prochaines étapes :"
echo "1. Démarrer le serveur : npm run dev"
echo "2. Tester l'API : curl http://localhost:5000/api/health"
echo "3. Uploader un template depuis l'interface web"
echo ""
echo "Documentation complète : ../PDF_TEMPLATE_SYSTEM.md"
echo "==========================================="
