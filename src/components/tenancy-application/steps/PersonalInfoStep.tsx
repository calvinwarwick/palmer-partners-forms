
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SwitchField } from "@/components/ui/switch-field";
import { FormField } from "@/components/ui/form-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import GuarantorSummary from "@/components/applicants/GuarantorSummary";
import { useState, useEffect } from "react";

interface PersonalInfoStepProps {
  applicants: Applicant[];
  onAddApplicant: () => void;
  onRemoveApplicant: (id: string) => void;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onApplicantCountChange: (count: number) => void;
  onGuarantorOpen: (applicant: Applicant) => void;
}

const PersonalInfoStep = ({
  applicants,
  onAddApplicant,
  onRemoveApplicant,
  onUpdateApplicant,
  onApplicantCountChange,
  onGuarantorOpen
}: PersonalInfoStepProps) => {
  const [applicantToggles, setApplicantToggles] = useState<{
    [key: string]: {
      ukPassport: boolean;
      adverseCredit: boolean;
      guarantorRequired: boolean;
    };
  }>({});
  const [hasApplicantSelection, setHasApplicantSelection] = useState(false);

  // Set hasApplicantSelection to true if applicants already exist (e.g., when returning to this step)
  useEffect(() => {
    if (applicants.length > 0) {
      setHasApplicantSelection(true);
    }
  }, [applicants.length]);

  const updateApplicantToggle = (applicantId: string, field: string, value: boolean) => {
    setApplicantToggles(prev => ({
      ...prev,
      [applicantId]: {
        ...prev[applicantId],
        [field]: value
      }
    }));
  };

  const getApplicantToggles = (applicantId: string) => {
    return applicantToggles[applicantId] || {
      ukPassport: false,
      adverseCredit: false,
      guarantorRequired: false
    };
  };

  const getApplicantDisplayName = (applicant: Applicant, index: number) => {
    if (applicant.firstName && applicant.lastName) {
      return `${applicant.firstName} ${applicant.lastName}`;
    }
    return `Applicant ${index + 1}`;
  };

  const handleDeleteGuarantor = (applicantId: string) => {
    onUpdateApplicant(applicantId, 'guarantorAdded' as keyof Applicant, '');
    onUpdateApplicant(applicantId, 'guarantorName' as keyof Applicant, '');
    onUpdateApplicant(applicantId, 'guarantorRelationship' as keyof Applicant, '');
  };

  const handleDateOfBirthChange = (applicantId: string, value: string) => {
    // Extract parts and limit year to 4 digits
    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const limitedYear = year.slice(0, 4);
      const formattedDate = `${limitedYear}-${month}-${day}`;
      onUpdateApplicant(applicantId, 'dateOfBirth', formattedDate);
    } else {
      onUpdateApplicant(applicantId, 'dateOfBirth', value);
    }
  };

  const handleApplicantCountChange = (count: number) => {
    setHasApplicantSelection(true);
    onApplicantCountChange(count);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 md:space-y-8 font-lexend">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-dark-grey mb-2">Personal Details</h3>
          <p className="text-light-grey mb-4">Please provide personal details for each applicant.</p>
          <div className="border-b border-gray-200 mb-4 md:mb-6"></div>
        </div>

        <ApplicantCountSelector 
          applicantCount={applicants.length} 
          onApplicantCountChange={handleApplicantCountChange}
          hasSelection={hasApplicantSelection}
        />

        {hasApplicantSelection && applicants.length > 0 && applicants.map((applicant, index) => {
          const toggles = getApplicantToggles(applicant.id);
          return (
            <Card key={applicant.id} className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="text-base md:text-lg font-semibold flex items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <span className="text-white text-sm md:text-base">
                      {getApplicantDisplayName(applicant, index)}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                  <FormField
                    label={
                      <div className="flex items-center gap-2">
                        <span>First Name</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                              <span className="text-white text-xs font-bold">?</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This should be your name as it appears on your passport.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    }
                    required
                    htmlFor={`firstName-${applicant.id}`}
                  >
                    <Input
                      id={`firstName-${applicant.id}`}
                      value={applicant.firstName}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </FormField>

                  <FormField
                    label={
                      <div className="flex items-center gap-2">
                        <span>Last Name</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                              <span className="text-white text-xs font-bold">?</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This should be your name as it appears on your passport.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    }
                    required
                    htmlFor={`lastName-${applicant.id}`}
                  >
                    <Input
                      id={`lastName-${applicant.id}`}
                      value={applicant.lastName}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </FormField>

                  <FormField
                    label="Date of Birth"
                    required
                    htmlFor={`dateOfBirth-${applicant.id}`}
                  >
                    <div className="date-input-container">
                      <Calendar className="date-input-icon" />
                      <Input
                        id={`dateOfBirth-${applicant.id}`}
                        type="date"
                        value={applicant.dateOfBirth}
                        onChange={(e) => handleDateOfBirthChange(applicant.id, e.target.value)}
                        max="2300-12-31"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-left pl-12"
                      />
                    </div>
                  </FormField>

                  <FormField
                    label={
                      <div className="flex items-center gap-2">
                        <span>Email Address</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                              <span className="text-white text-xs font-bold">?</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>We must have a different email address for each applicant</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    }
                    required
                    htmlFor={`email-${applicant.id}`}
                  >
                    <Input
                      id={`email-${applicant.id}`}
                      type="email"
                      value={applicant.email}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </FormField>

                  <FormField
                    label="Mobile Number"
                    required
                    htmlFor={`phone-${applicant.id}`}
                  >
                    <Input
                      id={`phone-${applicant.id}`}
                      type="tel"
                      value={applicant.phone}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
                      placeholder="Enter mobile number"
                    />
                  </FormField>
                </div>

                {/* Switch Questions */}
                <div className="space-y-4 md:space-y-6 pt-4 md:pt-6">
                  <SwitchField
                    id={`ukPassport-${applicant.id}`}
                    label="Do you hold a UK or Republic of Ireland passport?"
                    checked={toggles.ukPassport}
                    onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'ukPassport', checked)}
                  />
                  
                  <div className="space-y-3 md:space-y-4">
                    <SwitchField
                      id={`adverseCredit-${applicant.id}`}
                      label="Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy?"
                      checked={toggles.adverseCredit}
                      onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'adverseCredit', checked)}
                    />
                    
                    {toggles.adverseCredit && (
                      <FormField
                        label="Please provide details on any adverse credit"
                        required
                        htmlFor={`adverseCreditDetails-${applicant.id}`}
                      >
                        <Textarea
                          id={`adverseCreditDetails-${applicant.id}`}
                          value={applicant.adverseCreditDetails || ''}
                          onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                          placeholder=""
                          rows={6}
                        />
                      </FormField>
                    )}
                  </div>
                  
                  <SwitchField
                    id={`guarantorRequired-${applicant.id}`}
                    label="If required, can you supply a guarantor for this proposed tenancy?"
                    checked={toggles.guarantorRequired}
                    onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'guarantorRequired', checked)}
                  />
                </div>
                
                {toggles.guarantorRequired && <div className="space-y-4">
                    {(applicant as any).guarantorAdded && (applicant as any).guarantorName ? <GuarantorSummary guarantorName={(applicant as any).guarantorName} guarantorRelationship={(applicant as any).guarantorRelationship} onEdit={() => onGuarantorOpen(applicant)} onDelete={() => handleDeleteGuarantor(applicant.id)} /> : <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => onGuarantorOpen(applicant)} className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors">
                          Add Guarantor
                        </Button>
                      </div>}
                  </div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default PersonalInfoStep;
