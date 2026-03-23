export const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XAF', 
    maximumFractionDigits: 0 
  }).format(amount).replace('XAF', 'FCFA');
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'valide':
    case 'validé':
      return 'border border-green-200 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase';
    case 'brouillon':
      return 'border border-yellow-200 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase';
    case 'annule':
    case 'annulé':
      return 'border border-red-200 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase';
    default:
      return 'border border-gray-200 bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'valide': return 'Validé';
    case 'brouillon': return 'Brouillon';
    case 'annule': return 'Annulé';
    default: return status || 'N/A';
  }
};

export const getDocumentTypeLabel = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'devis': return 'Devis';
    case 'facture': return 'Facture';
    case 'bon_commande': return 'Bon de commande';
    case 'bon_livraison': return 'Bon de livraison';
    default: return type || 'N/A';
  }
};
