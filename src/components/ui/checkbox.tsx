
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
      // Mobile-first: Large touch targets for mobile
      "peer w-6 h-6 shrink-0 rounded-md border-2 border-orange-400 bg-white shadow-sm",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
      "hover:bg-orange-50 hover:border-orange-500 transition-colors duration-200",
      // Tablet sizing
      "sm:w-5 sm:h-5 sm:border sm:rounded-sm",
      // Desktop sizing  
      "md:w-4 md:h-4",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-white")}
    >
      <Check className="h-4 w-4 sm:h-3 sm:w-3 md:h-2.5 md:w-2.5 stroke-[3] text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
