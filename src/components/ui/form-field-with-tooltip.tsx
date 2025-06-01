
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="form-label text-gray-700 font-medium mb-0">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full cursor-help">
                  <HelpCircle className="h-3 w-3 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white border border-gray-200 shadow-lg">
                <p className="text-sm text-gray-700">{tooltip}</p>
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
