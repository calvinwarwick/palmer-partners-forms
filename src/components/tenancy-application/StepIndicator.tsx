
import { cn } from "@/lib/utils";
import { Home, User, Briefcase, MapPin, Info, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface StepIndicatorProps {
  currentStep: number;
}
const StepIndicator = ({
  currentStep
}: StepIndicatorProps) => {
  const steps = [{
    name: "Rental Property",
    icon: Home
  }, {
    name: "Personal Details",
    icon: User
  }, {
    name: "Employment Details",
    icon: Briefcase
  }, {
    name: "Current Address",
    icon: MapPin
  }, {
    name: "Additional Information",
    icon: Info
  }, {
    name: "Terms & Signature",
    icon: Check
  }];
  return <div className="hidden sm:flex justify-around mt-6 pt-4 border-t border-gray-200">
      {steps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = currentStep === stepNumber;
      const isCompleted = currentStep > stepNumber;
      const IconComponent = isCompleted ? Check : step.icon;
      return <div key={stepNumber} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", isCompleted ? "bg-green-500 text-white" : isActive ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600")}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <Badge className={cn("absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold p-0 border-2 border-white", isCompleted ? "bg-green-500 text-white" : isActive ? "bg-orange-500 text-white" : "bg-gray-400 text-white")}>
                  {stepNumber}
                </Badge>
              </div>
              <span className={cn("text-xs mt-2 text-center font-medium transition-colors max-w-20 leading-tight", isActive ? "text-orange-600" : isCompleted ? "text-green-600" : "text-gray-500")}>
                {step.name}
              </span>
            </div>
          </div>;
    })}
    </div>;
};
export default StepIndicator;
