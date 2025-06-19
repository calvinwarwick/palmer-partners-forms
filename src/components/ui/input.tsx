
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg bg-white px-4 py-3 text-sm md:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[48px] h-11 md:h-12", // Mobile-friendly touch target
          "border-[1.5px] border-gray-300",
          "shadow-sm",
          "text-gray-900 placeholder:text-gray-500",
          "touch-manipulation", // Better mobile interaction
          className
        )}
        style={{
          fontSize: '16px', // Prevent zoom on iOS for all inputs
          transition: 'none'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
