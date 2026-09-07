import type { ReactNode } from 'react';
interface CardProps { children: ReactNode; className?: string; hover?: boolean; }
export default function Card({ children, className = '', hover = false }: CardProps) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1' : ''} ${className}`}>{children}</div>;
}
