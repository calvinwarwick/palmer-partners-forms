
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Home, FileText, CheckCircle } from "lucide-react";

import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { Applicant, PropertyPreferences } from "@/domain/types/Applicant";

import PersonalInfoStep from "./tenancy-application/steps/PersonalInfoStep";
import EmploymentStep from "./tenancy-application/steps/EmploymentStep";
import PreferencesStep from "./tenancy-application/steps/PreferencesStep";
import ReviewStep from "./tenancy-application/steps/ReviewStep";
import ApplicationSuccess from "./tenancy-application/ApplicationSuccess";

const TenancyApplicationForm = () => {
  const totalSteps = 4;
  const { currentStep, progress, goToNext, goToPrevious, canProceed, isFirstStep, isLastStep } = useMultiStepForm(totalSteps);
  const { isSubmitting, isSubmitted, submitApplication } = useApplicationSubmission();

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employment: "",
      annualIncome: "",
      previousAddress: "",
      reference1Name: "",
      reference1Contact: ""
    }
  ]);

  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferences>({
    propertyType: "",
    maxRent: "",
    preferredLocation: "",
    moveInDate: "",
    additionalRequests: ""
  });

  const [signature, setSignature] = useState("");

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
        annualIncome: "",
        previousAddress: "",
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

  const handleNext = () => {
    if (canProceed(applicants, propertyPreferences, signature)) {
      goToNext();
    }
  };

  const handleSubmit = async () => {
    const application = { applicants, propertyPreferences, signature };
    await submitApplication(application);
  };

  if (isSubmitted) {
    return <ApplicationSuccess applicants={applicants} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            applicants={applicants}
            onAddApplicant={addApplicant}
            onRemoveApplicant={removeApplicant}
            onUpdateApplicant={updateApplicant}
          />
        );
      case 2:
        return (
          <EmploymentStep
            applicants={applicants}
            onUpdateApplicant={updateApplicant}
          />
        );
      case 3:
        return (
          <PreferencesStep
            propertyPreferences={propertyPreferences}
            onUpdatePreferences={updatePropertyPreferences}
          />
        );
      case 4:
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
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <Home className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tenancy Application</h1>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between mb-8">
            {[
              { step: 1, icon: User, label: "Personal Info" },
              { step: 2, icon: FileText, label: "Employment" },
              { step: 3, icon: Home, label: "Preferences" },
              { step: 4, icon: CheckCircle, label: "Review & Sign" }
            ].map(({ step, icon: Icon, label }) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-600 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
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
                  disabled={!canProceed(applicants, propertyPreferences, signature) || isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed(applicants, propertyPreferences, signature) || isSubmitting}
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
