
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const RadioGroupInput = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: RadioGroupInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        <div className="space-y-3">
          {options.map((option) => (
            <div 
              key={option.value}
              className={cn(
                "py-3 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors radio-container"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={option.value}
                  id={`${id}-${option.value}`}
                  className="flex-shrink-0"
                />
                <label 
                  htmlFor={`${id}-${option.value}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none flex-1"
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FormField>
  );
};
