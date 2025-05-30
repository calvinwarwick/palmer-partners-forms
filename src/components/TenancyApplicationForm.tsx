import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Home, FileText, CheckCircle, MapPin, Building, Info, Briefcase, Check, TestTube } from "lucide-react";
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
import GuarantorForm from "@/components/applicants/GuarantorForm";

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
    { step: 1, icon: Home, label: "Property", description: "Property details and preferences" },
    { step: 2, icon: User, label: "Personal", description: "Personal information" },
    { step: 3, icon: Briefcase, label: "Employment", description: "Employment details" },
    { step: 4, icon: MapPin, label: "Address", description: "Current address" },
    { step: 5, icon: Info, label: "Additional", description: "Additional details" },
    { step: 6, icon: CheckCircle, label: "Complete", description: "Terms and signature" }
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
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            applicants={applicants}
            onAddApplicant={addApplicant}
            onRemoveApplicant={removeApplicant}
            onUpdateApplicant={updateApplicant}
            onApplicantCountChange={handleApplicantCountChange}
            onGuarantorOpen={handleGuarantorOpen}
          />
        );
      case 3:
        return (
          <EmploymentStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
          />
        );
      case 4:
        return (
          <CurrentAddressStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 py-8 font-lexend">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Modern header with new color scheme */}
        <div className="mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-dark-grey">Tenancy Application</h1>
                    <p className="text-light-grey">Complete your application in {totalSteps} easy steps</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 font-lexend">
                  Step {currentStep} of {totalSteps}
                </Badge>
              </div>

              {/* Enhanced progress bar with orange colors */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-light-grey mb-3">
                  <span className="font-medium text-dark-grey">{Math.round(progress)}% Complete</span>
                  <span className="text-light-grey">{6 - currentStep} steps remaining</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-3 bg-gray-200"
                />
              </div>

              {/* Modern step indicators with new color scheme */}
              <div className="grid grid-cols-6 gap-2">
                {allSteps.map(({ step, icon: Icon, label, description }) => (
                  <div key={step} className="text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto transition-all duration-300 ${
                      currentStep === step 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110" 
                        : currentStep > step
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-light-grey"
                    }`}>
                      {currentStep > step ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className={`text-xs font-medium font-lexend ${
                      currentStep >= step ? "text-orange-600" : "text-light-grey"
                    }`}>
                      {label}
                    </div>
                    <div className="text-xs text-light-grey hidden sm:block font-lexend">
                      {description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main form content with enhanced styling */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="min-h-[500px]">
              {renderStepContent()}
            </div>
            
            {/* Enhanced navigation buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
              {!isFirstStep ? (
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={isSubmitting}
                  className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-orange-500 hover:text-gray-800 px-8 py-3 font-medium shadow-sm font-lexend"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={fillAllTestData}
                  className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 px-6 py-3 font-medium shadow-sm font-lexend"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Fill All Data
                </Button>
                
                {!isLastStep ? (
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-lexend"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-lexend"
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
            </div>
          </CardContent>
        </Card>

        {/* Guarantor Form Modal */}
        {guarantorFormOpen && selectedApplicantForGuarantor && (
          <GuarantorForm
            applicant={selectedApplicantForGuarantor}
            applicationId="current-application"
            isOpen={guarantorFormOpen}
            onClose={() => setGuarantorFormOpen(false)}
            onSave={handleGuarantorSave}
          />
        )}
      </div>
    </div>
  );
};

export default TenancyApplicationForm;
