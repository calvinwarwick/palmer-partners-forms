
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-4 py-3 text-gray-900 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical font-lexend transition-none",
          className
        )}
        style={{
          borderColor: '#e4e4e7',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Lexend, sans-serif'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
