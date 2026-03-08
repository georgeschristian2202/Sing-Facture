import prisma from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  const email = 'testpersonncompte@gmail.com';
  
  console.log('🔍 Recherche de l\'utilisateur:', email);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organisation: true
    }
  });

  if (!user) {
    console.log('❌ Utilisateur non trouvé dans la base de données');
    console.log('📋 Liste des utilisateurs existants:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        role: true
      }
    });
    console.table(allUsers);
  } else {
    console.log('✅ Utilisateur trouvé:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Nom:', user.nom);
    console.log('- Role:', user.role);
    console.log('- Organisation:', user.organisation.nom);
    console.log('- Organisation active:', user.organisation.actif);
    
    // Test du mot de passe
    const testPassword = 'votre_mot_de_passe_ici'; // Remplacez par votre mot de passe
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('\n🔐 Test mot de passe:', isValid ? '✅ Valide' : '❌ Invalide');
  }

  await prisma.$disconnect();
}

testLogin().catch(console.error);
