
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Send, TestTube } from "lucide-react";

interface NavigationButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onFillTestData?: () => void;
  onClearData?: () => void;
}

const NavigationButtons = ({
  isFirstStep,
  isLastStep,
  isSubmitting,
  canSubmit,
  onPrevious,
  onNext,
  onSubmit,
  onFillTestData
}: NavigationButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
      {/* Left side - Previous button */}
      <div className="flex-1 flex justify-start">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>

      {/* Center - Test data button */}
      <div className="flex gap-2">
        {onFillTestData && (
          <Button
            type="button"
            variant="outline"
            onClick={onFillTestData}
            className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            <TestTube className="h-4 w-4" />
            Fill Test Data
          </Button>
        )}
      </div>

      {/* Right side - Next/Submit button */}
      <div className="flex-1 flex justify-end">
        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
