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
  canProceed: (step: number, applicants: Applicant[], propertyPreferences: PropertyPreferences, additionalDetails: AdditionalDetails, signature: string, termsAccepted: boolean) => boolean;
  
  // Form state
  propertyPreferences: PropertyPreferences;
  applicants: Applicant[];
  additionalDetails: AdditionalDetails;
  dataSharing: { utilities: boolean; insurance: boolean };
  signature: string;
  fullName: string;
  termsAccepted: boolean;
  guarantorFormOpen: boolean;
  selectedApplicantForGuarantor: Applicant | null;
  
  // Form actions
  updatePropertyPreferences: (field: keyof PropertyPreferences, value: string) => void;
  updateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  updateAdditionalDetails: (field: keyof AdditionalDetails, value: string) => void;
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
  fillAllTestData: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  
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
    bedrooms: "",
    streetAddress: "",
    postcode: "",
    maxRent: "",
    preferredLocation: "",
    preferredArea: "",
    moveInDate: "",
    latestMoveInDate: "",
    initialTenancyTerm: "",
    additionalRequests: "",
    additionalRequirements: ""
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
      adverseCreditDetails: ""
    }
  ]);

  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>({
    ukPassport: "",
    adverseCredit: "",
    adverseCreditDetails: "",
    guarantorRequired: "",
    pets: "",
    petDetails: "",
    under18Count: "",
    childrenAges: "",
    conditionsOfOffer: "",
    depositType: "",
    guarantorDetails: ""
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
        adverseCreditDetails: ""
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
          adverseCreditDetails: ""
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

  const updateAdditionalDetails = (field: keyof AdditionalDetails, value: string) => {
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
    console.log('Fill All Test Data clicked - populating entire form');
    
    setPropertyPreferences({
      propertyType: "Flat/Apartment",
      bedrooms: "2",
      streetAddress: "123 Orchard House, New Cut",
      postcode: "IP7 5DA",
      maxRent: "2500",
      preferredLocation: "Central London",
      preferredArea: "Central London, SW1A 1AA",
      moveInDate: "2024-06-01",
      latestMoveInDate: "2024-06-15",
      initialTenancyTerm: "1 year",
      additionalRequests: "Pet-friendly property preferred",
      additionalRequirements: "Pet-friendly property preferred, parking space"
    });

    const testData = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "07700 900123",
        dateOfBirth: "1990-05-15",
        employment: "Full Time",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Engineer",
        annualIncome: "45000",
        lengthOfService: "3 years",
        previousAddress: "45 Elm Street, Colchester",
        previousPostcode: "CO1 2AB",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2022-01-15",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1800",
        reference1Name: "Mike Johnson",
        reference1Contact: "mike.johnson@techsolutions.com",
        pets: "yes",
        petDetails: "1 cat",
        ukPassport: "yes",
        adverseCredit: "no",
        guarantorRequired: "no"
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "07700 900456",
        dateOfBirth: "1988-11-22",
        employment: "Full Time",
        companyName: "Design Studio",
        jobTitle: "Graphic Designer",
        annualIncome: "38000",
        lengthOfService: "2 years",
        previousAddress: "22 Oak Avenue, Ipswich",
        previousPostcode: "IP2 3CD",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2021-03-01",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1600",
        reference1Name: "Lisa Brown",
        reference1Contact: "lisa.brown@designstudio.com",
        pets: "no",
        petDetails: "",
        ukPassport: "yes",
        adverseCredit: "no",
        guarantorRequired: "no"
      }
    ];

    setApplicants(applicants.map((applicant, index) => {
      if (testData[index]) {
        return { ...applicant, ...testData[index] };
      }
      return applicant;
    }));

    setAdditionalDetails({
      ukPassport: "yes",
      adverseCredit: "no",
      adverseCreditDetails: "",
      guarantorRequired: "no",
      pets: "yes",
      petDetails: "1 cat",
      under18Count: "0",
      childrenAges: "",
      conditionsOfOffer: "Standard conditions accepted",
      depositType: "traditional",
      guarantorDetails: ""
    });

    setSignature("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
    setFullName("John Smith");
    setTermsAccepted(true);
    setDataSharing({
      utilities: true,
      insurance: true
    });

    console.log('All test data filled successfully');
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
    fillAllTestData,
    handleNext,
    handleSubmit,
    isSubmitting,
    isSubmitted
  });
};

export default FormProvider;
