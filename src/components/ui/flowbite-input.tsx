
import * as React from "react"
import { TextInput } from "flowbite-react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <TextInput
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md bg-white px-3 py-3 text-sm transition-colors",
          "focus:ring-orange-500 focus:border-orange-500",
          "border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
