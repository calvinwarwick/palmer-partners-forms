
import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/components/ui/form-field"

interface FormSelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: FormSelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ id, label, value, onChange, options, placeholder, required, error, className }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        htmlFor={id}
        error={error}
        className={className}
      >
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger ref={ref} id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    )
  }
)
FormSelect.displayName = "FormSelect"

export { FormSelect }
