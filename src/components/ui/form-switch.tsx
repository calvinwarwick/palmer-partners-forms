
import { CustomSwitch } from "@/components/ui/custom-switch";
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
    <div className={cn("flex items-center justify-between gap-3 py-3", className)}>
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer flex-1"
      >
        {label}
      </Label>
      <CustomSwitch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
};

export { FormSwitch };
