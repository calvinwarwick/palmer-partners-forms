
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface YesNoSelectProps {
  id: string
  label: string
  value?: boolean
  onValueChange: (value: boolean) => void
  required?: boolean
  className?: string
}

const YesNoSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  YesNoSelectProps
>(({ id, label, value, onValueChange, required = false, className }, ref) => {
  const handleValueChange = (stringValue: string) => {
    onValueChange(stringValue === "yes")
  }

  const selectValue = value === undefined ? "" : value ? "yes" : "no"

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="form-label">
        {label} {required && <span className="required-asterisk">*</span>}
      </Label>
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger 
          ref={ref}
          id={id}
          className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
})

YesNoSelect.displayName = "YesNoSelect"

export { YesNoSelect }
