# 📦 Guide d'Installation - FacturePro

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure ([télécharger](https://nodejs.org/))
- **npm** (inclus avec Node.js) ou **yarn**
- Un éditeur de code (VS Code recommandé)
- Git (optionnel)

## Vérification des prérequis

```bash
node --version    # Doit afficher v18.x.x ou supérieur
npm --version     # Doit afficher 9.x.x ou supérieur
```

## Installation

### Étape 1 : Installation des dépendances

```bash
npm install
```

Cette commande va installer :
- React 18.3.1
- React DOM 18.3.1
- React Router DOM 6.22.0
- Vite 5.1.4
- Plugin Vite React 4.2.1

### Étape 2 : Vérification de l'installation

```bash
npm list --depth=0
```

Vous devriez voir toutes les dépendances listées sans erreur.

## Lancement de l'application

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

Le serveur de développement inclut :
- ✅ Hot Module Replacement (HMR)
- ✅ Rechargement automatique
- ✅ Messages d'erreur détaillés

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

### Prévisualisation du build

```bash
npm run preview
```

Permet de tester le build de production localement.

## Structure après installation

```
Sing-Facture/
├── node_modules/          # Dépendances installées (ignoré par git)
├── dist/                  # Build de production (créé après npm run build)
├── src/                   # Code source
├── files/                 # Fichiers originaux
├── package.json           # Configuration npm
├── package-lock.json      # Verrouillage des versions
└── ...
```

## Résolution des problèmes

### Erreur : "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé

Modifiez le port dans `vite.config.js` :

```javascript
export default defineConfig({
  server: {
    port: 3001  // Changez le port ici
  }
})
```

### Erreur de permissions (Linux/Mac)

```bash
sudo npm install
```

Ou configurez npm pour ne pas utiliser sudo :

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Problèmes de cache

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Configuration de l'éditeur (VS Code)

### Extensions recommandées

1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **ESLint**
4. **Vite** (pour la coloration syntaxique)

### Configuration VS Code (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "javascript.preferences.quoteStyle": "double",
  "typescript.preferences.quoteStyle": "double"
}
```

## Variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Puis modifiez `.env` selon vos besoins.

## Prochaines étapes

Une fois l'installation terminée :

1. Lisez le fichier **DEMARRAGE.md** pour comprendre l'utilisation
2. Consultez **ARCHITECTURE.md** pour la structure du projet
3. Explorez le code dans `src/pages/`

## Support

En cas de problème :
- Vérifiez les issues GitHub (si applicable)
- Contactez : info@sing.ga
- Téléphone : +241 74 13 71 03

## Mise à jour des dépendances

Pour mettre à jour toutes les dépendances :

```bash
npm update
```

Pour vérifier les versions obsolètes :

```bash
npm outdated
```

## Désinstallation

Pour supprimer complètement le projet :

```bash
rm -rf node_modules dist
```

---

✅ Installation terminée ! Lancez `npm run dev` pour commencer.
