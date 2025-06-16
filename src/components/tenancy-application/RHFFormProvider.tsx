
import React, { createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationSchema, ApplicationFormData } from "@/schemas/applicationSchemas";
import { Applicant } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { useRHFTestData } from "@/hooks/useRHFTestData";
import { useRHFApplicants } from "@/hooks/useRHFApplicants";
import { createEmptyApplicant, getStepFields } from "@/utils/rhfFormHelpers";
import { RHFFormContextType } from "@/types/RHFFormContext";

const RHFFormContext = createContext<RHFFormContextType | null>(null);

export const useRHFFormContext = () => {
  const context = useContext(RHFFormContext);
  if (!context) {
    throw new Error("useRHFFormContext must be used within RHFFormProvider");
  }
  return context;
};

interface RHFFormProviderProps {
  children: React.ReactNode;
}

const RHFFormProvider = ({ children }: RHFFormProviderProps) => {
  const totalSteps = 6;
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationSchema),
    mode: "onChange",
    defaultValues: {
      propertyPreferences: {
        propertyType: "",
        streetAddress: "",
        postcode: "",
        maxRent: "",
        preferredLocation: "",
        moveInDate: "",
        latestMoveInDate: "",
        initialTenancyTerm: "",
        additionalRequests: ""
      },
      personalInfo: {
        applicants: [createEmptyApplicant("1")]
      },
      employment: {
        applicants: [createEmptyApplicant("1")]
      },
      currentAddress: {
        applicants: [createEmptyApplicant("1")]
      },
      additionalDetails: {
        children: false,
        childrenCount: "None",
        childrenDetails: "",
        pets: false,
        petDetails: "",
        smoking: false,
        parking: false,
        additionalRequests: "",
        householdIncome: "",
        moveInDate: "",
        tenancyLength: ""
      },
      termsAndData: {
        termsAccepted: false,
        signature: "",
        fullName: "",
        dataSharing: {
          utilities: false,
          insurance: true
        }
      }
    }
  });

  const { currentStep, goToNext, goToPrevious, isFirstStep, isLastStep } = useMultiStepForm(totalSteps);
  const { isSubmitting, isSubmitted, submitApplication } = useApplicationSubmission();
  const [guarantorFormOpen, setGuarantorFormOpen] = React.useState(false);
  const [selectedApplicantForGuarantor, setSelectedApplicantForGuarantor] = React.useState<Applicant | null>(null);

  const { fillAllTestData, fillStepData } = useRHFTestData(form, currentStep);
  const { addApplicant, removeApplicant, handleApplicantCountChange } = useRHFApplicants(form);

  const progress = ((currentStep - 1) / totalSteps) * 100;

  const handleNext = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      goToNext();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      
      const applicationData = {
        propertyPreferences: {
          propertyType: formData.propertyPreferences.propertyType || "",
          streetAddress: formData.propertyPreferences.streetAddress || "",
          postcode: formData.propertyPreferences.postcode || "",
          maxRent: formData.propertyPreferences.maxRent || "",
          preferredLocation: formData.propertyPreferences.preferredLocation || "",
          moveInDate: formData.propertyPreferences.moveInDate || "",
          latestMoveInDate: formData.propertyPreferences.latestMoveInDate || "",
          initialTenancyTerm: formData.propertyPreferences.initialTenancyTerm || "",
          additionalRequests: formData.propertyPreferences.additionalRequests || ""
        },
        applicants: formData.personalInfo.applicants.map(applicant => ({
          ...applicant,
          firstName: applicant.firstName || "",
          lastName: applicant.lastName || "",
          email: applicant.email || "",
          phone: applicant.phone || "",
          dateOfBirth: applicant.dateOfBirth || ""
        })) as Applicant[],
        additionalDetails: {
          moveInDate: formData.additionalDetails.moveInDate || "",
          tenancyLength: formData.additionalDetails.tenancyLength || "",
          pets: formData.additionalDetails.pets,
          petDetails: formData.additionalDetails.petDetails || "",
          smoking: formData.additionalDetails.smoking || false,
          parking: formData.additionalDetails.parking || false,
          children: formData.additionalDetails.children,
          childrenDetails: formData.additionalDetails.childrenDetails || "",
          additionalRequests: formData.additionalDetails.additionalRequests || "",
          householdIncome: formData.additionalDetails.householdIncome || ""
        },
        signature: formData.termsAndData.signature,
        dataSharing: {
          utilities: formData.termsAndData.dataSharing.utilities ?? false,
          insurance: formData.termsAndData.dataSharing.insurance ?? true
        }
      };
      
      await submitApplication(applicationData);
    }
  };

  const handleGuarantorOpen = (applicant: Applicant) => {
    setSelectedApplicantForGuarantor(applicant);
    setGuarantorFormOpen(true);
  };

  const handleGuarantorSave = () => {
    setGuarantorFormOpen(false);
    setSelectedApplicantForGuarantor(null);
  };

  const contextValue: RHFFormContextType = {
    form,
    currentStep,
    totalSteps,
    progress,
    isFirstStep,
    isLastStep,
    isSubmitting,
    isSubmitted,
    goToNext,
    goToPrevious,
    handleNext,
    handleSubmit,
    addApplicant,
    removeApplicant,
    handleApplicantCountChange,
    handleGuarantorOpen,
    handleGuarantorSave,
    guarantorFormOpen,
    setGuarantorFormOpen,
    selectedApplicantForGuarantor,
    setSelectedApplicantForGuarantor,
    fillAllTestData,
    fillStepData
  };

  return (
    <RHFFormContext.Provider value={contextValue}>
      {children}
    </RHFFormContext.Provider>
  );
};

export default RHFFormProvider;
