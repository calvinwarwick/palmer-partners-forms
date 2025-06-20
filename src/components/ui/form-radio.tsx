
import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/ui/form-field"

interface FormRadioOption {
  value: string
  label: string
  description?: string
}

interface FormRadioProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: FormRadioOption[]
  required?: boolean
  error?: string
  className?: string
}

const FormRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  FormRadioProps
>(({ id, label, value, onChange, options, required, error, className }, ref) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <RadioGroup
        ref={ref}
        value={value}
        onValueChange={onChange}
        className="space-y-4"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={option.value}
              id={`${id}-${option.value}`}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={`${id}-${option.value}`}
                className="text-sm font-medium text-gray-700 cursor-pointer block"
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </FormField>
  )
})
FormRadio.displayName = "FormRadio"

export { FormRadio }
