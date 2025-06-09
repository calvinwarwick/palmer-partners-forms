
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";

export interface FormContextType {
  // Step management
  totalSteps: number;
  currentStep: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  canProceed: (step: number, applicants: Applicant[], propertyPreferences: PropertyPreferences, additionalDetails: any, signature: string, termsAccepted: boolean) => boolean;
  
  // Form state
  propertyPreferences: PropertyPreferences;
  applicants: Applicant[];
  additionalDetails: {
    moveInDate: string;
    tenancyLength: string;
    pets: boolean;
    petDetails: string;
    smoking: boolean;
    parking: boolean;
    children: boolean;
    childrenDetails: string;
    additionalRequests: string;
    householdIncome: string;
    childrenCount: string;
  };
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
  fullName: string;
  termsAccepted: boolean;
  guarantorFormOpen: boolean;
  selectedApplicantForGuarantor: Applicant | null;
  
  // Form actions
  updatePropertyPreferences: (field: keyof PropertyPreferences, value: string) => void;
  updateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  updateAdditionalDetails: (field: string, value: string | boolean) => void;
  updateDataSharing: (field: 'utilities' | 'insurance', value: boolean) => void;
  setSignature: (signature: string) => void;
  setFullName: (name: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setGuarantorFormOpen: (open: boolean) => void;
  addApplicant: () => void;
  removeApplicant: (id: string) => void;
  handleApplicantCountChange: (count: number) => void;
  handleGuarantorOpen: (applicant: Applicant) => void;
  handleGuarantorSave: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  fillAllTestData: () => void;
  fillStepData: () => void;
  
  // Submission state
  isSubmitting: boolean;
  isSubmitted: boolean;
}
