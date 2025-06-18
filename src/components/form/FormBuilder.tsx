
import React from 'react';
import {
  TextInput,
  SelectInput,
  TextareaInput,
  DateInput,
  CurrencyInput,
  ToggleInput,
  CheckboxInput,
  RadioGroupInput,
  FormGrid,
} from './index';

export interface FormFieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'currency' | 'toggle' | 'checkbox' | 'radio';
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
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
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
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
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <SelectInput
            {...commonProps}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <TextareaInput
            {...commonProps}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        );

      case 'date':
        return (
          <DateInput
            {...commonProps}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            min={field.min}
            max={field.max}
          />
        );

      case 'currency':
        return (
          <CurrencyInput
            {...commonProps}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            placeholder={field.placeholder}
            currency={field.currency}
          />
        );

      case 'toggle':
        return (
          <ToggleInput
            {...commonProps}
            checked={field.value as boolean}
            onCheckedChange={field.onCheckedChange || (field.onChange as (checked: boolean) => void)}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            {...commonProps}
            checked={field.value as boolean}
            onCheckedChange={field.onCheckedChange || (field.onChange as (checked: boolean) => void)}
          />
        );

      case 'radio':
        return (
          <RadioGroupInput
            {...commonProps}
            value={field.value as string}
            onChange={field.onChange as (value: string) => void}
            options={field.options || []}
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
