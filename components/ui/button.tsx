import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }

    const variantClasses = {
      default: 'bg-primary text-white hover:opacity-90',
      outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800',
      ghost: 'hover:bg-slate-800'
    }

    return (
      <button
        ref={ref}
        className={`rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
