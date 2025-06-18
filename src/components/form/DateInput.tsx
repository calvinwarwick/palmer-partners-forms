
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DateInput = ({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  hint,
  className,
  disabled = false,
  min,
  max,
}: DateInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500 pointer-events-none z-10" />
        <Input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            "w-full h-11 md:h-12 pl-12 pr-4 py-3 text-sm md:text-base",
            "border-[1.5px] border-gray-300 rounded-lg",
            "bg-white shadow-sm",
            "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
      </div>
    </FormField>
  );
};
