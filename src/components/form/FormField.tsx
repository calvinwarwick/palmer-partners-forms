
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  required = false,
  error,
  hint,
  htmlFor,
  className,
  children,
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={htmlFor} 
        className="text-sm md:text-base font-semibold text-gray-800 block"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {children}
      
      {hint && (
        <p className="text-xs md:text-sm text-gray-500 mt-1">{hint}</p>
      )}
      
      {error && (
        <p className="text-xs md:text-sm text-red-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
