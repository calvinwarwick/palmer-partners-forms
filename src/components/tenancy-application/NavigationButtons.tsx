
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, TestTube, Zap } from "lucide-react";
interface NavigationButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onFillTestData: () => void;
  onFillStepData: () => void;
}
const NavigationButtons = ({
  isFirstStep,
  isLastStep,
  isSubmitting,
  canSubmit,
  onPrevious,
  onNext,
  onSubmit,
  onFillTestData,
  onFillStepData
}: NavigationButtonsProps) => {
  return <div className="pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 order-2 sm:order-1">
          <Button type="button" variant="outline" size="sm" onClick={onFillTestData} className="text-xs border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white ">
            <TestTube className="h-3 w-3 mr-1 hover:bg-gray-200 " />
            Fill All Data
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onFillStepData} className="text-xs border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white ">
            <Zap className="h-3 w-3 mr-1" />
            Fill Step
          </Button>
        </div>

        <div className="flex gap-3 order-1 sm:order-2">
          {!isFirstStep && <Button type="button" variant="outline" onClick={onPrevious} className="min-w-[120px] border-gray-300 text-dark-grey hover:bg-gray-100 hover:text-dark-grey ">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>}

          {isLastStep ? <Button type="button" onClick={onSubmit} disabled={!canSubmit || isSubmitting} className="min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? "Submitting..." : <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>}
            </Button> : <Button type="button" onClick={onNext} disabled={!canSubmit} className="min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>}
        </div>
      </div>
    </div>;
};
export default NavigationButtons;
