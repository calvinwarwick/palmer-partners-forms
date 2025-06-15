
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  id?: string;
  disabled?: boolean;
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ value, onValueChange, placeholder, options, className, id, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex h-11 md:h-12 w-full items-center justify-between rounded-lg border-[1.5px] border-gray-300 bg-white px-4 py-3 text-gray-900 ring-offset-background placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer font-lexend transition-none",
            "text-sm md:text-base",
            className
          )}
          style={{
            borderColor: '#e4e4e7',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Lexend, sans-serif',
            backgroundColor: 'white',
            color: '#111827'
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ color: '#9ca3af' }}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              style={{ 
                color: '#111827',
                backgroundColor: 'white',
                fontFamily: 'Lexend, sans-serif'
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 pointer-events-none" />
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
