import { Briefcase } from 'lucide-react';
interface LogoProps { size?: 'sm' | 'md' | 'lg'; showText?: boolean; className?: string; }
const iconSizes = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12' };
const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };
export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20`}>
          <Briefcase className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />
        </div>
      </div>
      {showText && <span className={`${textSizes[size]} font-bold tracking-tight text-gray-900`}>Job<span className="text-teal-600">Forge</span></span>}
    </div>
  );
}
