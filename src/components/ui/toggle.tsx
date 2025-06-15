
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        yesno: "border border-gray-300 bg-white hover:bg-gray-50 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:border-orange-500",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-4 min-w-11",
        yesno: "h-10 px-6 min-w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

// Yes/No Toggle Component
const YesNoToggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, 'children'> & {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }
>(({ className, pressed, onPressedChange, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <Toggle
      ref={ref}
      variant="yesno"
      size="yesno"
      pressed={!pressed}
      onPressedChange={(isPressed) => onPressedChange?.(!isPressed)}
      className={cn(
        "data-[state=on]:bg-gray-500 data-[state=on]:border-gray-500",
        className
      )}
      {...props}
    >
      No
    </Toggle>
    <Toggle
      variant="yesno"
      size="yesno"
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={className}
    >
      Yes
    </Toggle>
  </div>
))

YesNoToggle.displayName = "YesNoToggle"

export { Toggle, YesNoToggle, toggleVariants }
