
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-5 w-5" />
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
                <Input
                  id={`dateOfBirth-${applicant.id}`}
                  type="date"
                  value={applicant.dateOfBirth}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'dateOfBirth', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => onGuarantorOpen(applicant)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Add Guarantor
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={onAddApplicant}
          className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Applicant
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
