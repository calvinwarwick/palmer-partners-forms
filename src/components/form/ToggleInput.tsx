
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface ToggleInputProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const ToggleInput = ({
  id,
  label,
  checked,
  onCheckedChange,
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: ToggleInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <div className={cn(
        "py-4 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors",
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      )}>
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none flex-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="data-[state=checked]:bg-orange-500"
        />
      </div>
    </FormField>
  );
};
