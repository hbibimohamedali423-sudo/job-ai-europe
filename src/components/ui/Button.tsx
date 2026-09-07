import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; loading?: boolean; fullWidth?: boolean; }
const variants: Record<Variant, string> = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-lg shadow-teal-600/20 focus:ring-teal-500',
  secondary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 shadow-lg shadow-gray-900/10 focus:ring-gray-700',
  outline: 'border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600 bg-white hover:bg-teal-50/50 focus:ring-teal-500',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-600/20 focus:ring-red-500',
};
const sizes: Record<Size, string> = { sm: 'px-3.5 py-2 text-sm gap-1.5 rounded-lg', md: 'px-5 py-2.5 text-sm gap-2 rounded-xl', lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl' };
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, className = '', children, ...props }, ref) => {
  return <button ref={ref} disabled={disabled || loading} className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}</button>;
});
Button.displayName = 'Button';
export default Button;
