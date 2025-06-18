
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currency?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const CurrencyInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  currency = '£',
  required = false,
  error,
  hint,
  className,
  disabled = false,
}: CurrencyInputProps) => {
  const handleChange = (inputValue: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    onChange(numericValue);
  };

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
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 font-bold text-sm md:text-base pointer-events-none z-10">
          {currency}
        </span>
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-11 md:h-12 pl-8 pr-4 py-3 text-sm md:text-base",
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
