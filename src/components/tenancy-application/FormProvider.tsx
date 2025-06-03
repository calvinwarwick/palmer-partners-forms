import { useState } from "react";
import { Applicant, PropertyPreferences, AdditionalDetails, Application } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { validateAndHighlightFields, handleValidationErrors } from "@/utils/fieldValidation";

interface FormProviderProps {
  children: (props: FormContextType) => React.ReactNode;
}

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
  
  // Submission state
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const FormProvider = ({ children }: FormProviderProps) => {
  const totalSteps = 6;
  
  const calculateProgress = (current: number) => {
    return ((current - 1) / totalSteps) * 100;
  };
  
  const { currentStep, goToNext, goToPrevious, canProceed, isFirstStep, isLastStep } = useMultiStepForm(totalSteps);
  const progress = calculateProgress(currentStep);
  const { isSubmitting, isSubmitted, submitApplication } = useApplicationSubmission();

  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferences>({
    propertyType: "",
    streetAddress: "",
    postcode: "",
    maxRent: "",
    preferredLocation: "",
    moveInDate: "",
    latestMoveInDate: "",
    initialTenancyTerm: "",
    additionalRequests: ""
  });

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employment: "",
      companyName: "",
      jobTitle: "",
      annualIncome: "",
      lengthOfService: "",
      previousAddress: "",
      previousPostcode: "",
      currentPropertyStatus: "",
      moveInDate: "",
      vacateDate: "",
      currentRentalAmount: "",
      reference1Name: "",
      reference1Contact: "",
      pets: "",
      petDetails: "",
      adverseCreditDetails: "",
      // Employment fields
      employmentStatus: "",
      employer: "",
      employmentStartDate: "",
      contractType: "",
      probationPeriod: "",
      probationEndDate: "",
      // Current address fields
      currentAddress: "",
      currentPostcode: "",
      residencyStatus: "",
      timeAtAddress: "",
      landlordName: "",
      landlordPhone: "",
      rentUpToDate: "",
      rentArrearsDetails: "",
      noticePeriod: "",
      noticePeriodLength: "",
      previousLandlordName: "",
      previousLandlordPhone: ""
    }
  ]);

  const [additionalDetails, setAdditionalDetails] = useState({
    moveInDate: "",
    tenancyLength: "",
    pets: false,
    petDetails: "",
    smoking: false,
    parking: false,
    children: false,
    childrenDetails: "",
    additionalRequests: "",
    householdIncome: "",
    childrenCount: "None"
  });

  const [dataSharing, setDataSharing] = useState({
    utilities: false,
    insurance: true
  });

  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [guarantorFormOpen, setGuarantorFormOpen] = useState(false);
  const [selectedApplicantForGuarantor, setSelectedApplicantForGuarantor] = useState<Applicant | null>(null);

  const addApplicant = () => {
    if (applicants.length < 5) {
      const newApplicant: Applicant = {
        id: Date.now().toString(),
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        employment: "",
        companyName: "",
        jobTitle: "",
        annualIncome: "",
        lengthOfService: "",
        previousAddress: "",
        previousPostcode: "",
        currentPropertyStatus: "",
        moveInDate: "",
        vacateDate: "",
        currentRentalAmount: "",
        reference1Name: "",
        reference1Contact: "",
        pets: "",
        petDetails: "",
        adverseCreditDetails: "",
        // Employment fields
        employmentStatus: "",
        employer: "",
        employmentStartDate: "",
        contractType: "",
        probationPeriod: "",
        probationEndDate: "",
        // Current address fields
        currentAddress: "",
        currentPostcode: "",
        residencyStatus: "",
        timeAtAddress: "",
        landlordName: "",
        landlordPhone: "",
        rentUpToDate: "",
        rentArrearsDetails: "",
        noticePeriod: "",
        noticePeriodLength: "",
        previousLandlordName: "",
        previousLandlordPhone: ""
      };
      setApplicants([...applicants, newApplicant]);
    }
  };

  const removeApplicant = (id: string) => {
    if (applicants.length > 1) {
      setApplicants(applicants.filter(applicant => applicant.id !== id));
    }
  };

  const handleApplicantCountChange = (count: number) => {
    const currentCount = applicants.length;
    
    if (count > currentCount) {
      const newApplicants = [...applicants];
      for (let i = currentCount; i < count; i++) {
        newApplicants.push({
          id: Date.now().toString() + i,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          employment: "",
          companyName: "",
          jobTitle: "",
          annualIncome: "",
          lengthOfService: "",
          previousAddress: "",
          previousPostcode: "",
          currentPropertyStatus: "",
          moveInDate: "",
          vacateDate: "",
          currentRentalAmount: "",
          reference1Name: "",
          reference1Contact: "",
          pets: "",
          petDetails: "",
          adverseCreditDetails: "",
          // Employment fields
          employmentStatus: "",
          employer: "",
          employmentStartDate: "",
          contractType: "",
          probationPeriod: "",
          probationEndDate: "",
          // Current address fields
          currentAddress: "",
          currentPostcode: "",
          residencyStatus: "",
          timeAtAddress: "",
          landlordName: "",
          landlordPhone: "",
          rentUpToDate: "",
          rentArrearsDetails: "",
          noticePeriod: "",
          noticePeriodLength: "",
          previousLandlordName: "",
          previousLandlordPhone: ""
        });
      }
      setApplicants(newApplicants);
    } else if (count < currentCount) {
      setApplicants(applicants.slice(0, count));
    }
  };

  const updateApplicant = (id: string, field: keyof Applicant, value: string) => {
    setApplicants(applicants.map(applicant => 
      applicant.id === id ? { ...applicant, [field]: value } : applicant
    ));
  };

  const updatePropertyPreferences = (field: keyof PropertyPreferences, value: string) => {
    setPropertyPreferences(prev => ({ ...prev, [field]: value }));
  };

  const updateAdditionalDetails = (field: string, value: string | boolean) => {
    setAdditionalDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateDataSharing = (field: 'utilities' | 'insurance', value: boolean) => {
    setDataSharing(prev => ({ ...prev, [field]: value }));
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
    // Fill property preferences with proper select values
    setPropertyPreferences({
      propertyType: "house",
      streetAddress: "123 Test Street",
      postcode: "AB12 3CD",
      maxRent: "1500",
      preferredLocation: "City Center",
      moveInDate: "2024-07-01",
      latestMoveInDate: "2024-07-15",
      initialTenancyTerm: "1 year",
      additionalRequests: "No smoking policy preferred"
    });

    // Fill first applicant data with proper select values
    setApplicants(prev => prev.map((applicant, index) => {
      if (index === 0) {
        return {
          ...applicant,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "07123456789",
          dateOfBirth: "1990-01-01",
          employment: "Full-time",
          employmentStatus: "employed",
          companyName: "Tech Corp Ltd",
          jobTitle: "Software Developer",
          annualIncome: "45000",
          lengthOfService: "2 years",
          currentAddress: "456 Current Road",
          currentPostcode: "EF34 5GH",
          residencyStatus: "tenant",
          timeAtAddress: "2 years",
          landlordName: "Current Landlord",
          landlordPhone: "07987654321",
          moveInDate: "2024-07-01",
          vacateDate: "2024-06-30",
          currentPropertyStatus: "renting",
          currentRentalAmount: "1200",
          rentUpToDate: "yes",
          noticePeriod: "yes",
          noticePeriodLength: "1 month"
        };
      }
      return applicant;
    }));

    // Fill additional details
    setAdditionalDetails({
      moveInDate: "2024-07-01",
      tenancyLength: "1 year",
      pets: false,
      petDetails: "",
      smoking: false,
      parking: true,
      children: false,
      childrenDetails: "",
      additionalRequests: "",
      householdIncome: "45000",
      childrenCount: "None"
    });

    // Fill signature and terms
    setSignature("John Doe");
    setFullName("John Doe");
    setTermsAccepted(true);
  };

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
    isSubmitting,
    isSubmitted
  });
};

export default FormProvider;
