
import { User, Home, FileText, CheckCircle, MapPin, Building, Info, Briefcase, Check, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const isMobile = useIsMobile();

  const allSteps = [
    { step: 1, icon: Home, label: "Rental Property" },
    { step: 2, icon: User, label: "Personal Information" },
    { step: 3, icon: Briefcase, label: "Employment" },
    { step: 4, icon: MapPin, label: "Current Address" },
    { step: 5, icon: Info, label: "Additional Information" },
    { step: 6, icon: CheckCircle, label: "Terms & Signature" }
  ];

  const getVisibleSteps = () => {
    if (!isMobile) return allSteps;
    
    const visibleSteps = [];
    const currentStepData = allSteps.find(step => step.step === currentStep);
    if (currentStepData) visibleSteps.push(currentStepData);
    
    if (currentStep < allSteps.length) {
      const nextStepData = allSteps.find(step => step.step === currentStep + 1);
      if (nextStepData) visibleSteps.push(nextStepData);
    }
    
    return visibleSteps;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${isMobile ? 'flex-wrap' : ''} hidden-below-950:hidden`}>
      {getVisibleSteps().map(({ step, icon: Icon, label }, index) => (
        <div key={step} className="flex items-center">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto transition-all duration-300 ${
              currentStep === step 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110" 
                : currentStep > step
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-light-grey"
            }`}>
              {currentStep > step ? (
                <Check className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <div className={`text-xs font-medium font-lexend ${
              currentStep >= step ? "text-orange-600" : "text-light-grey"
            }`}>
              {label}
            </div>
          </div>
          
          {index < getVisibleSteps().length - 1 && (
            <div className="flex items-center" style={{ marginBottom: '24px' }}>
              <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
