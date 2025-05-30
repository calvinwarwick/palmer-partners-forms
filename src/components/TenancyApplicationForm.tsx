import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Home, FileText, CheckCircle, MapPin, Building, Info, Briefcase, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { Applicant, PropertyPreferences, AdditionalDetails, Application } from "@/domain/types/Applicant";
import { validateAndHighlightFields, handleValidationErrors } from "@/utils/fieldValidation";

// Import step components
import ApplicationSuccess from "@/components/tenancy-application/ApplicationSuccess";
import PropertyDetailsStep from "@/components/tenancy-application/steps/PropertyDetailsStep";
import PersonalInfoStep from "@/components/tenancy-application/steps/PersonalInfoStep";
import EmploymentStep from "@/components/tenancy-application/steps/EmploymentStep";
import CurrentAddressStep from "@/components/tenancy-application/steps/CurrentAddressStep";
import AdditionalDetailsStep from "@/components/tenancy-application/steps/AdditionalDetailsStep";
import TermsAndDataStep from "@/components/tenancy-application/steps/TermsAndDataStep";

const TenancyApplicationForm = () => {
  const totalSteps = 6;
  const { currentStep, progress, goToNext, goToPrevious, canProceed, isFirstStep, isLastStep } = useMultiStepForm(totalSteps);
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
      petDetails: ""
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
    depositType: ""
  });

  const [dataSharing, setDataSharing] = useState({
    utilities: false,
    insurance: true
  });

  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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
        petDetails: ""
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
      // Add applicants
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
          petDetails: ""
        });
      }
      setApplicants(newApplicants);
    } else if (count < currentCount) {
      // Remove applicants
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

  const fillAllTestData = () => {
    console.log('Fill All Test Data clicked - populating entire form');
    
    // Fill Property Preferences
    setPropertyPreferences({
      propertyType: "apartment",
      streetAddress: "123 Orchard House, New Cut",
      postcode: "IP7 5DA",
      maxRent: "2500",
      preferredLocation: "Central London",
      moveInDate: "2024-06-01",
      latestMoveInDate: "2024-06-15",
      initialTenancyTerm: "1 year",
      additionalRequests: "Pet-friendly property preferred"
    });

    // Fill Applicant Personal Info, Employment, and Address Data
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
        petDetails: "1 cat"
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
        petDetails: ""
      }
    ];

    // Update existing applicants with test data
    setApplicants(applicants.map((applicant, index) => {
      if (testData[index]) {
        return { ...applicant, ...testData[index] };
      }
      return applicant;
    }));

    // Fill Additional Details
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
      depositType: "traditional"
    });

    // Fill Terms and Data
    setSignature("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="); // Minimal test signature
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
    } else {
      // Get invalid fields and handle validation highlighting
      const invalidFields = validateAndHighlightFields(
        currentStep, 
        applicants, 
        propertyPreferences, 
        additionalDetails, 
        signature, 
        termsAccepted,
        fullName
      );
      
      // Use the new handleValidationErrors function
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

  // Check if step is completed
  const isStepCompleted = (step: number) => {
    if (step > currentStep) return false;
    return canProceed(step, applicants, propertyPreferences, additionalDetails, signature, termsAccepted);
  };

  const allSteps = [
    { step: 1, icon: Home, label: "Property Details" },
    { step: 2, icon: User, label: "Personal Info" },
    { step: 3, icon: Briefcase, label: "Employment" },
    { step: 4, icon: MapPin, label: "Current Address" },
    { step: 5, icon: Info, label: "Additional Details" },
    { step: 6, icon: CheckCircle, label: "Terms & Sign" }
  ];

  if (isSubmitted) {
    return <ApplicationSuccess applicants={applicants} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyDetailsStep
            propertyPreferences={propertyPreferences}
            onUpdatePreferences={updatePropertyPreferences}
            onFillAllTestData={fillAllTestData}
          />
        );
      case 2:
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
          <CurrentAddressStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
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
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
          />
        );
      case 6:
        return (
          <TermsAndDataStep
            dataSharing={dataSharing}
            onDataSharingChange={updateDataSharing}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            signature={signature}
            onSignatureChange={setSignature}
            fullName={fullName}
            onFullNameChange={setFullName}
            onFillAllTestData={fillAllTestData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Simple header matching the design */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Home className="h-6 w-6 text-orange-500 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">Tenancy Application</h1>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            {allSteps.map(({ step, icon: Icon, label }) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === step 
                    ? "bg-orange-500 text-white" 
                    : currentStep > step
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}>
                  {currentStep > step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs text-center ${
                  currentStep >= step ? "text-orange-600" : "text-gray-500"
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-sm border bg-white">
          <CardContent className="p-8">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {isFirstStep && <div></div>}
              
              {!isLastStep ? (
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenancyApplicationForm;
