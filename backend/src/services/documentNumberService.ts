import prisma from '../config/database.js';

/**
 * Service de génération de numéros de documents
 * Reproduit la logique VBA NextReference()
 * Format: PREFIX + AAAA/MM/NNN
 */

export type DocumentPrefix = 'DEV' | 'BC' | 'BL' | 'FAC' | 'AV' | '';

interface NextReferenceParams {
  type: 'DEVIS' | 'COMMANDE' | 'LIVRAISON' | 'FACTURE' | 'AVOIR';
  organisationId: number;
  date: Date;
}

/**
 * Génère le prochain numéro de document
 * @param params - Type de document, organisation et date
 * @returns Numéro formaté (ex: DEV2025/01/001, BC2025/01/001)
 */
export async function generateNextReference(params: NextReferenceParams): Promise<string> {
  const { type, organisationId, date } = params;
  
  // Déterminer le préfixe selon le type
  const prefix = getPrefix(type);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Récupérer le dernier document du même type et organisation
  const lastDocument = await prisma.document.findFirst({
    where: { 
      type,
      organisationId
    },
    orderBy: { numero: 'desc' }
  });

  let counter = 1;

  if (lastDocument && lastDocument.numero) {
    const parsed = parseReference(lastDocument.numero, prefix);
    
    // Si même année et même mois, incrémenter
    if (parsed.year === year && parsed.month === month) {
      counter = parsed.counter + 1;
    }
  }

  // Formater le numéro
  const counterStr = String(counter).padStart(3, '0');
  return `${prefix}${year}/${month}/${counterStr}`;
}

/**
 * Obtenir le préfixe selon le type de document
 */
function getPrefix(type: 'DEVIS' | 'COMMANDE' | 'LIVRAISON' | 'FACTURE' | 'AVOIR'): string {
  switch (type) {
    case 'DEVIS':
      return 'DEV';
    case 'COMMANDE':
      return 'BC';
    case 'LIVRAISON':
      return 'BL';
    case 'FACTURE':
      return 'FAC';
    case 'AVOIR':
      return 'AV';
    default:
      return '';
  }
}

/**
 * Parser une référence existante
 */
function parseReference(reference: string, prefix: string): {
  year: number;
  month: string;
  counter: number;
} {
  // Enlever le préfixe
  const withoutPrefix = reference.startsWith(prefix) 
    ? reference.substring(prefix.length) 
    : reference;

  const parts = withoutPrefix.split('/');
  
  if (parts.length !== 3) {
    return { year: 0, month: '00', counter: 0 };
  }

  const year = parseInt(parts[0], 10) || 0;
  const month = parts[1];
  const counter = parseInt(parts[2], 10) || 0;

  return { year, month, counter };
}

/**
 * Valider un numéro de document
 */
export function validateReference(reference: string, type: 'DEVIS' | 'COMMANDE' | 'LIVRAISON' | 'FACTURE' | 'AVOIR'): boolean {
  const prefix = getPrefix(type);
  const pattern = prefix 
    ? new RegExp(`^${prefix}\\d{4}/\\d{2}/\\d{3}$`)
    : /^\d{4}\/\d{2}\/\d{3}$/;
  
  return pattern.test(reference);
}
