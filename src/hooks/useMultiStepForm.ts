
import { useState } from 'react';
import { validateStep } from '../domain/validation/applicationValidation';
import { Applicant, PropertyPreferences, AdditionalDetails } from '../domain/types/Applicant';

export const useMultiStepForm = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(1);

  const progress = (currentStep / totalSteps) * 100;

  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = (
    step: number,
    applicants: Applicant[], 
    preferences: PropertyPreferences, 
    additionalDetails: AdditionalDetails,
    signature: string,
    termsAccepted: boolean
  ): boolean => {
    return validateStep(step, applicants, preferences, additionalDetails, signature, termsAccepted);
  };

  return {
    currentStep,
    progress,
    goToNext,
    goToPrevious,
    canProceed,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
};
