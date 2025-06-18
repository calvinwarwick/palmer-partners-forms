
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface TextareaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const TextareaInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: TextareaInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 text-sm md:text-base",
          "border-[1.5px] border-gray-300 rounded-lg",
          "bg-white shadow-sm resize-vertical",
          "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        )}
      />
    </FormField>
  );
};
