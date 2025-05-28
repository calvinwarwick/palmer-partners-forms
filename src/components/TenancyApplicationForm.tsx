import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Home, FileText, CheckCircle, MapPin, Building, Info, Briefcase } from "lucide-react";

import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { Applicant, PropertyPreferences, AdditionalDetails, Application } from "@/domain/types/Applicant";

import PropertyDetailsStep from "./tenancy-application/steps/PropertyDetailsStep";
import PersonalInfoStep from "./tenancy-application/steps/PersonalInfoStep";
import EmploymentStep from "./tenancy-application/steps/EmploymentStep";
import CurrentAddressStep from "./tenancy-application/steps/CurrentAddressStep";
import AdditionalDetailsStep from "./tenancy-application/steps/AdditionalDetailsStep";
import TermsAndDataStep from "./tenancy-application/steps/TermsAndDataStep";
import ApplicationSuccess from "./tenancy-application/ApplicationSuccess";

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
      reference1Contact: ""
    }
  ]);

  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>({
    ukPassport: "",
    adverseCredit: "",
    adverseCreditDetails: "",
    guarantorRequired: "",
    pets: "",
    under18Count: "",
    childrenAges: "",
    conditionsOfOffer: "",
    depositType: ""
  });

  const [dataSharing, setDataSharing] = useState({
    utilities: false,
    insurance: false
  });

  const [signature, setSignature] = useState("");
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
        reference1Contact: ""
      };
      setApplicants([...applicants, newApplicant]);
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
        reference1Contact: "mike.johnson@techsolutions.com"
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
        reference1Contact: "lisa.brown@designstudio.com"
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
      pets: "yes - 1 cat",
      under18Count: "0",
      childrenAges: "",
      conditionsOfOffer: "Standard conditions accepted",
      depositType: "standard"
    });

    // Fill Terms and Data
    setSignature("John Smith");
    setTermsAccepted(true);
    setDataSharing({
      utilities: true,
      insurance: false
    });

    console.log('All test data filled successfully');
  };

  const handleNext = () => {
    if (canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted)) {
      goToNext();
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
          />
        );
      case 6:
        return (
          <TermsAndDataStep
            dataSharing={dataSharing}
            onUpdateDataSharing={updateDataSharing}
            signature={signature}
            onSignatureChange={setSignature}
            termsAccepted={termsAccepted}
            onTermsAccepted={setTermsAccepted}
            onFillAllTestData={fillAllTestData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Tenancy Application</h1>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between mb-8 overflow-x-auto">
            {[
              { step: 1, icon: Building, label: "Property Details" },
              { step: 2, icon: User, label: "Personal Info" },
              { step: 3, icon: Briefcase, label: "Employment" },
              { step: 4, icon: MapPin, label: "Current Address" },
              { step: 5, icon: Info, label: "Additional Details" },
              { step: 6, icon: CheckCircle, label: "Terms & Sign" }
            ].map(({ step, icon: Icon, label }) => (
              <div key={step} className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground text-center px-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="my-16">
          <CardContent className="pt-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={isFirstStep || isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {!isLastStep ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted) || isSubmitting}
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
