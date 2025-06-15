
import RHFPropertyDetailsStep from "@/components/tenancy-application/steps/rhf/RHFPropertyDetailsStep";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFFormSteps = () => {
  const { currentStep } = useRHFFormContext();

  switch (currentStep) {
    case 1:
      return <RHFPropertyDetailsStep />;
    case 2:
      return <div className="p-8 text-center text-gray-600">Personal Info Step - Coming Soon</div>;
    case 3:
      return <div className="p-8 text-center text-gray-600">Employment Step - Coming Soon</div>;
    case 4:
      return <div className="p-8 text-center text-gray-600">Current Address Step - Coming Soon</div>;
    case 5:
      return <div className="p-8 text-center text-gray-600">Additional Details Step - Coming Soon</div>;
    case 6:
      return <div className="p-8 text-center text-gray-600">Terms and Data Step - Coming Soon</div>;
    default:
      return null;
  }
};

export default RHFFormSteps;
