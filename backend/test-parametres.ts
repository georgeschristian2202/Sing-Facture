import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Remplacer par un vrai token d'authentification
const TOKEN = 'votre_token_ici';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testParametres() {
  console.log('🧪 Test du module Paramètres\n');

  try {
    // Test GET
    console.log('1️⃣ Test GET /api/parametres');
    const getResponse = await api.get('/parametres');
    console.log('✅ Paramètres récupérés:', JSON.stringify(getResponse.data, null, 2));
    console.log('');

    // Test PUT
    console.log('2️⃣ Test PUT /api/parametres');
    const updateData = {
      nomEntreprise: 'SING',
      adresse: 'BP. 2280, Centre Ville, Libreville — Gabon',
      telephone: '+241 74 13 71 03',
      email: 'info@sing.ga',
      siteWeb: 'https://www.sing.ga/',
      rccm: 'PG-LBV-01-4852204',
      numStatistique: '0465206',
      capital: '50 000 000 FCFA',
      tauxTps: 0.095,
      tauxCss: 0.01,
      tauxTva: 0.18,
      tauxRemise: 0.095,
      typeTaxe: 'TVA',
      modalitesPaiement: ['Virement bancaire', 'Chèque', 'Espèces'],
      conditionsPaiement: ['Paiement à 30 jours', 'Paiement à réception', 'Paiement comptant']
    };

    const putResponse = await api.put('/parametres', updateData);
    console.log('✅ Paramètres mis à jour:', JSON.stringify(putResponse.data, null, 2));
    console.log('');

    // Vérification
    console.log('3️⃣ Vérification des modifications');
    const verifyResponse = await api.get('/parametres');
    console.log('✅ Paramètres vérifiés:', JSON.stringify(verifyResponse.data, null, 2));
    console.log('');

    console.log('✅ Tous les tests sont passés!');
  } catch (error: any) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

// Instructions
console.log('📝 Instructions:');
console.log('1. Démarrer le serveur backend: npm run dev');
console.log('2. Se connecter et récupérer un token');
console.log('3. Remplacer TOKEN dans ce fichier');
console.log('4. Exécuter: npx ts-node test-parametres.ts\n');

// Décommenter pour exécuter
// testParametres();
