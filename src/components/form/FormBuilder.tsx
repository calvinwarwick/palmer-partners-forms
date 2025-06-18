
import React from 'react';
import {
  TextInput,
  SelectInput,
  TextareaInput,
  DateInput,
  CurrencyInput,
  FormGrid,
} from './index';

export interface FormFieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'currency';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  currency?: string;
  min?: string;
  max?: string;
}

interface FormBuilderProps {
  fields: FormFieldConfig[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const FormBuilder = ({
  fields,
  columns = 2,
  className,
}: FormBuilderProps) => {
  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      value: field.value,
      onChange: field.onChange,
      required: field.required,
      error: field.error,
      hint: field.hint,
      disabled: field.disabled,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <TextInput
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <SelectInput
            {...commonProps}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <TextareaInput
            {...commonProps}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        );

      case 'date':
        return (
          <DateInput
            {...commonProps}
            min={field.min}
            max={field.max}
          />
        );

      case 'currency':
        return (
          <CurrencyInput
            {...commonProps}
            placeholder={field.placeholder}
            currency={field.currency}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormGrid columns={columns} className={className}>
      {fields.map((field) => (
        <div key={field.id}>
          {renderField(field)}
        </div>
      ))}
    </FormGrid>
  );
};
