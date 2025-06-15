
import * as React from "react"
import { Label as FlowbiteLabel } from "flowbite-react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <FlowbiteLabel
    ref={ref}
    className={cn(
      "text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
