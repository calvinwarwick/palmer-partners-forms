
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormData } from "@/schemas/applicationSchemas";
import { Applicant } from "@/domain/types/Applicant";

export interface RHFFormContextType {
  form: UseFormReturn<ApplicationFormData>;
  currentStep: number;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  handleNext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  addApplicant: () => void;
  removeApplicant: (index: number) => void;
  handleApplicantCountChange: (count: number) => void;
  handleGuarantorOpen: (applicant: Applicant) => void;
  handleGuarantorSave: () => void;
  guarantorFormOpen: boolean;
  setGuarantorFormOpen: (open: boolean) => void;
  selectedApplicantForGuarantor: Applicant | null;
  setSelectedApplicantForGuarantor: (applicant: Applicant | null) => void;
  fillAllTestData: () => void;
  fillStepData: () => void;
}
