import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentative de connexion:', email);

    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant');
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organisation: {
          select: {
            id: true,
            nom: true,
            email: true,
            telephone: true,
            adresse: true,
            rccm: true,
            capital: true,
            logo: true,
            plan: true,
            actif: true,
            dateExpiration: true
          }
        }
      }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    console.log('✅ Utilisateur trouvé:', user.email, '- Organisation:', user.organisation.nom);

    console.log('✅ Utilisateur trouvé:', user.email, '- Organisation:', user.organisation.nom);

    if (!user.organisation.actif) {
      console.log('❌ Organisation désactivée');
      return res.status(403).json({ error: 'Votre compte est désactivé. Contactez le support.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    console.log('✅ Connexion réussie pour:', email);

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        organisationId: user.organisationId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        organisationId: user.organisationId,
        organisation: user.organisation
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Register - Inscription complète avec organisation
router.post('/register', async (req, res) => {
  try {
    const { 
      // Données utilisateur
      email, 
      password, 
      nom,
      // Données organisation
      companyName,
      companyEmail,
      telephone,
      adresse,
      rccm,
      capital,
      plan = 'STARTER'
    } = req.body;

    // Validation
    if (!email || !password || !nom || !companyName) {
      return res.status(400).json({ 
        error: 'Email, mot de passe, nom et nom de l\'entreprise sont requis' 
      });
    }

    // Vérifier si l'email utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Vérifier si l'email organisation existe déjà
    if (companyEmail) {
      const existingOrg = await prisma.organisation.findUnique({
        where: { email: companyEmail }
      });

      if (existingOrg) {
        return res.status(400).json({ error: 'Cet email d\'entreprise est déjà utilisé' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'organisation et l'utilisateur en une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'organisation
      const organisation = await tx.organisation.create({
        data: {
          nom: companyName,
          email: companyEmail || email,
          telephone: telephone || null,
          adresse: adresse || null,
          rccm: rccm || null,
          capital: capital || null,
          plan: plan as 'STARTER' | 'BUSINESS' | 'ENTERPRISE',
          actif: true,
          dateExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 jours d'essai
        }
      });

      // Créer l'utilisateur admin
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nom,
          role: 'ADMIN',
          organisationId: organisation.id
        },
        select: {
          id: true,
          email: true,
          nom: true,
          role: true,
          organisationId: true
        }
      });

      // Créer les paramètres par défaut
      await tx.parametres.create({
        data: {
          organisationId: organisation.id,
          nomEntreprise: companyName,
          adresse: adresse || '',
          telephone: telephone || '',
          email: companyEmail || email,
          rccm: rccm || '',
          capital: capital || '',
          tauxTps: 0.095,
          tauxCss: 0.01,
          tauxTva: 0.18,
          tauxRemise: 0.095
        }
      });

      return { user, organisation };
    });

    const token = jwt.sign(
      { 
        id: result.user.id, 
        email: result.user.email, 
        role: result.user.role,
        organisationId: result.user.organisationId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        ...result.user,
        organisation: result.organisation
      }
    });
  } catch (error: any) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});


// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        organisationId: true,
        createdAt: true,
        organisation: {
          select: {
            id: true,
            nom: true,
            email: true,
            telephone: true,
            adresse: true,
            rccm: true,
            capital: true,
            logo: true,
            plan: true,
            actif: true,
            dateExpiration: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur me:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
