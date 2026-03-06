import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'facturepro.db'));

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Créer les tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nom TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    adresse TEXT,
    tel TEXT,
    email TEXT,
    pays TEXT DEFAULT 'Gabon',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    prix REAL NOT NULL,
    categorie TEXT NOT NULL,
    description TEXT,
    actif INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    numero TEXT UNIQUE NOT NULL,
    client_id INTEGER NOT NULL,
    date DATE NOT NULL,
    reference TEXT,
    solde_ht REAL NOT NULL,
    remise REAL DEFAULT 0,
    sous_total REAL NOT NULL,
    tps REAL NOT NULL,
    css REAL NOT NULL,
    net_a_payer REAL NOT NULL,
    solde_du REAL NOT NULL,
    statut TEXT DEFAULT 'Active',
    conditions_paiement TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS lignes_document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    designation TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    prix_unitaire REAL NOT NULL,
    total_ht REAL NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
  );

  CREATE TABLE IF NOT EXISTS parametres (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nom_entreprise TEXT DEFAULT 'SING S.A.',
    adresse TEXT DEFAULT 'BP. 2280, Centre Ville, Libreville – Gabon',
    telephone TEXT DEFAULT '+241 74 13 71 03',
    email TEXT DEFAULT 'info@sing.ga',
    site_web TEXT DEFAULT 'https://www.sing.ga/',
    rccm TEXT DEFAULT 'RG LBV 2018B22204',
    capital TEXT DEFAULT '50 000 000 FCFA',
    taux_tps REAL DEFAULT 0.095,
    taux_css REAL DEFAULT 0.01,
    taux_tva REAL DEFAULT 0.18,
    taux_remise REAL DEFAULT 0.095,
    rib_uba TEXT DEFAULT '40025 05801 80100300296 81',
    rib_afg TEXT DEFAULT '40001 09070 07000615101 36'
  );
`);

// Insérer les paramètres par défaut
const insertParams = db.prepare(`
  INSERT OR IGNORE INTO parametres (id) VALUES (1)
`);
insertParams.run();

console.log('✅ Base de données initialisée');

export default db;
