
export interface BaseFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
}
