import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Applicant, PropertyPreferences, AdditionalDetails, Application } from "@/domain/types/Applicant";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import PersonalInfoStep from "./tenancy-application/steps/PersonalInfoStep";
import CurrentAddressStep from "./tenancy-application/steps/CurrentAddressStep";
import EmploymentStep from "./tenancy-application/steps/EmploymentStep";
import PropertyDetailsStep from "./tenancy-application/steps/PropertyDetailsStep";
import AdditionalDetailsStep from "./tenancy-application/steps/AdditionalDetailsStep";
import TermsAndDataStep from "./tenancy-application/steps/TermsAndDataStep";
import ReviewStep from "./tenancy-application/steps/ReviewStep";
import ApplicationSuccess from "./tenancy-application/ApplicationSuccess";

const TOTAL_STEPS = 7;

const createEmptyApplicant = (): Applicant => ({
  id: crypto.randomUUID(),
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
});

const TenancyApplicationForm = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([createEmptyApplicant()]);
  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferences>({
    propertyType: "",
    streetAddress: "",
    postcode: "",
    maxRent: "",
    preferredLocation: "",
    moveInDate: "",
    latestMoveInDate: "",
    initialTenancyTerm: "",
    additionalRequests: "",
  });
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>({
    ukPassport: "",
    adverseCredit: "",
    adverseCreditDetails: "",
    guarantorRequired: "",
    guarantorDetails: "",
    pets: "",
    petDetails: "",
    under18Count: "0",
    childrenAges: "",
    conditionsOfOffer: "",
    depositType: "",
  });
  const [dataSharing, setDataSharing] = useState({
    utilities: false,
    insurance: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signature, setSignature] = useState("");

  const { currentStep, progress, goToNext, goToPrevious, canProceed, isFirstStep, isLastStep } = useMultiStepForm(TOTAL_STEPS);
  const { isSubmitting, isSubmitted, submitApplication } = useApplicationSubmission();

  const addApplicant = () => {
    if (applicants.length < 5) {
      setApplicants([...applicants, createEmptyApplicant()]);
    }
  };

  const removeApplicant = (id: string) => {
    if (applicants.length > 1) {
      setApplicants(applicants.filter(applicant => applicant.id !== id));
    }
  };

  const updateApplicant = (id: string, field: keyof Applicant, value: string) => {
    setApplicants(applicants.map(applicant => 
      applicant.id === id ? { ...applicant, [field]: value } : applicant
    ));
  };

  const handleApplicantCountChange = (count: number) => {
    const currentCount = applicants.length;
    
    if (count > currentCount) {
      const newApplicants = [];
      for (let i = currentCount; i < count; i++) {
        newApplicants.push(createEmptyApplicant());
      }
      setApplicants([...applicants, ...newApplicants]);
    } else if (count < currentCount) {
      setApplicants(applicants.slice(0, count));
    }
  };

  const updatePropertyPreferences = (field: keyof PropertyPreferences, value: string) => {
    setPropertyPreferences(prev => ({ ...prev, [field]: value }));
  };

  const updateAdditionalDetails = (field: keyof AdditionalDetails, value: string) => {
    setAdditionalDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleDataSharingChange = (field: string, value: boolean) => {
    setDataSharing(prev => ({ ...prev, [field]: value }));
  };

  const fillAllTestData = () => {
    // Fill applicant data
    const testApplicants = [
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
        pets: "no",
        petDetails: "",
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
      }
    ];

    const updatedApplicants = applicants.map((applicant, index) => {
      if (testApplicants[index]) {
        return { ...applicant, ...testApplicants[index] };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);

    // Fill property preferences
    setPropertyPreferences({
      propertyType: "apartment",
      streetAddress: "123 Orchard House, New Cut",
      postcode: "IP7 5DA",
      maxRent: "2500",
      preferredLocation: "Central London",
      moveInDate: "2024-06-01",
      latestMoveInDate: "2024-06-15",
      initialTenancyTerm: "1 year",
      additionalRequests: "Pet-friendly property preferred",
    });

    // Fill additional details
    setAdditionalDetails({
      ukPassport: "yes",
      adverseCredit: "no",
      adverseCreditDetails: "",
      guarantorRequired: "no",
      guarantorDetails: "",
      pets: "no",
      petDetails: "",
      under18Count: "0",
      childrenAges: "",
      conditionsOfOffer: "Standard lease terms acceptable",
      depositType: "traditional",
    });

    // Fill data sharing and terms
    setDataSharing({
      utilities: true,
      insurance: true,
    });
    setTermsAccepted(true);
    setSignature("John Smith");
  };

  const handleSubmit = async () => {
    const application: Application = {
      applicants,
      propertyPreferences,
      additionalDetails,
      dataSharing,
      signature,
    };

    await submitApplication(application);
  };

  const handleNext = () => {
    if (canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted)) {
      if (isLastStep) {
        handleSubmit();
      } else {
        goToNext();
      }
    }
  };

  if (isSubmitted) {
    return <ApplicationSuccess applicants={applicants} />;
  }

  const stepTitles = [
    "Personal Information",
    "Current Address",
    "Employment Details",
    "Property Details",
    "Additional Details",
    "Terms & Data Sharing",
    "Review & Submit"
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            applicants={applicants}
            onAddApplicant={addApplicant}
            onRemoveApplicant={removeApplicant}
            onUpdateApplicant={updateApplicant}
            onFillAllTestData={fillAllTestData}
            onApplicantCountChange={handleApplicantCountChange}
          />
        );
      case 2:
        return (
          <CurrentAddressStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
            onFillAllTestData={fillAllTestData}
          />
        );
      case 3:
        return (
          <EmploymentStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
            onFillAllTestData={fillAllTestData}
          />
        );
      case 4:
        return (
          <PropertyDetailsStep
            propertyPreferences={propertyPreferences}
            onUpdatePreferences={updatePropertyPreferences}
            onFillAllTestData={fillAllTestData}
          />
        );
      case 5:
        return (
          <AdditionalDetailsStep
            additionalDetails={additionalDetails}
            onUpdateDetails={updateAdditionalDetails}
            onFillAllTestData={fillAllTestData}
            maxRent={propertyPreferences.maxRent}
          />
        );
      case 6:
        return (
          <TermsAndDataStep
            dataSharing={dataSharing}
            termsAccepted={termsAccepted}
            onDataSharingChange={handleDataSharingChange}
            onTermsAcceptedChange={setTermsAccepted}
          />
        );
      case 7:
        return (
          <ReviewStep
            applicants={applicants}
            propertyPreferences={propertyPreferences}
            signature={signature}
            onSignatureChange={setSignature}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Tenancy Application</h1>
          <p className="text-gray-600 text-center">Step {currentStep} of {TOTAL_STEPS}: {stepTitles[currentStep - 1]}</p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 mb-6">
          {renderStep()}
        </Card>

        <div className="flex justify-between items-center">
          <Button
            onClick={goToPrevious}
            disabled={isFirstStep}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-sm text-gray-600">
              {canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) 
                ? "Ready to continue" 
                : "Please complete all required fields"}
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isLastStep ? (
              "Submit Application"
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenancyApplicationForm;
