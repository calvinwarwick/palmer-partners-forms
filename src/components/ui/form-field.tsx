
import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  children: React.ReactNode
  label?: string | React.ReactNode
  description?: string
  error?: string
  required?: boolean
  className?: string
  htmlFor?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, label, description, error, required, className, htmlFor }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
            {typeof label === 'string' ? (
              <>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </>
            ) : (
              <div className="flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </div>
            )}
          </Label>
        )}
        {children}
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }
