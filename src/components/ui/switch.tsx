import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      // Base layout - fixed size for consistency across all viewports
      "peer inline-flex h-8 w-14 shrink-0",
      // Visual styling
      "cursor-pointer items-center rounded-full border-2 border-transparent",
      // State colors
      "data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300",
      // Transitions
      "transition-colors duration-200 ease-in-out",
      // Focus states
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      // Disabled states
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Touch optimization
      "touch-manipulation",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        // Base thumb styling - fixed size for consistency
        "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0",
        // Smooth transitions
        "transition-transform duration-200 ease-in-out",
        // Position states - precise positioning for 56px width switch
        "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }