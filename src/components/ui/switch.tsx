
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Remove all Tailwind classes that might conflict
      "switch-root",
      className
    )}
    {...props}
    ref={ref}
    data-radix-switch-root=""
    style={{
      width: '44px',
      height: '24px',
      minWidth: '44px',
      minHeight: '24px',
      flexShrink: 0,
      border: '2px solid transparent',
      borderRadius: '12px',
      cursor: 'pointer',
      outline: 'none',
      position: 'relative',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
      backgroundColor: props.checked ? '#FF6F00' : '#9E9E9E'
    }}
  >
    <SwitchPrimitives.Thumb
      className="switch-thumb"
      data-radix-switch-thumb=""
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s ease',
        display: 'block',
        pointerEvents: 'none',
        position: 'relative',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        border: 'none',
        transform: props.checked ? 'translateX(22px)' : 'translateX(2px)'
      }}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
