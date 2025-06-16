
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
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-orange-500" : "bg-gray-300"
        )}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

export { CustomToggle };
