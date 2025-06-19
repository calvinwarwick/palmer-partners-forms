import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SwitchFieldProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
}

const SwitchField = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchFieldProps
>(({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  required,
  disabled,
  error,
  className
}, ref) => {
  return (
    <div className={cn(
      // Base container styling - consistent across all viewports
      "w-full p-4 border-2 border-gray-200 rounded-lg bg-white",
      // Hover and interaction states
      !disabled && "hover:border-gray-300 hover:bg-gray-50",
      disabled && "opacity-50 cursor-not-allowed",
      error && "border-red-500",
      // Smooth transitions
      "transition-all duration-200",
      // Touch optimization
      "touch-manipulation",
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* Label and description section */}
        <div className="flex-1 space-y-1 min-w-0">
          <Label 
            htmlFor={id} 
            className={cn(
              // Consistent label styling across viewports
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
        
        {/* Switch container - ensures proper alignment */}
        <div className="flex-shrink-0">
          <Switch
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-describedby={description ? `${id}-description` : undefined}
          />
        </div>
      </div>
    </div>
  )
})
SwitchField.displayName = "SwitchField"

export { SwitchField }