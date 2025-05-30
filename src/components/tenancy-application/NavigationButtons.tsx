
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, TestTube } from "lucide-react";

interface NavigationButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onFillTestData: () => void;
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
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
      {!isFirstStep ? (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-orange-500 hover:text-black px-8 py-3 font-medium font-lexend"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onFillTestData}
          className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 px-6 py-3 font-medium font-lexend"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
        >
          <TestTube className="h-4 w-4 mr-2" />
          Fill All Data
        </Button>
        
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 font-semibold transition-all duration-200 font-lexend"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 font-semibold transition-all duration-200 font-lexend"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
