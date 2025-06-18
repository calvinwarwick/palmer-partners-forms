
import PropertyDetailsStep from "@/components/tenancy-application/steps/PropertyDetailsStep";
import PersonalInfoStep from "@/components/tenancy-application/steps/PersonalInfoStep";
import EmploymentStep from "@/components/tenancy-application/steps/EmploymentStep";
import CurrentAddressStep from "@/components/tenancy-application/steps/CurrentAddressStep";
import AdditionalDetailsStep from "@/components/tenancy-application/steps/AdditionalDetailsStep";
import TermsAndDataStep from "@/components/tenancy-application/steps/TermsAndDataStep";
import { FormContextType } from "@/types/FormContext";
import { Applicant } from "@/domain/types/Applicant";

interface FormStepsProps {
  formContext: FormContextType;
}

const FormSteps = ({ formContext }: FormStepsProps) => {
  const {
    currentStep,
    propertyPreferences,
    applicants,
    additionalDetails,
    dataSharing,
    signature,
    fullName,
    termsAccepted,
    updatePropertyPreferences,
    updateApplicant,
    updateAdditionalDetails,
    updateDataSharing,
    setSignature,
    setFullName,
    setTermsAccepted,
    addApplicant,
    removeApplicant,
    handleApplicantCountChange,
    handleGuarantorOpen
  } = formContext;

  // Create a wrapper function to match the expected signature for AdditionalDetailsStep
  const handleUpdateDetails = (field: string, value: string | boolean) => {
    updateAdditionalDetails(field, value);
  };

  switch (currentStep) {
    case 1:
      return (
        <PropertyDetailsStep
          propertyPreferences={propertyPreferences}
          onUpdatePreferences={updatePropertyPreferences}
        />
      );
    case 2:
      return (
        <PersonalInfoStep
          applicants={applicants}
          onAddApplicant={addApplicant}
          onRemoveApplicant={removeApplicant}
          onUpdateApplicant={updateApplicant}
          onApplicantCountChange={handleApplicantCountChange}
          onGuarantorOpen={handleGuarantorOpen}
        />
      );
    case 3:
      return (
        <EmploymentStep
          applicants={applicants}
          onUpdateApplicant={updateApplicant}
        />
      );
    case 4:
      return (
        <CurrentAddressStep
          applicants={applicants}
          onUpdateApplicant={updateApplicant}
        />
      );
    case 5:
      return (
        <AdditionalDetailsStep
          additionalDetails={additionalDetails}
          onUpdateDetails={handleUpdateDetails}
          maxRent={propertyPreferences.maxRent}
          applicants={applicants}
          onUpdateApplicant={updateApplicant}
        />
      );
    case 6:
      return (
        <TermsAndDataStep
          dataSharing={dataSharing}
          onDataSharingChange={updateDataSharing}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
          signature={signature}
          onSignatureChange={setSignature}
          fullName={fullName}
          onFullNameChange={setFullName}
        />
      );
    default:
      return null;
  }
};

export default FormSteps;
