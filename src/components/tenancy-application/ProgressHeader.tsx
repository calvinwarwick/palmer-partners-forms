
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  progress: number;
  totalSteps: number;
  currentStep: number;
}

const ProgressHeader = ({ progress, totalSteps, currentStep }: ProgressHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-3">
        <span className="font-medium text-dark-grey">{Math.round(progress)}% Complete</span>
        <span className="text-light-grey">{totalSteps - currentStep + 1} steps remaining</span>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-gray-200"
      />
    </div>
  );
};

export default ProgressHeader;
