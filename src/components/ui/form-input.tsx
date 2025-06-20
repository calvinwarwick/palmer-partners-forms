
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

interface FormInputProps {
  id: string
  type?: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, type = "text", label, value, onChange, placeholder, required, error, className }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        htmlFor={id}
        error={error}
        className={className}
      >
        <Input
          id={id}
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </FormField>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
