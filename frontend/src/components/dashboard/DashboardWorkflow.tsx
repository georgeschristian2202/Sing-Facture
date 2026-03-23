import { FileText, ShoppingCart, Truck, Receipt, BarChart3, ArrowRight } from 'lucide-react';

export default function DashboardWorkflow({ documents }: { documents: any[] }) {
  const steps = [
    { id: 'devis', label: 'Devis', icon: FileText, color: 'bg-[#00758D]/10 text-[#00758D]' },
    { id: 'commande', label: 'Commandement', icon: ShoppingCart, color: 'bg-[#8E0B56]/10 text-[#8E0B56]' },
    { id: 'livraison', label: 'Livraison', icon: Truck, color: 'bg-[#5C4621]/10 text-[#5C4621]' },
    { id: 'facture', label: 'Facture', icon: Receipt, color: 'bg-[#00303C]/10 text-[#00303C]' },
    { id: 'recap', label: 'Récap', icon: BarChart3, color: 'bg-[#DFC32F]/20 text-[#DFC32F]' },
  ];

  const getCount = (type: string) => {
    if (type === 'recap') return documents.filter(d => d.type_document === 'facture' && d.statut === 'valide').length;
    return documents.filter(d => d.type_document === type).length;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-sm font-bold text-[#00303C] mb-6">Flux commercial</h2>
      <div className="flex items-center justify-between px-2 sm:px-8 overflow-x-auto pb-4">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 mb-1">{step.label}</span>
              <span className="text-lg font-bold text-[#00303C]">{getCount(step.id)}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-4 sm:mx-8 flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
