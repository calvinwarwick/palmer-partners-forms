
import { Application } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { useFormState } from "@/hooks/useFormState";
import { useFormActions } from "@/hooks/useFormActions";
import { useTestData } from "@/hooks/useTestData";
import { validateAndHighlightFields, handleValidationErrors } from "@/utils/fieldValidation";
import { FormContextType } from "@/types/FormContext";

interface FormProviderProps {
  children: (props: FormContextType) => React.ReactNode;
}

const FormProvider = ({ children }: FormProviderProps) => {
  const totalSteps = 6;
  
  const calculateProgress = (current: number) => {
    return ((current - 1) / totalSteps) * 100;
  };
  
  const { currentStep, goToNext, goToPrevious, canProceed, isFirstStep, isLastStep } = useMultiStepForm(totalSteps);
  const progress = calculateProgress(currentStep);
  const { isSubmitting, isSubmitted, submitApplication } = useApplicationSubmission();

  const {
    propertyPreferences,
    setPropertyPreferences,
    applicants,
    setApplicants,
    additionalDetails,
    setAdditionalDetails,
    dataSharing,
    setDataSharing,
    signature,
    setSignature,
    fullName,
    setFullName,
    termsAccepted,
    setTermsAccepted,
    guarantorFormOpen,
    setGuarantorFormOpen,
    selectedApplicantForGuarantor,
    setSelectedApplicantForGuarantor
  } = useFormState();

  const {
    addApplicant,
    removeApplicant,
    handleApplicantCountChange,
    updateApplicant,
    updatePropertyPreferences,
    updateAdditionalDetails,
    updateDataSharing,
    handleGuarantorOpen,
    handleGuarantorSave
  } = useFormActions({
    applicants,
    setApplicants,
    setPropertyPreferences,
    setAdditionalDetails,
    setDataSharing,
    setSelectedApplicantForGuarantor,
    setGuarantorFormOpen
  });

  const { fillAllTestData, fillStepData } = useTestData({
    currentStep,
    setPropertyPreferences,
    setApplicants,
    setAdditionalDetails,
    setSignature,
    setFullName,
    setTermsAccepted,
    setDataSharing
  });

  const handleNext = () => {
    const canProceedToNext = canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted);
    
    if (canProceedToNext) {
      goToNext();
      // Scroll to top of the form when proceeding to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const invalidFields = validateAndHighlightFields(
        currentStep, 
        applicants, 
        propertyPreferences, 
        additionalDetails, 
        signature, 
        termsAccepted,
        fullName
      );
      
      handleValidationErrors(invalidFields);
    }
  };

  const handleSubmit = async () => {
    const application: Application = { 
      applicants, 
      propertyPreferences, 
      additionalDetails,
      dataSharing,
      signature 
    };
    await submitApplication(application);
  };

  return children({
    totalSteps,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    canProceed,
    propertyPreferences,
    applicants,
    additionalDetails,
    dataSharing,
    signature,
    fullName,
    termsAccepted,
    guarantorFormOpen,
    selectedApplicantForGuarantor,
    updatePropertyPreferences,
    updateApplicant,
    updateAdditionalDetails,
    updateDataSharing,
    setSignature,
    setFullName,
    setTermsAccepted,
    setGuarantorFormOpen,
    addApplicant,
    removeApplicant,
    handleApplicantCountChange,
    handleGuarantorOpen,
    handleGuarantorSave,
    handleNext,
    handleSubmit,
    fillAllTestData,
    fillStepData,
    isSubmitting,
    isSubmitted
  });
};

export default FormProvider;
