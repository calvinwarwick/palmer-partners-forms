
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface CustomToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const CustomToggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  CustomToggleProps
>(({ id, label, checked, onCheckedChange, disabled = false, className, required = false }, ref) => {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-4 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors", className)}>
      <label 
        htmlFor={id} 
        className="flex-1 text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <SwitchPrimitives.Root
        id={id}
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          // Base mobile-first sizing - larger for touch
          "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          // Desktop sizing override
          "md:h-6 md:w-11",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Background colors with proper contrast
          checked ? "bg-orange-500" : "bg-gray-400",
          // Ensure minimum touch target
          "min-w-[56px] min-h-[32px] md:min-w-[44px] md:min-h-[24px]"
        )}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            // Base mobile-first thumb sizing
            "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
            // Desktop sizing override
            "md:h-5 md:w-5",
            // Position based on state - mobile first
            checked ? "translate-x-6 md:translate-x-5" : "translate-x-0.5",
            // Ensure proper shadow and visibility
            "shadow-md border border-gray-200"
          )}
        />
      </SwitchPrimitives.Root>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

export { CustomToggle };
