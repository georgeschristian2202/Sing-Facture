import prisma from '../config/database.js';

/**
 * Service de gestion du récapitulatif
 * Équivalent VBA: AlimenterRecapDepuisFacture()
 */
export class RecapService {
  /**
   * Alimente le récapitulatif depuis une facture
   * Cette fonction est appelée automatiquement lors de l'enregistrement d'une facture
   */
  static async alimenterDepuisFacture(factureId: number) {
    // Récupérer la facture complète avec ses lignes et produits
    const facture = await prisma.document.findUnique({
      where: { id: factureId },
      include: {
        lignes: {
          include: {
            produit: true
          }
        },
        client: true
      }
    });

    if (!facture || facture.type !== 'FACTURE') {
      throw new Error('Document non trouvé ou n\'est pas une facture');
    }

    // Grouper les montants par catégorie de produit
    const montantsParCategorie: { [categorie: string]: number } = {};
    let designation = '';

    for (const ligne of facture.lignes) {
      if (ligne.produit) {
        const categorie = ligne.produit.categorie;
        const montant = Number(ligne.totalHt);

        if (!montantsParCategorie[categorie]) {
          montantsParCategorie[categorie] = 0;
        }
        montantsParCategorie[categorie] += montant;

        // Prendre la première désignation (DESC_COURTE)
        if (!designation && ligne.produit.label) {
          designation = ligne.produit.label;
        }
      }
    }

    // Créer une entrée de récapitulatif
    // Note: Vous devrez créer un modèle Recap dans Prisma
    // Pour l'instant, on retourne les données structurées
    const recapData = {
      dateFacture: facture.date,
      designation,
      numeroFacture: facture.numero,
      numeroBC: facture.reference || '',
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

    return recapData;
  }

  /**
   * Récupère le récapitulatif complet
   * Équivalent à la feuille "Recap Sing" dans Excel
   */
  static async getRecapitulatif(filters?: {
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
        lignes: {
          include: {
            produit: true
          }
        },
        client: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transformer en format récapitulatif
    const recap = factures.map(facture => {
      // Grouper par catégorie
      const montantsParCategorie: { [categorie: string]: number } = {};
      let designation = '';

      for (const ligne of facture.lignes) {
        if (ligne.produit) {
          const categorie = ligne.produit.categorie;
          const montant = Number(ligne.totalHt);

          if (!montantsParCategorie[categorie]) {
            montantsParCategorie[categorie] = 0;
          }
          montantsParCategorie[categorie] += montant;

          if (!designation && ligne.produit.label) {
            designation = ligne.produit.label;
          }
        }
      }

      return {
        id: facture.id,
        dateFacture: facture.date,
        designation,
        numeroFacture: facture.numero,
        numeroBC: facture.reference || '',
        clientNom: facture.client.nom,
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
    });

    // Calculer les totaux par catégorie
    const totauxParCategorie: { [categorie: string]: number } = {};
    let totalSoldeHt = 0;
    let totalRemise = 0;
    let totalSousTotal = 0;
    let totalTps = 0;
    let totalCss = 0;
    let totalNetAPayer = 0;
    let totalSoldeDu = 0;

    for (const ligne of recap) {
      // Totaux par catégorie
      for (const [categorie, montant] of Object.entries(ligne.montantsParCategorie)) {
        if (!totauxParCategorie[categorie]) {
          totauxParCategorie[categorie] = 0;
        }
        totauxParCategorie[categorie] += montant;
      }

      // Totaux généraux
      totalSoldeHt += ligne.soldeHt;
      totalRemise += ligne.remise;
      totalSousTotal += ligne.sousTotal;
      totalTps += ligne.tps;
      totalCss += ligne.css;
      totalNetAPayer += ligne.netAPayer;
      totalSoldeDu += ligne.soldeDu;
    }

    return {
      lignes: recap,
      totaux: {
        parCategorie: totauxParCategorie,
        soldeHt: totalSoldeHt,
        remise: totalRemise,
        sousTotal: totalSousTotal,
        tps: totalTps,
        css: totalCss,
        netAPayer: totalNetAPayer,
        soldeDu: totalSoldeDu
      }
    };
  }

  /**
   * Exporte le récapitulatif en format Excel/CSV
   */
  static async exportRecap(format: 'excel' | 'csv' = 'excel') {
    const recap = await this.getRecapitulatif();
    
    // TODO: Implémenter l'export Excel avec une librairie comme exceljs
    // Pour l'instant, retourner les données brutes
    return recap;
  }
}
