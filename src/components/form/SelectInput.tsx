
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const SelectInput = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: SelectInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            "w-full h-11 md:h-12 px-4 py-3 text-sm md:text-base",
            "border-[1.5px] border-gray-300 rounded-lg",
            "bg-white shadow-sm",
            "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg rounded-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};
