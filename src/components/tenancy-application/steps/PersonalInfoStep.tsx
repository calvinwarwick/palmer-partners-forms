
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark-grey mb-2 font-lexend">Personal Information</h2>
        <p className="text-light-grey font-lexend">Please provide personal details for all applicants</p>
      </div>

      <Card className="border border-gray-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardContent className="p-6">
          <div className="mb-6">
            <Label className="text-base font-medium text-dark-grey mb-3 block font-lexend">
              Number of Applicants
            </Label>
            <ApplicantCountSelector
              applicantCount={applicants.length}
              onApplicantCountChange={onApplicantCountChange}
            />
          </div>
        </CardContent>
      </Card>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border border-gray-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-dark-grey font-lexend">
                Applicant {index + 1}
              </h3>
              {applicants.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveApplicant(applicant.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor={`firstName-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  First Name *
                </Label>
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'firstName', e.target.value)}
                  className="mt-1"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div>
                <Label htmlFor={`lastName-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  Last Name *
                </Label>
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'lastName', e.target.value)}
                  className="mt-1"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div>
                <Label htmlFor={`dateOfBirth-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  Date of Birth *
                </Label>
                <Input
                  id={`dateOfBirth-${applicant.id}`}
                  type="date"
                  value={applicant.dateOfBirth}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'dateOfBirth', e.target.value)}
                  className="mt-1"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div>
                <Label htmlFor={`email-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  Email Address *
                </Label>
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
                  className="mt-1"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div>
                <Label htmlFor={`phone-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  Phone Number *
                </Label>
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
                  className="mt-1"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`adverseCredit-${applicant.id}`}
                  checked={applicant.adverseCredit === 'yes'}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCredit', e.target.checked ? 'yes' : 'no')}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor={`adverseCredit-${applicant.id}`} className="text-dark-grey font-medium font-lexend">
                  Do you have any adverse credit history?
                </Label>
              </div>
              
              {applicant.adverseCredit === 'yes' && (
                <div className="mt-3">
                  <Label className="text-dark-grey font-medium font-lexend block mb-2">
                    Please provide details about your adverse credit history:
                  </Label>
                  <Textarea
                    value={applicant.adverseCreditDetails || ''}
                    onChange={(e) => onUpdateApplicant(applicant.id, 'adverseCreditDetails', e.target.value)}
                    placeholder="Please describe your adverse credit history..."
                    className="min-h-[120px]"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {applicants.length < 5 && (
        <div className="text-center">
          <Button
            onClick={onAddApplicant}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Another Applicant
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoStep;
