
import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FormCheckboxProps {
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

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  FormCheckboxProps
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
      "space-y-2",
      error && "space-y-1",
      className
    )}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          ref={ref}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium text-gray-700 cursor-pointer block leading-relaxed",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 ml-6">
          {error}
        </p>
      )}
    </div>
  )
})
FormCheckbox.displayName = "FormCheckbox"

export { FormCheckbox }
