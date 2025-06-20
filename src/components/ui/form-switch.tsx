
import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface FormSwitchProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
}

const FormSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  FormSwitchProps
>(({
  id,
  label,
  description,
  checked,
  onChange,
  required,
  disabled,
  error,
  className
}, ref) => {
  return (
    <div className={cn(
      "w-full p-4 border-2 border-gray-200 rounded-lg bg-white",
      !disabled && "hover:border-gray-300 hover:bg-gray-50",
      disabled && "opacity-50 cursor-not-allowed",
      error && "border-red-500",
      "transition-all duration-200 touch-manipulation",
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1 min-w-0">
          <Label 
            htmlFor={id} 
            className={cn(
              "text-sm font-medium text-gray-700 leading-relaxed cursor-pointer block",
              disabled && "cursor-not-allowed"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <Switch
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            aria-describedby={description ? `${id}-description` : undefined}
          />
        </div>
      </div>
    </div>
  )
})
FormSwitch.displayName = "FormSwitch"

export { FormSwitch }
