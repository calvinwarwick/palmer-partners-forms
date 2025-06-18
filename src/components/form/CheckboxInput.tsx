
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface CheckboxInputProps {
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

export const CheckboxInput = ({
  id,
  label,
  checked,
  onCheckedChange,
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: CheckboxInputProps) => {
  return (
    <FormField
      label=""
      required={false}
      error={error}
      hint={hint}
      className={className}
    >
      <div className={cn(
        "py-4 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors checkbox-container"
      )}>
        <div className="flex items-start gap-3">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className="mt-0.5 flex-shrink-0"
          />
          <label 
            htmlFor={id} 
            className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none flex-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      </div>
    </FormField>
  );
};
