interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-neutral-200 border-t-neutral-600 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingSpinner({ size = 'md', text, className = '' }: SpinnerProps & { text?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size={size} />
      {text && (
        <span className={`text-neutral-600 ${textSizeClasses[size]}`}>{text}</span>
      )}
    </div>
  )
}
