
import { Card, CardContent } from "@/components/ui/card";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import ApplicationSuccess from "@/components/tenancy-application/ApplicationSuccess";
import FormProvider from "@/components/tenancy-application/FormProvider";
import ProgressHeader from "@/components/tenancy-application/ProgressHeader";
import StepIndicator from "@/components/tenancy-application/StepIndicator";
import NavigationButtons from "@/components/tenancy-application/NavigationButtons";
import FormSteps from "@/components/tenancy-application/FormSteps";
import GuarantorForm from "@/components/applicants/GuarantorForm";

const TenancyApplicationForm = () => {
  return (
    <FormProvider>
      {(formContext) => {
        const {
          currentStep,
          progress,
          totalSteps,
          isFirstStep,
          isLastStep,
          isSubmitting,
          isSubmitted,
          applicants,
          signature,
          termsAccepted,
          propertyPreferences,
          additionalDetails,
          guarantorFormOpen,
          selectedApplicantForGuarantor,
          canProceed,
          goToPrevious,
          handleNext,
          handleSubmit,
          handleGuarantorSave,
          setGuarantorFormOpen,
          fillTestData
        } = formContext;

        if (isSubmitted) {
          return <ApplicationSuccess applicants={applicants} />;
        }

        const canSubmit = canProceed(currentStep, applicants, propertyPreferences, additionalDetails, signature, termsAccepted);

        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
            <ApplicationHeader title="Tenancy Application" />
            
            <div className="py-8">
              <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress and step indicators */}
                <div className="mb-8">
                  <Card className="bg-white/90 backdrop-blur-sm border-0" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                    <CardContent className="p-8">
                      <ProgressHeader 
                        progress={progress}
                        totalSteps={totalSteps}
                        currentStep={currentStep}
                      />
                      <StepIndicator currentStep={currentStep} />
                    </CardContent>
                  </Card>
                </div>

                {/* Main form content */}
                <Card className="bg-white/95 backdrop-blur-sm border-0" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                  <CardContent className="p-8 md:p-12">
                    <div className="min-h-[500px]">
                      <FormSteps formContext={formContext} />
                    </div>
                    
                    <NavigationButtons
                      isFirstStep={isFirstStep}
                      isLastStep={isLastStep}
                      isSubmitting={isSubmitting}
                      canSubmit={canSubmit}
                      onPrevious={goToPrevious}
                      onNext={handleNext}
                      onSubmit={handleSubmit}
                      onFillTestData={fillTestData}
                    />
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
          </div>
        );
      }}
    </FormProvider>
  );
};

export default TenancyApplicationForm;
