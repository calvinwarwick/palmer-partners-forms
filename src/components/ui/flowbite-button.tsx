
import * as React from "react"
import { Button as FlowbiteButton } from "flowbite-react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, disabled, onClick, type, ...props }, ref) => {
    const getFlowbiteColor = () => {
      switch (variant) {
        case 'destructive':
          return 'failure'
        case 'outline':
          return 'light'
        case 'secondary':
          return 'gray'
        case 'ghost':
          return 'light'
        case 'link':
          return 'light'
        default:
          return 'warning' // Using warning for our orange theme
      }
    }

    const getFlowbiteSize = () => {
      switch (size) {
        case 'sm':
          return 'sm'
        case 'lg':
          return 'lg'
        case 'icon':
          return 'sm'
        default:
          return 'md'
      }
    }

    const customClassName = cn(
      variant === 'default' && 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300',
      variant === 'outline' && 'border-orange-500 text-orange-500 hover:bg-orange-50',
      variant === 'ghost' && 'text-orange-500 hover:bg-orange-50',
      variant === 'link' && 'text-orange-500 underline-offset-4 hover:underline',
      size === 'icon' && 'h-10 w-10 p-0',
      className
    )

    return (
      <FlowbiteButton
        ref={ref}
        color={getFlowbiteColor()}
        size={getFlowbiteSize()}
        disabled={disabled}
        onClick={onClick}
        type={type}
        className={customClassName}
        {...props}
      >
        {children}
      </FlowbiteButton>
    )
  }
)
Button.displayName = "Button"

export { Button }
