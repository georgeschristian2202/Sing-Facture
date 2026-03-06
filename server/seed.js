import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('🌱 Initialisation des données de démonstration...');

// Créer un utilisateur de test
const hashedPassword = await bcrypt.hash('demo123', 10);
const userStmt = db.prepare('INSERT OR IGNORE INTO users (email, password, nom, role) VALUES (?, ?, ?, ?)');
userStmt.run('demo@sing.ga', hashedPassword, 'Utilisateur Demo', 'admin');

// Insérer les clients
const clientStmt = db.prepare('INSERT OR IGNORE INTO clients (nom, adresse, tel, email, pays) VALUES (?, ?, ?, ?, ?)');
const clients = [
  ['SING', 'BP. 2280, Centre Ville, Libreville – Gabon', '+241 74 13 71 03', 'info@sing.ga', 'Gabon'],
  ['Emmanuel Edgardo', '10, rue Cambacérès 75008 Paris', '01 42 66 68 49', 'emmanuel@example.com', 'France'],
  ['Gracia Cestin', 'BP 65054 31033 Toulouse', '01 58 22 17 10', 'gracia@example.com', 'France']
];

clients.forEach(c => {
  try {
    clientStmt.run(...c);
  } catch (e) {
    // Ignore si déjà existant
  }
});

// Insérer les produits
const produitStmt = db.prepare('INSERT OR IGNORE INTO produits (code, label, prix, categorie, description) VALUES (?, ?, ?, ?, ?)');
const produits = [
  ['S1', 'Assistance technique - Programme crysalis', 1119, 'Programme', 'Assistance technique complète pour le programme crysalis'],
  ['S2', 'Assistance technique – Programme 3 mois – 5 bénéficiaires', 8886, 'SING Logiciels', 'Programme d\'assistance sur 3 mois pour 5 bénéficiaires'],
  ['S3', 'Organisation comité de sélection et attribution de fonds', 500074, 'Programme', 'Organisation complète du comité de sélection'],
  ['L1', 'Développement application web', 250000, 'SING Logiciels', 'Développement d\'une application web sur mesure'],
  ['L2', 'Service Cloud mensuel', 15000, 'SING Logiciels', 'Hébergement et maintenance cloud'],
  ['C1', 'Innovation Day', 75000, 'SING Conseil', 'Journée d\'innovation pour votre entreprise'],
  ['C2', 'Retraite d\'Innovation Stratégique', 150000, 'SING Conseil', 'Retraite stratégique de 2 jours'],
  ['I1', 'Mise à disposition de salle', 25000, 'Incubateur', 'Location de salle pour événements'],
  ['I2', 'Coworking mensuel', 50000, 'Incubateur', 'Accès coworking pour 1 mois']
];

produits.forEach(p => {
  try {
    produitStmt.run(...p);
  } catch (e) {
    // Ignore si déjà existant
  }
});

console.log('✅ Données de démonstration insérées');
console.log('\n📧 Compte de test créé:');
console.log('   Email: demo@sing.ga');
console.log('   Mot de passe: demo123');
console.log('\n🎉 Vous pouvez maintenant démarrer le serveur avec: npm start');

process.exit(0);
