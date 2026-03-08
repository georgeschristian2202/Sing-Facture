import prisma from '../config/database.js';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Service de calculs financiers
 * Reproduit la logique VBA de calcul TPS, CSS, remise
 */

export interface LigneCalcul {
  produitId: number;
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export interface CalculResult {
  soldeHt: number;
  remise: number;
  sousTotal: number;
  tps: number;
  css: number;
  netAPayer: number;
  soldeDu: number;
  lignes: Array<{
    produitId: number;
    designation: string;
    quantite: number;
    prixUnitaire: number;
    totalHt: number;
  }>;
}

/**
 * Calculer les montants d'un document
 * @param lignes - Lignes du document
 * @param appliquerRemise - Appliquer la remise par défaut
 * @returns Résultat des calculs
 */
export async function calculateDocument(
  lignes: LigneCalcul[],
  appliquerRemise: boolean = true
): Promise<CalculResult> {
  // Récupérer les paramètres (taux)
  const parametres = await prisma.parametres.findUnique({
    where: { id: 1 }
  });

  if (!parametres) {
    throw new Error('Paramètres non trouvés');
  }

  const tauxTps = Number(parametres.tauxTps);
  const tauxCss = Number(parametres.tauxCss);
  const tauxRemise = Number(parametres.tauxRemise);

  // Calculer le total HT de chaque ligne
  const lignesAvecTotal = lignes.map(ligne => ({
    ...ligne,
    totalHt: ligne.quantite * ligne.prixUnitaire
  }));

  // Solde HT (somme des lignes)
  const soldeHt = lignesAvecTotal.reduce((sum, ligne) => sum + ligne.totalHt, 0);

  // Remise (9.5% par défaut)
  const remise = appliquerRemise ? soldeHt * tauxRemise : 0;

  // Sous-total après remise
  const sousTotal = soldeHt - remise;

  // TPS (9.5% sur sous-total)
  const tps = sousTotal * tauxTps;

  // CSS (1% sur sous-total)
  const css = sousTotal * tauxCss;

  // Net à payer = Sous-total + TPS + CSS
  const netAPayer = sousTotal + tps + css;

  // Solde dû (initialement égal au net à payer)
  const soldeDu = netAPayer;

  return {
    soldeHt: Math.round(soldeHt * 100) / 100,
    remise: Math.round(remise * 100) / 100,
    sousTotal: Math.round(sousTotal * 100) / 100,
    tps: Math.round(tps * 100) / 100,
    css: Math.round(css * 100) / 100,
    netAPayer: Math.round(netAPayer * 100) / 100,
    soldeDu: Math.round(soldeDu * 100) / 100,
    lignes: lignesAvecTotal.map(l => ({
      ...l,
      totalHt: Math.round(l.totalHt * 100) / 100
    }))
  };
}

/**
 * Recalculer un document existant
 */
export async function recalculateDocument(documentId: number): Promise<CalculResult> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { lignes: true }
  });

  if (!document) {
    throw new Error('Document non trouvé');
  }

  const lignes: LigneCalcul[] = document.lignes.map(l => ({
    produitId: l.produitId,
    designation: l.designation,
    quantite: l.quantite,
    prixUnitaire: Number(l.prixUnitaire)
  }));

  const appliquerRemise = Number(document.remise) > 0;

  return calculateDocument(lignes, appliquerRemise);
}

/**
 * Formater un montant en FCFA
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

/**
 * Calculer le montant par catégorie de service
 * Utilisé pour le récapitulatif
 */
export async function calculateByCategory(documentId: number): Promise<Map<string, number>> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      lignes: {
        include: {
          produit: true
        }
      }
    }
  });

  if (!document) {
    throw new Error('Document non trouvé');
  }

  const categoryTotals = new Map<string, number>();

  for (const ligne of document.lignes) {
    const category = ligne.produit.categorie;
    const total = Number(ligne.totalHt);
    
    if (categoryTotals.has(category)) {
      categoryTotals.set(category, categoryTotals.get(category)! + total);
    } else {
      categoryTotals.set(category, total);
    }
  }

  return categoryTotals;
}
