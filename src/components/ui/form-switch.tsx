
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const FormSwitch = ({ 
  id, 
  label, 
  checked, 
  onCheckedChange, 
  disabled = false,
  className 
}: FormSwitchProps) => {
  return (
    <div 
      className={cn("form-switch-container", className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '12px 0',
        width: '100%'
      }}
    >
      <Label 
        htmlFor={id} 
        className="text-sm md:text-base font-medium text-gray-700 leading-relaxed flex-1 cursor-pointer"
        style={{
          flex: 1,
          margin: 0,
          cursor: 'pointer'
        }}
      >
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
        style={{
          flexShrink: 0
        }}
      />
    </div>
  );
};

export { FormSwitch };
