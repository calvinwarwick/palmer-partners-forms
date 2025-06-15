import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/flowbite-card";
import { User, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/flowbite-button";
import { Switch } from "@/components/ui/switch";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import { Input } from "@/components/ui/flowbite-input";
import { Label } from "@/components/ui/flowbite-label";
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
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <div className="text-left">
          <p className="text-light-grey mb-1">How many adults will be living in the property? <span className="text-red-500">*</span></p>
          <p className="text-light-grey mb-4">Please ensure you provide details for each applicant below.</p>
        </div>
        <div className="border-b border-gray-200 mb-6" style={{ marginTop: '10px' }}></div>
      </div>

      <ApplicantCountSelector
        applicantCount={applicants.length}
        onApplicantCountChange={onApplicantCountChange}
      />

      {applicants.map((applicant, index) => {
        const toggles = getApplicantToggles(applicant.id);
        
        return (
          <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white">
                    Applicant {index + 1}
                    {applicant.firstName && applicant.lastName && (
                      <span className="font-normal ml-2">
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
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`firstName-${applicant.id}`}>First Name *</Label>
                  <Input
                    id={`firstName-${applicant.id}`}
                    value={applicant.firstName}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor={`lastName-${applicant.id}`}>Last Name *</Label>
                  <Input
                    id={`lastName-${applicant.id}`}
                    value={applicant.lastName}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor={`email-${applicant.id}`}>Email *</Label>
                  <Input
                    id={`email-${applicant.id}`}
                    type="email"
                    value={applicant.email}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor={`phone-${applicant.id}`}>Phone Number *</Label>
                  <Input
                    id={`phone-${applicant.id}`}
                    value={applicant.phone}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor={`dateOfBirth-${applicant.id}`}>Date of Birth *</Label>
                  <div className="date-input-container relative">
                    <Calendar className="date-input-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5 z-10 pointer-events-none" />
                    <Input
                      id={`dateOfBirth-${applicant.id}`}
                      type="date"
                      value={applicant.dateOfBirth}
                      onChange={(e) => onUpdateApplicant(applicant.id, 'dateOfBirth', e.target.value)}
                      className="form-control pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Toggle Questions */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`ukPassport-${applicant.id}`} className="text-sm">
                    Do you hold a UK or Republic of Ireland passport?
                  </Label>
                  <Switch
                    id={`ukPassport-${applicant.id}`}
                    checked={toggles.ukPassport}
                    onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'ukPassport', checked)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`adverseCredit-${applicant.id}`} className="text-sm">
                      Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy?
                    </Label>
                    <Switch
                      id={`adverseCredit-${applicant.id}`}
                      checked={toggles.adverseCredit}
                      onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'adverseCredit', checked)}
                    />
                  </div>
                  
                  {toggles.adverseCredit && (
                    <div className="ml-4">
                      <Label htmlFor={`adverseCreditDetails-${applicant.id}`} className="text-sm text-gray-600">
                        Please provide more details about your adverse credit history:
                      </Label>
                      <Textarea
                        id={`adverseCreditDetails-${applicant.id}`}
                        value={applicant.adverseCreditDetails || ''}
                        onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                        placeholder="Please describe your adverse credit history including type (IVA, CCJ, bankruptcy, etc.), dates, and current status..."
                        className="mt-2 min-h-[100px]"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`guarantorRequired-${applicant.id}`} className="text-sm">
                    If required, can you supply a guarantor for this proposed tenancy?
                  </Label>
                  <Switch
                    id={`guarantorRequired-${applicant.id}`}
                    checked={toggles.guarantorRequired}
                    onCheckedChange={(checked) => updateApplicantToggle(applicant.id, 'guarantorRequired', checked)}
                  />
                </div>
              </div>
              
              {toggles.guarantorRequired && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => onGuarantorOpen(applicant)}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
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
