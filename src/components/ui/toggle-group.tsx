
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

// Yes/No Toggle Group
const YesNoToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'type'> & {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    type="single"
    value={value ? "yes" : "no"}
    onValueChange={(newValue) => {
      if (newValue === "yes") onValueChange?.(true);
      else if (newValue === "no") onValueChange?.(false);
    }}
    className={cn("flex items-center gap-1 border border-gray-300 rounded-md p-1 bg-gray-50", className)}
    {...props}
  >
    <ToggleGroupItem 
      value="no" 
      variant="yesno" 
      size="yesno"
      className="data-[state=on]:bg-gray-500 data-[state=on]:border-gray-500 border-0 bg-transparent hover:bg-gray-200"
    >
      No
    </ToggleGroupItem>
    <ToggleGroupItem 
      value="yes" 
      variant="yesno" 
      size="yesno"
      className="border-0 bg-transparent hover:bg-orange-100"
    >
      Yes
    </ToggleGroupItem>
  </ToggleGroupPrimitive.Root>
))

YesNoToggleGroup.displayName = "YesNoToggleGroup"

export { ToggleGroup, ToggleGroupItem, YesNoToggleGroup }
