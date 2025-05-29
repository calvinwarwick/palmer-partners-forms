import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Home, FileText, CheckCircle, MapPin, Building, Info, Briefcase, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { Applicant, PropertyPreferences, AdditionalDetails, Application } from "@/domain/types/Applicant";
import { validateAndHighlightFields, highlightInvalidField } from "@/utils/fieldValidation";

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
      // Get invalid fields and highlight them
      const invalidFields = validateAndHighlightFields(
        currentStep, 
        applicants, 
        propertyPreferences, 
        additionalDetails, 
        signature, 
        termsAccepted,
        fullName
      );
      
      // Highlight each invalid field with a delay
      invalidFields.forEach((fieldId, index) => {
        setTimeout(() => {
          highlightInvalidField(fieldId);
        }, index * 500); // 500ms delay between each highlight
      });
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

  // Function to determine which steps to show on mobile
  const getMobileVisibleSteps = () => {
    const steps = [
      { step: 1, icon: Building, label: "Property Details" },
      { step: 2, icon: User, label: "Personal Info" },
      { step: 3, icon: Briefcase, label: "Employment" },
      { step: 4, icon: MapPin, label: "Current Address" },
      { step: 5, icon: Info, label: "Additional Details" },
      { step: 6, icon: CheckCircle, label: "Terms & Sign" }
    ];

    // On mobile, show max 3 steps: previous, current, next
    const visibleSteps = [];
    
    if (currentStep > 1) {
      visibleSteps.push(steps[currentStep - 2]); // Previous step
    }
    
    visibleSteps.push(steps[currentStep - 1]); // Current step
    
    if (currentStep < totalSteps) {
      visibleSteps.push(steps[currentStep]); // Next step
    }

    return { allSteps: steps, visibleSteps };
  };

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

  const { allSteps, visibleSteps } = getMobileVisibleSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-orange-500 rounded-full shadow-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tenancy Application</h1>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200" />
          </div>

          {/* Enhanced Desktop step indicators */}
          <div className="hidden md:flex justify-between mb-10 overflow-visible bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {allSteps.map(({ step, icon: Icon, label }, index) => (
              <div key={step} className="flex flex-col items-center min-w-0 flex-1 relative step-indicator">
                {/* Connection line */}
                {index < allSteps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 z-0 ${
                    currentStep > step ? "bg-orange-500" : "bg-gray-200"
                  }`} style={{ transform: 'translateX(50%)' }} />
                )}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 relative z-10 border-2 transition-all duration-300 shadow-sm ${
                  currentStep === step 
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg scale-110" 
                    : currentStep > step
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-400 border-gray-200"
                }`}>
                  <Icon className="h-6 w-6" />
                  <div className={`step-badge bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center w-6 h-6 border-2 border-white ${isStepCompleted(step) && step < currentStep ? 'animate-in' : ''}`}>
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                <span className={`text-sm text-center px-2 font-medium transition-colors ${
                  currentStep >= step ? "text-orange-600" : "text-gray-500"
                }`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Enhanced Mobile step indicators */}
          <div className="flex md:hidden justify-center mb-8 overflow-visible bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-x-6">
            {visibleSteps.map(({ step, icon: Icon, label }) => (
              <div key={step} className="flex flex-col items-center relative step-indicator mobile-visible">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative border-2 transition-all duration-300 ${
                  currentStep === step 
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg" 
                    : currentStep > step
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-400 border-gray-200"
                }`}>
                  <Icon className="h-6 w-6" />
                  <div className={`step-badge bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center w-6 h-6 border-2 border-white ${isStepCompleted(step) && step < currentStep ? 'animate-in' : ''}`}>
                    <Check className="h-3 w-3" />
                  </div>
                </div>
                <span className={`text-xs text-center px-1 font-medium ${
                  currentStep >= step ? "text-orange-600" : "text-gray-500"
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-10 pt-8 border-t border-gray-100">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={isSubmitting}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 px-6 py-3 font-medium"
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-medium shadow-lg"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-medium shadow-lg"
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
