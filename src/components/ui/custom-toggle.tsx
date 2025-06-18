
import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  React.ElementRef<typeof Switch>,
  CustomToggleProps
>(({ id, label, checked, onCheckedChange, disabled = false, className, required = false }, ref) => {
  return (
    <div className={cn("py-3 sm:py-4 px-3 sm:px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <Label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none order-1 sm:order-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex justify-end sm:justify-start order-2 sm:order-none">
          <Switch
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

export { CustomToggle };
