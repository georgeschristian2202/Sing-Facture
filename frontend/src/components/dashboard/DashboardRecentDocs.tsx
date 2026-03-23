import { formatFCFA, getStatusBadgeStyle, getDocumentTypeLabel, getStatusLabel } from '../../lib/calculUtils';

export default function DashboardRecentDocs({ documents }: { documents: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-sm font-bold text-[#00303C]">Derniers documents</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Référence</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium text-right">Montant</th>
              <th className="px-6 py-3 font-medium text-center">Statut</th>
              <th className="px-6 py-3 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Aucun document récent
                </td>
              </tr>
            ) : documents.map((doc, i) => (
              <tr key={doc.id || i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#00758D]">{doc.reference || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{getDocumentTypeLabel(doc.type_document)}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{doc.client_nom || 'Client inconnu'}</td>
                <td className="px-6 py-4 text-right font-bold text-[#00303C]">{formatFCFA(doc.net_a_payer || 0)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={getStatusBadgeStyle(doc.statut)}>{getStatusLabel(doc.statut)}</span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500">
                  {doc.created_date ? new Date(doc.created_date).toLocaleDateString('fr-FR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
