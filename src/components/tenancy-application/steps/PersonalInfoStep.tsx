
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSwitch } from "@/components/ui/form-switch";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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
  const [applicantToggles, setApplicantToggles] = useState<{[key: string]: {
    ukPassport: boolean;
    adverseCredit: boolean;
    guarantorRequired: boolean;
  }}>({});

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

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <div className="border-b border-gray-200 mb-4 md:mb-6"></div>
      </div>

      <ApplicantCountSelector
        applicantCount={applicants.length}
        onApplicantCountChange={onApplicantCountChange}
      />

      {applicants.map((applicant, index) => {
        const toggles = getApplicantToggles(applicant.id);
        
        return (
          <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <span className="text-white text-sm md:text-base">
                    Applicant {index + 1}
                    {applicant.firstName && applicant.lastName && (
                      <span className="font-normal ml-1 md:ml-2 block md:inline">
                        - {applicant.firstName} {applicant.lastName}
                      </span>
                    )}
                  </span>
                </div>
                {applicants.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveApplicant(applicant.id)}
                    className="text-white hover:bg-white/20 h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${applicant.id}`} className="form-label">First Name *</Label>
                  <Input
                    id={`firstName-${applicant.id}`}
                    value={applicant.firstName}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'firstName', e.target.value)}
                    placeholder="Enter first name"
                    className="form-control"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${applicant.id}`} className="form-label">Last Name *</Label>
                  <Input
                    id={`lastName-${applicant.id}`}
                    value={applicant.lastName}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'lastName', e.target.value)}
                    placeholder="Enter last name"
                    className="form-control"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`email-${applicant.id}`} className="form-label">Email *</Label>
                  <Input
                    id={`email-${applicant.id}`}
                    type="email"
                    value={applicant.email}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
                    placeholder="Enter email address"
                    className="form-control"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`phone-${applicant.id}`} className="form-label">Phone Number *</Label>
                  <Input
                    id={`phone-${applicant.id}`}
                    value={applicant.phone}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="form-control"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor={`dateOfBirth-${applicant.id}`} className="form-label">Date of Birth *</Label>
                  <div className="date-input-container">
                    <Calendar className="date-input-icon" />
                    <Input
                      id={`dateOfBirth-${applicant.id}`}
                      type="date"
                      value={applicant.dateOfBirth}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'dateOfBirth', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Switch Questions */}
              <div className="space-y-4 md:space-y-6 border-t border-gray-200 pt-4 md:pt-6">
                <FormSwitch
                  id={`ukPassport-${applicant.id}`}
                  label="Do you hold a UK or Republic of Ireland passport?"
                  checked={toggles.ukPassport}
                  onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'ukPassport', checked)}
                />
                
                <div className="space-y-3 md:space-y-4">
                  <FormSwitch
                    id={`adverseCredit-${applicant.id}`}
                    label="Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy?"
                    checked={toggles.adverseCredit}
                    onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'adverseCredit', checked)}
                  />
                  
                  {toggles.adverseCredit && (
                    <div className="ml-0 md:ml-4 space-y-2">
                      <Label htmlFor={`adverseCreditDetails-${applicant.id}`} className="text-sm font-medium text-gray-700">
                        Please provide more details about your adverse credit history:
                      </Label>
                      <Textarea
                        id={`adverseCreditDetails-${applicant.id}`}
                        value={applicant.adverseCreditDetails || ''}
                        onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                        placeholder="Please describe your adverse credit history including type (IVA, CCJ, bankruptcy, etc.), dates, and current status..."
                        className="form-control min-h-[120px] resize-vertical border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white rounded-md shadow-sm p-3"
                      />
                    </div>
                  )}
                </div>
                
                <FormSwitch
                  id={`guarantorRequired-${applicant.id}`}
                  label="If required, can you supply a guarantor for this proposed tenancy?"
                  checked={toggles.guarantorRequired}
                  onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'guarantorRequired', checked)}
                />
              </div>
              
              {toggles.guarantorRequired && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => onGuarantorOpen(applicant)}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    Add Guarantor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PersonalInfoStep;
