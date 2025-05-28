
import { useState } from 'react';
import { validateStep } from '../domain/validation/applicationValidation';
import { Applicant, PropertyPreferences } from '../domain/types/Applicant';

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

  const canProceed = (applicants: Applicant[], preferences: PropertyPreferences, signature: string): boolean => {
    return validateStep(currentStep, applicants, preferences, signature);
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
