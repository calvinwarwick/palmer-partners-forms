
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    "Property Details",
    "Personal Details", 
    "Employment",
    "Current Address",
    "Additional Details",
    "Terms & Data"
  ];

  return (
    <div className="hidden sm:flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center font-medium transition-colors max-w-20",
                  isActive
                    ? "text-orange-600"
                    : isCompleted
                    ? "text-green-600"
                    : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 mx-2 transition-colors",
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
