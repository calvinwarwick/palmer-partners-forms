import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";
import GuarantorSummary from "@/components/applicants/GuarantorSummary";
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
  const [applicantToggles, setApplicantToggles] = useState<{
    [key: string]: {
      ukPassport: boolean;
      adverseCredit: boolean;
      guarantorRequired: boolean;
    };
  }>({});
  const [hasApplicantSelection, setHasApplicantSelection] = useState(false);

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
                    Applicant {index + 1}
                    {applicant.firstName && applicant.lastName && <span className="font-normal ml-1 md:ml-2 block md:inline">
                        - {applicant.firstName} {applicant.lastName}
                      </span>}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                <FormFieldWithTooltip label="First Name" tooltip="This should be your name as it appears on your passport." required={true} htmlFor={`firstName-${applicant.id}`}>
                  <Input id={`firstName-${applicant.id}`} value={applicant.firstName} onChange={e => onUpdateApplicant(applicant.id, 'firstName', e.target.value)} placeholder="Enter first name" className="form-control" style={{
                paddingLeft: '1rem'
              }} />
                </FormFieldWithTooltip>

                <FormFieldWithTooltip label="Last Name" tooltip="This should be your name as it appears on your passport." required={true} htmlFor={`lastName-${applicant.id}`}>
                  <Input id={`lastName-${applicant.id}`} value={applicant.lastName} onChange={e => onUpdateApplicant(applicant.id, 'lastName', e.target.value)} placeholder="Enter last name" className="form-control" style={{
                paddingLeft: '1rem'
              }} />
                </FormFieldWithTooltip>

                <div className="space-y-2">
                  <Label htmlFor={`dateOfBirth-${applicant.id}`} className="form-label">Date of Birth *</Label>
                  <div className="date-input-container">
                    <Calendar className="date-input-icon text-orange-500" />
                    <Input id={`dateOfBirth-${applicant.id}`} name={`dateOfBirth-${applicant.id}`} type="date" value={applicant.dateOfBirth} onChange={e => handleDateOfBirthChange(applicant.id, e.target.value)} className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" required max="2300-12-31" style={{
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
                }} />
                  </div>
                </div>

                <FormFieldWithTooltip label="Email Address" tooltip="We must have a different email address for each applicant" required={true} htmlFor={`email-${applicant.id}`}>
                  <Input id={`email-${applicant.id}`} type="email" value={applicant.email} onChange={e => onUpdateApplicant(applicant.id, 'email', e.target.value)} placeholder="Enter email address" className="form-control" style={{
                paddingLeft: '1rem'
              }} />
                </FormFieldWithTooltip>

                <div className="space-y-2">
                  <Label htmlFor={`phone-${applicant.id}`} className="form-label">Mobile Number *</Label>
                  <Input id={`phone-${applicant.id}`} value={applicant.phone} onChange={e => onUpdateApplicant(applicant.id, 'phone', e.target.value)} placeholder="Enter mobile number" className="form-control" style={{
                paddingLeft: '1rem'
              }} />
                </div>
              </div>

              {/* Enhanced Checkbox Questions */}
              <div className="space-y-3 md:space-y-4 pt-4 md:pt-6">
                <div className="checkbox-container">
                  <Checkbox 
                    id={`ukPassport-${applicant.id}`}
                    checked={toggles.ukPassport}
                    onCheckedChange={checked => updateApplicantToggle(applicant.id, 'ukPassport', !!checked)}
                    className="mobile-checkbox mt-1"
                  />
                  <Label 
                    htmlFor={`ukPassport-${applicant.id}`} 
                    className="checkbox-label flex-1"
                  >
                    Do you hold a UK or Republic of Ireland passport?
                  </Label>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="checkbox-container">
                    <Checkbox 
                      id={`adverseCredit-${applicant.id}`}
                      checked={toggles.adverseCredit}
                      onCheckedChange={checked => updateApplicantToggle(applicant.id, 'adverseCredit', !!checked)}
                      className="mobile-checkbox mt-1"
                    />
                    <Label 
                      htmlFor={`adverseCredit-${applicant.id}`} 
                      className="checkbox-label flex-1"
                    >
                      Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy?
                    </Label>
                  </div>
                  
                  {toggles.adverseCredit && <Textarea id={`adverseCreditDetails-${applicant.id}`} value={applicant.adverseCreditDetails || ''} onChange={e => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)} placeholder="Please provide more details about your adverse credit history:" className="form-control resize-vertical border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white rounded-md shadow-sm p-3" rows={25} style={{
                  minHeight: '200px',
                  paddingLeft: '1rem'
                }} />}
                </div>
                
                <div className="checkbox-container">
                  <Checkbox 
                    id={`guarantorRequired-${applicant.id}`}
                    checked={toggles.guarantorRequired}
                    onCheckedChange={checked => updateApplicantToggle(applicant.id, 'guarantorRequired', !!checked)}
                    className="mobile-checkbox mt-1"
                  />
                  <Label 
                    htmlFor={`guarantorRequired-${applicant.id}`} 
                    className="checkbox-label flex-1"
                  >
                    If required, can you supply a guarantor for this proposed tenancy?
                  </Label>
                </div>
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
  );
};

export default PersonalInfoStep;
