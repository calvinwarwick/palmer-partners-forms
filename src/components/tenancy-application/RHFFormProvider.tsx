
import React, { createContext, useContext } from "react";
import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationSchema, ApplicationFormData } from "@/schemas/applicationSchemas";
import { Applicant } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";

interface RHFFormContextType {
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

const RHFFormContext = createContext<RHFFormContextType | null>(null);

export const useRHFFormContext = () => {
  const context = useContext(RHFFormContext);
  if (!context) {
    throw new Error("useRHFFormContext must be used within RHFFormProvider");
  }
  return context;
};

interface RHFFormProviderProps {
  children: (formContext: RHFFormContextType) => React.ReactNode;
}

const createEmptyApplicant = (id: string): Partial<Applicant> => ({
  id,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  employmentStatus: "",
  currentAddress: "",
  currentPostcode: "",
  residencyStatus: "",
  moveInDate: "",
  vacateDate: ""
});

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

  const progress = ((currentStep - 1) / totalSteps) * 100;

  const getStepFields = (step: number): (keyof ApplicationFormData)[] => {
    switch (step) {
      case 1:
        return ["propertyPreferences"];
      case 2:
        return ["personalInfo"];
      case 3:
        return ["employment"];
      case 4:
        return ["currentAddress"];
      case 5:
        return ["additionalDetails"];
      case 6:
        return ["termsAndData"];
      default:
        return [];
    }
  };

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
      
      // Transform the RHF data to match the expected Application type
      const applicationData = {
        propertyPreferences: formData.propertyPreferences,
        applicants: formData.personalInfo.applicants as Applicant[],
        additionalDetails: formData.additionalDetails,
        signature: formData.termsAndData.signature,
        dataSharing: formData.termsAndData.dataSharing
      };
      
      await submitApplication(applicationData as any);
    }
  };

  const addApplicant = () => {
    const currentApplicants = form.getValues("personalInfo.applicants");
    if (currentApplicants.length < 5) {
      const newId = Date.now().toString();
      const newApplicant = createEmptyApplicant(newId);
      
      form.setValue("personalInfo.applicants", [...currentApplicants, newApplicant]);
      form.setValue("employment.applicants", [...form.getValues("employment.applicants"), createEmptyApplicant(newId)]);
      form.setValue("currentAddress.applicants", [...form.getValues("currentAddress.applicants"), createEmptyApplicant(newId)]);
    }
  };

  const removeApplicant = (index: number) => {
    const currentApplicants = form.getValues("personalInfo.applicants");
    if (currentApplicants.length > 1) {
      const updatedApplicants = currentApplicants.filter((_, i) => i !== index);
      
      form.setValue("personalInfo.applicants", updatedApplicants);
      form.setValue("employment.applicants", form.getValues("employment.applicants").filter((_, i) => i !== index));
      form.setValue("currentAddress.applicants", form.getValues("currentAddress.applicants").filter((_, i) => i !== index));
    }
  };

  const handleApplicantCountChange = (count: number) => {
    const currentCount = form.getValues("personalInfo.applicants").length;
    
    if (count > currentCount) {
      const newApplicants = [];
      const newEmploymentApplicants = [];
      const newAddressApplicants = [];
      
      for (let i = currentCount; i < count; i++) {
        const newId = (Date.now() + i).toString();
        newApplicants.push(createEmptyApplicant(newId));
        newEmploymentApplicants.push(createEmptyApplicant(newId));
        newAddressApplicants.push(createEmptyApplicant(newId));
      }
      
      form.setValue("personalInfo.applicants", [...form.getValues("personalInfo.applicants"), ...newApplicants]);
      form.setValue("employment.applicants", [...form.getValues("employment.applicants"), ...newEmploymentApplicants]);
      form.setValue("currentAddress.applicants", [...form.getValues("currentAddress.applicants"), ...newAddressApplicants]);
    } else if (count < currentCount) {
      form.setValue("personalInfo.applicants", form.getValues("personalInfo.applicants").slice(0, count));
      form.setValue("employment.applicants", form.getValues("employment.applicants").slice(0, count));
      form.setValue("currentAddress.applicants", form.getValues("currentAddress.applicants").slice(0, count));
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

  const fillAllTestData = () => {
    form.setValue("propertyPreferences", {
      propertyType: "apartment",
      streetAddress: "123 Test Street",
      postcode: "SW1A 1AA",
      maxRent: "2500",
      preferredLocation: "Central London",
      moveInDate: "2024-01-01",
      latestMoveInDate: "2024-02-01",
      initialTenancyTerm: "1 year",
      additionalRequests: "Near transport links"
    });

    form.setValue("personalInfo.applicants.0", {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "07123456789",
      dateOfBirth: "1990-01-01"
    });

    form.setValue("employment.applicants.0", {
      id: "1",
      employmentStatus: "full-time",
      companyName: "Test Company",
      jobTitle: "Software Developer",
      annualIncome: "50000",
      lengthOfService: "2-years"
    });

    form.setValue("currentAddress.applicants.0", {
      id: "1",
      currentAddress: "456 Current Street",
      currentPostcode: "SW1A 2BB",
      residencyStatus: "tenant",
      timeAtAddress: "1-2-years",
      moveInDate: "2022-01-01",
      vacateDate: "2024-01-01"
    });

    form.setValue("additionalDetails", {
      children: false,
      childrenCount: "None",
      childrenDetails: "",
      pets: false,
      petDetails: "",
      smoking: false,
      parking: false,
      additionalRequests: "",
      householdIncome: "50000"
    });

    form.setValue("termsAndData", {
      termsAccepted: true,
      signature: "John Doe",
      fullName: "John Doe",
      dataSharing: {
        utilities: false,
        insurance: true
      }
    });
  };

  const fillStepData = () => {
    switch (currentStep) {
      case 1:
        form.setValue("propertyPreferences", {
          propertyType: "apartment",
          streetAddress: "123 Test Street",
          postcode: "SW1A 1AA",
          maxRent: "2500",
          preferredLocation: "Central London",
          moveInDate: "2024-01-01",
          latestMoveInDate: "2024-02-01",
          initialTenancyTerm: "1 year",
          additionalRequests: "Near transport links"
        });
        break;
      case 2:
        form.setValue("personalInfo.applicants.0", {
          ...form.getValues("personalInfo.applicants.0"),
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "07123456789",
          dateOfBirth: "1990-01-01"
        });
        break;
      // Add other cases as needed
    }
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

  return children(contextValue);
};

export default RHFFormProvider;
