
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface FormFieldWithTooltipProps {
  label: string;
  tooltip?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

const FormFieldWithTooltip = ({ 
  label, 
  tooltip, 
  required = false, 
  htmlFor, 
  children 
}: FormFieldWithTooltipProps) => {
  return (
    <div>
      <div className="label-with-tooltip">
        <Label htmlFor={htmlFor} className="form-label">
          {label} {required && "*"}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 help-tooltip" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormFieldWithTooltip;
