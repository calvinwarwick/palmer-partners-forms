
import React, { createContext, useContext, useState } from "react";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useFormActions } from "@/hooks/useFormActions";
import { useTestData } from "@/hooks/useTestData";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { useFormState } from "@/hooks/useFormState";
import { validateAndHighlightFields, handleValidationErrors } from "@/utils/fieldValidation";

const FormContext = createContext<any>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: (formContext: any) => React.ReactNode;
}

interface Application {
  applicants: Applicant[];
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  dataSharing: any;
  signature: string;
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

  const formActions = useFormActions({
    applicants,
    setApplicants,
    setPropertyPreferences,
    setAdditionalDetails,
    setDataSharing,
    setSelectedApplicantForGuarantor,
    setGuarantorFormOpen,
    selectedApplicantForGuarantor
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
    updatePropertyPreferences: formActions.updatePropertyPreferences,
    updateApplicant: formActions.updateApplicant,
    updateAdditionalDetails: formActions.updateAdditionalDetails,
    updateDataSharing: formActions.updateDataSharing,
    setSignature,
    setFullName,
    setTermsAccepted,
    setGuarantorFormOpen,
    addApplicant: formActions.addApplicant,
    removeApplicant: formActions.removeApplicant,
    handleApplicantCountChange: formActions.handleApplicantCountChange,
    handleGuarantorOpen: formActions.handleGuarantorOpen,
    handleGuarantorSave: formActions.handleGuarantorSave,
    handleNext,
    handleSubmit,
    fillAllTestData,
    fillStepData,
    isSubmitting,
    isSubmitted
  });
};

export default FormProvider;
