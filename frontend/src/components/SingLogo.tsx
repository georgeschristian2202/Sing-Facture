export default function SingLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isLg = size === 'lg';
  const containerClass = isLg ? 'w-12 h-12 p-2' : 'w-8 h-8 p-1';
  const textClass = isLg ? 'text-2xl text-white' : 'text-lg text-[#00303C]';
  const logoTextClass = isLg ? 'text-xl' : 'text-sm';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-lg bg-[#00303C] border border-gray-700 flex items-center justify-center ${containerClass}`}>
        <span className={`text-[#DFC32F] font-bold ${logoTextClass}`}>$</span>
      </div>
      <span className={`font-bold ${textClass}`}>SING-Facturation</span>
    </div>
  );
}
