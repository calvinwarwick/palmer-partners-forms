
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
    <div className={cn("py-3 sm:py-4 px-3 sm:px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none order-1 sm:order-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex justify-end sm:justify-start order-2 sm:order-none">
          <SwitchPrimitives.Root
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className={cn(
              "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Mobile sizing (matches existing CSS)
              "h-6 w-11 sm:h-6 sm:w-11",
              checked ? "bg-orange-500" : "bg-gray-300"
            )}
          >
            <SwitchPrimitives.Thumb
              className={cn(
                "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
                // Mobile sizing (matches existing CSS)
                "h-5 w-5 sm:h-5 sm:w-5",
                checked ? "translate-x-5" : "translate-x-0"
              )}
            />
          </SwitchPrimitives.Root>
        </div>
      </div>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

export { CustomToggle };
