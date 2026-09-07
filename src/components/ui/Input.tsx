import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: ReactNode; }
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</div>}
        <input ref={ref} id={inputId} className={`w-full rounded-xl border-2 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${icon ? 'pl-11' : ''} ${error ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-gray-200 focus:border-teal-500 bg-white'} ${className}`} {...props} />
      </div>
      {error && <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" /><span>{error}</span></div>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
