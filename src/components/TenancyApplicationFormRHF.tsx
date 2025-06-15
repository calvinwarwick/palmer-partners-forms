
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import ApplicationSuccess from "@/components/tenancy-application/ApplicationSuccess";
import RHFFormProvider, { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";
import ProgressHeader from "@/components/tenancy-application/ProgressHeader";
import StepIndicator from "@/components/tenancy-application/StepIndicator";
import NavigationButtons from "@/components/tenancy-application/NavigationButtons";
import RHFFormSteps from "@/components/tenancy-application/RHFFormSteps";
import GuarantorForm from "@/components/applicants/GuarantorForm";

const TenancyApplicationFormContent = () => {
  const {
    form,
    currentStep,
    progress,
    totalSteps,
    isFirstStep,
    isLastStep,
    isSubmitting,
    isSubmitted,
    guarantorFormOpen,
    selectedApplicantForGuarantor,
    goToPrevious,
    handleNext,
    handleSubmit,
    handleGuarantorSave,
    setGuarantorFormOpen,
    fillAllTestData,
    fillStepData
  } = useRHFFormContext();

  if (isSubmitted) {
    const applicants = form.getValues("personalInfo.applicants");
    return <ApplicationSuccess applicants={applicants as any[]} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Tenancy Application" />
      
      <div className="py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
          {/* Progress and step indicators */}
          <div className="mb-4 sm:mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-0" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
              <CardContent className="p-4 sm:p-8">
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
            <CardContent className="p-4 sm:p-8 md:p-12">
              <div className="min-h-[400px] sm:min-h-[500px]">
                <Form {...form}>
                  <RHFFormSteps />
                </Form>
              </div>
              
              <NavigationButtons
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
                canSubmit={true} // RHF handles validation
                onPrevious={goToPrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
                onFillTestData={fillAllTestData}
                onFillStepData={fillStepData}
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
};

const TenancyApplicationFormRHF = () => {
  return (
    <RHFFormProvider>
      {() => <TenancyApplicationFormContent />}
    </RHFFormProvider>
  );
};

export default TenancyApplicationFormRHF;
