
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles - consistent across all screen sizes
      "peer shrink-0 rounded border-2 border-orange-400 bg-white shadow-sm",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-white data-[state=checked]:border-orange-500",
      "hover:bg-orange-50 hover:border-orange-500 transition-colors duration-200",
      // Mobile-first: Large touch targets for mobile (28px)
      "w-7 h-7",
      // Tablet sizing (20px)
      "sm:w-5 sm:h-5",
      // Desktop sizing (16px)
      "md:w-4 md:h-4",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-orange-500")}
    >
      <Check className="h-5 w-5 sm:h-4 sm:w-4 md:h-3 md:w-3 stroke-[3] text-orange-500" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
