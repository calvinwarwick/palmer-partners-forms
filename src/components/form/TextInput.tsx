
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: TextInputProps) => {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={id}
      className={className}
    >
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full h-11 md:h-12 px-4 py-3 text-sm md:text-base",
          "border-[1.5px] border-gray-300 rounded-lg",
          "bg-white shadow-sm",
          "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        )}
      />
    </FormField>
  );
};
