
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Applicant } from "@/domain/types/Applicant";
import { Plus, UserPlus } from "lucide-react";
import GuarantorSummary from "@/components/applicants/GuarantorSummary";

interface PersonalInfoStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: string, value: string) => void;
  onAddApplicant: () => void;
  onRemoveApplicant: (id: string) => void;
  onGuarantorOpen: (applicant: Applicant) => void;
}

const PersonalInfoStep = ({ 
  applicants, 
  onUpdateApplicant, 
  onAddApplicant, 
  onRemoveApplicant,
  onGuarantorOpen
}: PersonalInfoStepProps) => {
  
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (applicantId: string, value: string) => {
    // Convert DD/MM/YYYY to YYYY-MM-DD for storage
    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onUpdateApplicant(applicantId, 'dateOfBirth', isoDate);
    }
  };

  const handleGuarantorDelete = (applicantId: string) => {
    // Reset all guarantor fields for this applicant
    onUpdateApplicant(applicantId, 'guarantorAdded', 'false');
    onUpdateApplicant(applicantId, 'guarantorName', '');
    onUpdateApplicant(applicantId, 'guarantorLastName', '');
    onUpdateApplicant(applicantId, 'guarantorEmail', '');
    onUpdateApplicant(applicantId, 'guarantorPhone', '');
    onUpdateApplicant(applicantId, 'guarantorDateOfBirth', '');
    onUpdateApplicant(applicantId, 'guarantorEmploymentStatus', '');
    onUpdateApplicant(applicantId, 'guarantorCompanyName', '');
    onUpdateApplicant(applicantId, 'guarantorJobTitle', '');
    onUpdateApplicant(applicantId, 'guarantorIncome', '');
    onUpdateApplicant(applicantId, 'guarantorLengthOfService', '');
    onUpdateApplicant(applicantId, 'guarantorAddress', '');
    onUpdateApplicant(applicantId, 'guarantorPostcode', '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <Button
          type="button"
          onClick={onAddApplicant}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Applicant
        </Button>
      </div>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="font-lexend">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">
              Applicant {index + 1} - Personal Details
            </CardTitle>
            {applicants.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveApplicant(applicant.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>

            <div>
              <Label htmlFor={`dateOfBirth-${applicant.id}`}>Date of Birth *</Label>
              <Input
                id={`dateOfBirth-${applicant.id}`}
                value={formatDateForDisplay(applicant.dateOfBirth)}
                onChange={(e) => handleDateChange(applicant.id, e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <Label htmlFor={`email-${applicant.id}`}>Email Address *</Label>
              <Input
                id={`email-${applicant.id}`}
                type="email"
                value={applicant.email}
                onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <Label htmlFor={`phone-${applicant.id}`}>Mobile Number *</Label>
              <Input
                id={`phone-${applicant.id}`}
                type="tel"
                value={applicant.phone}
                onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <Label>Do you have a UK or Republic of Ireland passport? *</Label>
              <RadioGroup
                value={applicant.ukPassport || ""}
                onValueChange={(value) => onUpdateApplicant(applicant.id, 'ukPassport', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`passport-yes-${applicant.id}`} />
                  <Label htmlFor={`passport-yes-${applicant.id}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`passport-no-${applicant.id}`} />
                  <Label htmlFor={`passport-no-${applicant.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Do you have any adverse credit history? *</Label>
              <RadioGroup
                value={applicant.adverseCredit || ""}
                onValueChange={(value) => onUpdateApplicant(applicant.id, 'adverseCredit', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`credit-yes-${applicant.id}`} />
                  <Label htmlFor={`credit-yes-${applicant.id}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`credit-no-${applicant.id}`} />
                  <Label htmlFor={`credit-no-${applicant.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>

            {applicant.adverseCredit === 'yes' && (
              <div>
                <Label htmlFor={`adverseCreditDetails-${applicant.id}`}>Please provide details *</Label>
                <Textarea
                  id={`adverseCreditDetails-${applicant.id}`}
                  value={applicant.adverseCreditDetails || ''}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                  placeholder="Please provide details about your adverse credit history"
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label>Do you require a guarantor? *</Label>
              <RadioGroup
                value={applicant.guarantorRequired || ""}
                onValueChange={(value) => onUpdateApplicant(applicant.id, 'guarantorRequired', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`guarantor-yes-${applicant.id}`} />
                  <Label htmlFor={`guarantor-yes-${applicant.id}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`guarantor-no-${applicant.id}`} />
                  <Label htmlFor={`guarantor-no-${applicant.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Guarantor Section */}
            <div className="space-y-4">
              {applicant.guarantorAdded && applicant.guarantorName ? (
                <GuarantorSummary
                  guarantorName={applicant.guarantorName}
                  guarantorLastName={applicant.guarantorLastName}
                  guarantorEmail={applicant.guarantorEmail}
                  guarantorPhone={applicant.guarantorPhone}
                  onEdit={() => onGuarantorOpen(applicant)}
                  onDelete={() => handleGuarantorDelete(applicant.id)}
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onGuarantorOpen(applicant)}
                  className="w-full flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Guarantor Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PersonalInfoStep;
