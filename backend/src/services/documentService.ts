import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';

/**
 * Service de génération de numéros de documents
 * Équivalent VBA: NextReference()
 * Format: PREFIX + AAAA/MM/NNN
 */
export class DocumentService {
  /**
   * Génère le prochain numéro de document
   * @param type Type de document (DEVIS, FACTURE, etc.)
   * @param date Date du document
   * @returns Numéro formaté (ex: DEV2025/01/001)
   */
  static async generateNextNumber(
    type: 'DEVIS' | 'FACTURE' | 'AVOIR',
    date: Date = new Date()
  ): Promise<string> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Préfixes selon le type
    const prefixes = {
      DEVIS: 'DEV',
      FACTURE: '',  // Pas de préfixe pour les factures
      AVOIR: 'AV'
    };
    
    const prefix = prefixes[type];
    
    // Chercher le dernier document du même type et même mois
    const lastDoc = await prisma.document.findFirst({
      where: {
        type,
        numero: {
          startsWith: `${prefix}${year}/${month}/`
        }
      },
      orderBy: {
        numero: 'desc'
      }
    });

    let counter = 1;
    
    if (lastDoc) {
      // Extraire le compteur du dernier numéro
      const parts = lastDoc.numero.split('/');
      if (parts.length === 3) {
        const lastCounter = parseInt(parts[2], 10);
        if (!isNaN(lastCounter)) {
          counter = lastCounter + 1;
        }
      }
    }

    // Format: PREFIX + AAAA/MM/NNN
    return `${prefix}${year}/${month}/${String(counter).padStart(3, '0')}`;
  }

  /**
   * Calcule les montants d'un document (TPS, CSS, remise, etc.)
   * Équivalent VBA: Calculs dans les cellules Excel
   */
  static calculateAmounts(
    soldeHt: number,
    tauxRemise: number = 0.095,
    tauxTps: number = 0.095,
    tauxCss: number = 0.01,
    appliquerRemise: boolean = true
  ) {
    // Remise
    const remise = appliquerRemise ? soldeHt * tauxRemise : 0;
    
    // Sous-total après remise
    const sousTotal = soldeHt - remise;
    
    // TPS (9.5% du sous-total)
    const tps = sousTotal * tauxTps;
    
    // CSS (1% du sous-total)
    const css = sousTotal * tauxCss;
    
    // Net à payer = Sous-total - TPS - CSS
    const netAPayer = sousTotal - tps - css;
    
    // Solde dû (initialement égal au net à payer)
    const soldeDu = netAPayer;

    return {
      soldeHt,
      remise,
      sousTotal,
      tps,
      css,
      netAPayer,
      soldeDu
    };
  }

  /**
   * Génère les lignes d'un document depuis les codes produits
   * Équivalent VBA: GenererFactureDepuisPacks()
   */
  static async generateLignesFromProduits(
    codeProduits: string[]
  ): Promise<Array<{
    produitId: number;
    code: string;
    designation: string;
    prixUnitaire: number;
    quantite: number;
    totalHt: number;
    isMainLine: boolean;
  }>> {
    const lignes: Array<{
      produitId: number;
      code: string;
      designation: string;
      prixUnitaire: number;
      quantite: number;
      totalHt: number;
      isMainLine: boolean;
    }> = [];

    for (const code of codeProduits) {
      if (!code || code.trim() === '') continue;

      // Chercher le produit
      const produit = await prisma.produit.findUnique({
        where: { code: code.trim() }
      });

      if (!produit) {
        // Produit inconnu - ajouter une ligne d'erreur
        lignes.push({
          produitId: 0,
          code: code,
          designation: `Code produit inconnu : ${code}`,
          prixUnitaire: 0,
          quantite: 0,
          totalHt: 0,
          isMainLine: false
        });
        continue;
      }

      // LIGNE PRINCIPALE (en gras dans Excel)
      lignes.push({
        produitId: produit.id,
        code: produit.code,
        designation: produit.label, // DESC_COURTE
        prixUnitaire: Number(produit.prix),
        quantite: 1, // Par défaut, à modifier par l'utilisateur
        totalHt: Number(produit.prix),
        isMainLine: true
      });

      // LIGNES DE DÉTAILS (description complète)
      // Dans votre VBA, c'est T_PACKS_DETAILS
      // Pour l'instant, on utilise le champ description du produit
      if (produit.description) {
        // Diviser la description en lignes (si séparées par des points ou retours à la ligne)
        const details = produit.description
          .split(/[·•\n]/)
          .map(d => d.trim())
          .filter(d => d.length > 0);

        for (const detail of details) {
          lignes.push({
            produitId: produit.id,
            code: '',
            designation: detail,
            prixUnitaire: 0,
            quantite: 0,
            totalHt: 0,
            isMainLine: false
          });
        }
      }
    }

    return lignes;
  }

  /**
   * Crée un document complet avec ses lignes
   */
  static async createDocument(data: {
    type: 'DEVIS' | 'FACTURE' | 'AVOIR';
    clientId: number;
    date: Date;
    reference?: string;
    conditionsPaiement?: string;
    codeProduits: string[];
    quantites?: { [code: string]: number };
    appliquerRemise?: boolean;
  }) {
    // 1. Générer le numéro
    const numero = await this.generateNextNumber(data.type, data.date);

    // 2. Générer les lignes depuis les codes produits
    const lignesGenerated = await this.generateLignesFromProduits(data.codeProduits);

    // 3. Appliquer les quantités personnalisées
    if (data.quantites) {
      for (const ligne of lignesGenerated) {
        if (ligne.isMainLine && data.quantites[ligne.code]) {
          ligne.quantite = data.quantites[ligne.code];
          ligne.totalHt = ligne.prixUnitaire * ligne.quantite;
        }
      }
    }

    // 4. Calculer le solde HT (somme des lignes principales)
    const soldeHt = lignesGenerated
      .filter(l => l.isMainLine)
      .reduce((sum, l) => sum + l.totalHt, 0);

    // 5. Récupérer les taux depuis les paramètres
    const parametres = await prisma.parametres.findUnique({
      where: { id: 1 }
    });

    const tauxRemise = parametres ? Number(parametres.tauxRemise) : 0.095;
    const tauxTps = parametres ? Number(parametres.tauxTps) : 0.095;
    const tauxCss = parametres ? Number(parametres.tauxCss) : 0.01;

    // 6. Calculer les montants
    const amounts = this.calculateAmounts(
      soldeHt,
      tauxRemise,
      tauxTps,
      tauxCss,
      data.appliquerRemise !== false
    );

    // 7. Créer le document avec ses lignes
    const document = await prisma.document.create({
      data: {
        type: data.type,
        numero,
        clientId: data.clientId,
        date: data.date,
        reference: data.reference,
        conditionsPaiement: data.conditionsPaiement,
        ...amounts,
        statut: 'ACTIVE',
        lignes: {
          create: lignesGenerated
            .filter(l => l.produitId > 0) // Exclure les lignes d'erreur
            .map(l => ({
              produitId: l.produitId,
              designation: l.designation,
              quantite: l.quantite || 1,
              prixUnitaire: l.prixUnitaire,
              totalHt: l.totalHt
            }))
        }
      },
      include: {
        lignes: {
          include: {
            produit: true
          }
        },
        client: true
      }
    });

    return document;
  }
}
