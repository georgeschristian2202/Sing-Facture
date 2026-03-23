import { LucideIcon } from 'lucide-react';

interface DashboardKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'teal' | 'amber' | 'blue' | 'purple';
}

export default function DashboardKPICard({ title, value, icon: Icon, color }: DashboardKPICardProps) {
  const colors = {
    teal: 'bg-[#00758D]/10 text-[#00758D]',
    amber: 'bg-[#DFC32F]/20 text-[#5C4621]',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-black text-[#00303C]">
        {value}
      </div>
    </div>
  );
}
