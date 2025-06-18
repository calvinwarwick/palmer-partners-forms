
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
    <div className={cn("py-4 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none"
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
          style={{
            all: 'unset',
            width: '44px',
            height: '24px',
            backgroundColor: checked ? '#e35c00' : '#d1d5db',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer',
            border: '2px solid transparent',
            transition: 'background-color 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <SwitchPrimitives.Thumb
            style={{
              all: 'unset',
              display: 'block',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s ease',
              transform: checked ? 'translateX(20px)' : 'translateX(0)',
              willChange: 'transform',
            }}
          />
        </SwitchPrimitives.Root>
      </div>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

export { CustomToggle };
