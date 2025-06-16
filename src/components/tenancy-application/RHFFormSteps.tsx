
import RHFPropertyDetailsStep from "@/components/tenancy-application/steps/rhf/RHFPropertyDetailsStep";
import RHFPersonalInfoStep from "@/components/tenancy-application/steps/rhf/RHFPersonalInfoStep";
import RHFEmploymentStep from "@/components/tenancy-application/steps/rhf/RHFEmploymentStep";
import RHFCurrentAddressStep from "@/components/tenancy-application/steps/rhf/RHFCurrentAddressStep";
import RHFAdditionalDetailsStep from "@/components/tenancy-application/steps/rhf/RHFAdditionalDetailsStep";
import RHFTermsAndDataStep from "@/components/tenancy-application/steps/rhf/RHFTermsAndDataStep";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFFormSteps = () => {
  const { currentStep } = useRHFFormContext();

  switch (currentStep) {
    case 1:
      return <RHFPropertyDetailsStep />;
    case 2:
      return <RHFPersonalInfoStep />;
    case 3:
      return <RHFEmploymentStep />;
    case 4:
      return <RHFCurrentAddressStep />;
    case 5:
      return <RHFAdditionalDetailsStep />;
    case 6:
      return <RHFTermsAndDataStep />;
    default:
      return null;
  }
};

export default RHFFormSteps;
