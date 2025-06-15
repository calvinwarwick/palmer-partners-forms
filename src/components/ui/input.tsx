
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg bg-white px-4 py-3 text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "h-11 md:h-12",
          "border-[1.5px] border-gray-300",
          "shadow-sm",
          "focus:border-orange-500",
          "transition-none",
          "font-lexend",
          className
        )}
        style={{
          fontSize: type === 'date' ? '16px' : undefined,
          fontFamily: 'Lexend, sans-serif',
          borderColor: '#e4e4e7',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
