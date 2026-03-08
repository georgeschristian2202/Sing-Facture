import prisma from '../config/database.js';
import { calculateByCategory } from './calculationService.js';

/**
 * Service de gestion du récapitulatif
 * Reproduit la logique VBA AlimenterRecapDepuisFacture()
 */

interface RecapEntry {
  dateFacture: Date;
  designation: string;
  numeroFacture: string;
  reference?: string;
  montantsParCategorie: Map<string, number>;
  soldeHt: number;
  remise: number;
  sousTotal: number;
  tps: number;
  css: number;
  netAPayer: number;
  soldeDu: number;
  statut: string;
}

/**
 * Créer une entrée dans le récapitulatif depuis une facture
 * @param factureId - ID de la facture
 */
export async function createRecapFromFacture(factureId: number): Promise<RecapEntry> {
  const facture = await prisma.document.findUnique({
    where: { id: factureId },
    include: {
      client: true,
      lignes: {
        include: {
          produit: true
        }
      }
    }
  });

  if (!facture) {
    throw new Error('Facture non trouvée');
  }

  if (facture.type !== 'FACTURE') {
    throw new Error('Le document doit être une facture');
  }

  // Calculer les montants par catégorie
  const montantsParCategorie = await calculateByCategory(factureId);

  // Récupérer la première désignation (description courte du premier produit)
  const designation = facture.lignes.length > 0 
    ? facture.lignes[0].produit.label 
    : 'Facture';

  const recapEntry: RecapEntry = {
    dateFacture: facture.date,
    designation,
    numeroFacture: facture.numero,
    reference: facture.reference || undefined,
    montantsParCategorie,
    soldeHt: Number(facture.soldeHt),
    remise: Number(facture.remise),
    sousTotal: Number(facture.sousTotal),
    tps: Number(facture.tps),
    css: Number(facture.css),
    netAPayer: Number(facture.netAPayer),
    soldeDu: Number(facture.soldeDu),
    statut: facture.statut
  };

  return recapEntry;
}

/**
 * Obtenir le récapitulatif de toutes les factures
 * @param filters - Filtres optionnels
 */
export async function getRecapitulatif(filters?: {
  dateDebut?: Date;
  dateFin?: Date;
  statut?: string;
}) {
  const where: any = {
    type: 'FACTURE'
  };

  if (filters?.dateDebut || filters?.dateFin) {
    where.date = {};
    if (filters.dateDebut) {
      where.date.gte = filters.dateDebut;
    }
    if (filters.dateFin) {
      where.date.lte = filters.dateFin;
    }
  }

  if (filters?.statut) {
    where.statut = filters.statut;
  }

  const factures = await prisma.document.findMany({
    where,
    include: {
      client: true,
      lignes: {
        include: {
          produit: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  // Créer les entrées de récapitulatif
  const recapEntries: RecapEntry[] = [];

  for (const facture of factures) {
    const montantsParCategorie = await calculateByCategory(facture.id);
    
    const designation = facture.lignes.length > 0 
      ? facture.lignes[0].produit.label 
      : 'Facture';

    recapEntries.push({
      dateFacture: facture.date,
      designation,
      numeroFacture: facture.numero,
      reference: facture.reference || undefined,
      montantsParCategorie,
      soldeHt: Number(facture.soldeHt),
      remise: Number(facture.remise),
      sousTotal: Number(facture.sousTotal),
      tps: Number(facture.tps),
      css: Number(facture.css),
      netAPayer: Number(facture.netAPayer),
      soldeDu: Number(facture.soldeDu),
      statut: facture.statut
    });
  }

  return recapEntries;
}

/**
 * Obtenir les statistiques du récapitulatif
 */
export async function getRecapStatistics(filters?: {
  dateDebut?: Date;
  dateFin?: Date;
}) {
  const where: any = {
    type: 'FACTURE'
  };

  if (filters?.dateDebut || filters?.dateFin) {
    where.date = {};
    if (filters.dateDebut) {
      where.date.gte = filters.dateDebut;
    }
    if (filters.dateFin) {
      where.date.lte = filters.dateFin;
    }
  }

  const [totalFactures, facturesActives, facturesPayees, totaux, totalActif, totalPaye] = await Promise.all([
    // Total de factures
    prisma.document.count({ where }),
    
    // Factures actives
    prisma.document.count({ 
      where: { ...where, statut: 'ACTIVE' } 
    }),
    
    // Factures payées
    prisma.document.count({ 
      where: { ...where, statut: 'PAYEE' } 
    }),
    
    // Totaux généraux
    prisma.document.aggregate({
      where,
      _sum: {
        soldeHt: true,
        remise: true,
        netAPayer: true,
        soldeDu: true
      }
    }),
    
    // Total actif
    prisma.document.aggregate({
      where: { ...where, statut: 'ACTIVE' },
      _sum: {
        netAPayer: true,
        soldeDu: true
      }
    }),
    
    // Total payé
    prisma.document.aggregate({
      where: { ...where, statut: 'PAYEE' },
      _sum: {
        netAPayer: true
      }
    })
  ]);

  // Calculer les montants par catégorie
  const factures = await prisma.document.findMany({
    where,
    include: {
      lignes: {
        include: {
          produit: true
        }
      }
    }
  });

  const categoriesMap = new Map<string, number>();

  for (const facture of factures) {
    for (const ligne of facture.lignes) {
      const category = ligne.produit.categorie;
      const total = Number(ligne.totalHt);
      
      if (categoriesMap.has(category)) {
        categoriesMap.set(category, categoriesMap.get(category)! + total);
      } else {
        categoriesMap.set(category, total);
      }
    }
  }

  return {
    totalFactures,
    facturesActives,
    facturesPayees,
    facturesAnnulees: totalFactures - facturesActives - facturesPayees,
    soldeHtTotal: Number(totaux._sum.soldeHt || 0),
    remiseTotal: Number(totaux._sum.remise || 0),
    netAPayerTotal: Number(totaux._sum.netAPayer || 0),
    soldeDuTotal: Number(totaux._sum.soldeDu || 0),
    caActif: Number(totalActif._sum.netAPayer || 0),
    soldeDuActif: Number(totalActif._sum.soldeDu || 0),
    caPaye: Number(totalPaye._sum.netAPayer || 0),
    montantsParCategorie: Object.fromEntries(categoriesMap)
  };
}

/**
 * Exporter le récapitulatif en format CSV
 */
export function exportRecapToCSV(recapEntries: RecapEntry[]): string {
  const headers = [
    'Date',
    'Désignation',
    'N° Facture',
    'Référence',
    'Solde HT',
    'Remise',
    'Sous-total',
    'TPS',
    'CSS',
    'Net à payer',
    'Solde dû',
    'Statut'
  ];

  const rows = recapEntries.map(entry => [
    entry.dateFacture.toLocaleDateString('fr-FR'),
    entry.designation,
    entry.numeroFacture,
    entry.reference || '',
    entry.soldeHt.toString(),
    entry.remise.toString(),
    entry.sousTotal.toString(),
    entry.tps.toString(),
    entry.css.toString(),
    entry.netAPayer.toString(),
    entry.soldeDu.toString(),
    entry.statut
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  return csvContent;
}
