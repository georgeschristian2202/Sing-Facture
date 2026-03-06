# ⚡ Installation Rapide - Backend

## En 3 commandes

```bash
# 1. Installer les dépendances
cd server && npm install

# 2. Créer la base de données et les données de test
node seed.js

# 3. Démarrer le serveur
npm start
```

## ✅ Vérification

Le serveur démarre sur **http://localhost:5000**

Testez avec :
```bash
curl http://localhost:5000/api/health
```

Réponse attendue :
```json
{"status":"ok","message":"SING FacturePro API"}
```

## 🔑 Compte de test

- Email : `demo@sing.ga`
- Mot de passe : `demo123`

## 📚 Documentation complète

Voir [README.md](./README.md) pour tous les endpoints API.
