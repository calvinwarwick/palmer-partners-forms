
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300",
      // Mobile-first: larger switches for better touch targets
      "h-8 w-14",
      // Tablet sizing  
      "sm:h-7 sm:w-12",
      // Desktop sizing
      "md:h-6 md:w-11",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
        // Mobile sizing for thumb
        "h-7 w-7 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
        // Tablet sizing for thumb
        "sm:h-6 sm:w-6 sm:data-[state=checked]:translate-x-5",
        // Desktop sizing for thumb  
        "md:h-5 md:w-5 md:data-[state=checked]:translate-x-5"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
