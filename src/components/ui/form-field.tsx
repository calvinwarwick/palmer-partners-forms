
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
          <div className="flex items-center justify-between w-full">
            <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
              {typeof label === 'string' ? (
                <>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </>
              ) : (
                <div className="flex items-center">
                  {React.isValidElement(label) && label.props.children ? (
                    <>
                      {typeof label.props.children === 'string' ? label.props.children : label.props.children[0]}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </>
                  ) : (
                    <>
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </>
                  )}
                </div>
              )}
            </Label>
            {React.isValidElement(label) && label.props.children && Array.isArray(label.props.children) && label.props.children[1] && (
              <div className="ml-auto">
                {label.props.children[1]}
              </div>
            )}
          </div>
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
