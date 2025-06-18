
import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CheckboxToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const CheckboxToggle = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxToggleProps
>(({ id, label, checked, onCheckedChange, disabled = false, className, required = false }, ref) => {
  return (
    <div className={cn("py-4 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors", className)}>
      <div className="mobile-input-wrapper">
        <Checkbox
          id={id}
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        <label 
          htmlFor={id} 
          className="font-medium text-gray-700 leading-relaxed cursor-pointer select-none flex-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    </div>
  );
});

CheckboxToggle.displayName = "CheckboxToggle";

export { CheckboxToggle };
