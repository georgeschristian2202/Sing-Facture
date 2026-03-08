# Test de Connexion - SING FacturePro

## 🔍 Diagnostic du problème de connexion

### Étape 1 : Vérifier que l'inscription a réussi

Ouvrez Prisma Studio pour voir si l'utilisateur existe :

```bash
cd backend
npx prisma studio
```

Puis vérifiez dans la table `users` si votre email existe.

### Étape 2 : Vérifier les logs du backend

Après avoir ajouté les logs, redémarrez le serveur backend et essayez de vous connecter. Vous devriez voir dans la console :

**Si l'utilisateur n'existe pas :**
```
🔐 Tentative de connexion: testpersonncompte@gmail.com
❌ Utilisateur non trouvé: testpersonncompte@gmail.com
```

**Si le mot de passe est incorrect :**
```
🔐 Tentative de connexion: testpersonncompte@gmail.com
✅ Utilisateur trouvé: testpersonncompte@gmail.com - Organisation: Mon Entreprise
❌ Mot de passe incorrect pour: testpersonncompte@gmail.com
```

**Si la connexion réussit :**
```
🔐 Tentative de connexion: testpersonncompte@gmail.com
✅ Utilisateur trouvé: testpersonncompte@gmail.com - Organisation: Mon Entreprise
✅ Connexion réussie pour: testpersonncompte@gmail.com
```

### Étape 3 : Solutions selon le problème

#### Problème 1 : Utilisateur non trouvé
**Cause :** L'inscription n'a pas fonctionné

**Solution :** Réessayez l'inscription
1. Allez sur http://localhost:5174/register
2. Remplissez le formulaire
3. Vérifiez les logs du backend pour voir si l'inscription réussit

#### Problème 2 : Mot de passe incorrect
**Cause :** Le mot de passe saisi ne correspond pas

**Solutions :**
1. Vérifiez que vous tapez le bon mot de passe
2. Vérifiez qu'il n'y a pas d'espaces avant/après
3. Si vous avez oublié, créez un nouveau compte avec un autre email

#### Problème 3 : Organisation désactivée
**Cause :** Le champ `actif` de l'organisation est à `false`

**Solution :** Dans Prisma Studio, mettez `actif` à `true`

### Étape 4 : Test manuel avec curl

Testez directement l'API :

```bash
# Test de connexion
curl -X POST http://localhost:5005/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testpersonncompte@gmail.com\",\"password\":\"votre_mot_de_passe\"}"
```

**Réponse attendue si succès :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "testpersonncompte@gmail.com",
    "nom": "Test Personne",
    "role": "ADMIN",
    "organisationId": 1,
    "organisation": {
      "id": 1,
      "nom": "Mon Entreprise",
      ...
    }
  }
}
```

**Réponse si erreur 401 :**
```json
{
  "error": "Email ou mot de passe incorrect"
}
```

### Étape 5 : Créer un utilisateur de test manuellement

Si tout échoue, créez un utilisateur directement :

```bash
cd backend
npx tsx test-create-user.ts
```

Créez ce fichier `backend/test-create-user.ts` :

```typescript
import prisma from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  // Créer l'organisation
  const org = await prisma.organisation.create({
    data: {
      nom: 'Test Entreprise',
      email: 'test@test.com',
      plan: 'STARTER',
      actif: true,
      dateExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  });

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: hashedPassword,
      nom: 'Test User',
      role: 'ADMIN',
      organisationId: org.id
    }
  });

  // Créer les paramètres
  await prisma.parametres.create({
    data: {
      organisationId: org.id,
      nomEntreprise: 'Test Entreprise',
      email: 'test@test.com'
    }
  });

  console.log('✅ Utilisateur de test créé:');
  console.log('Email: test@test.com');
  console.log('Mot de passe: test123');
  
  await prisma.$disconnect();
}

createTestUser().catch(console.error);
```

Puis connectez-vous avec :
- Email: `test@test.com`
- Mot de passe: `test123`

## 🐛 Problèmes courants

### Erreur 400 (Bad Request)
- Vérifiez que l'email et le mot de passe sont bien envoyés
- Vérifiez la console du navigateur (F12) pour voir les données envoyées

### Erreur 401 (Unauthorized)
- Email ou mot de passe incorrect
- Vérifiez dans Prisma Studio que l'utilisateur existe

### Erreur 403 (Forbidden)
- Organisation désactivée
- Mettez `actif` à `true` dans Prisma Studio

### Erreur 500 (Internal Server Error)
- Problème backend
- Vérifiez les logs du serveur backend
- Vérifiez que Prisma Client est à jour

## ✅ Checklist de vérification

- [ ] Le serveur backend tourne sur le port 5005
- [ ] Le frontend tourne sur le port 5174
- [ ] Prisma Client a été régénéré (`npx prisma generate`)
- [ ] L'utilisateur existe dans la base de données
- [ ] L'organisation est active (`actif = true`)
- [ ] Le mot de passe est correct
- [ ] Les logs du backend s'affichent correctement

## 📞 Prochaines étapes

1. Redémarrez le serveur backend pour activer les nouveaux logs
2. Essayez de vous connecter
3. Regardez les logs dans la console du backend
4. Partagez les logs pour diagnostic
