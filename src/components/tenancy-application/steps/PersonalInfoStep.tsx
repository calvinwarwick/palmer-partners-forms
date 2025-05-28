
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface PersonalInfoStepProps {
  applicants: Applicant[];
  onAddApplicant: () => void;
  onRemoveApplicant: (id: string) => void;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const PersonalInfoStep = ({
  applicants,
  onAddApplicant,
  onRemoveApplicant,
  onUpdateApplicant,
}: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <Badge variant="secondary">{applicants.length} of 5 applicants</Badge>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Applicant {index + 1}</CardTitle>
              {applicants.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveApplicant(applicant.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`firstName-${applicant.id}`}>First Name *</Label>
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`lastName-${applicant.id}`}>Last Name *</Label>
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`email-${applicant.id}`}>Email *</Label>
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`phone-${applicant.id}`}>Phone *</Label>
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`dob-${applicant.id}`}>Date of Birth</Label>
              <Input
                id={`dob-${applicant.id}`}
                type="date"
                value={applicant.dateOfBirth}
                onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {applicants.length < 5 && (
        <Button variant="outline" onClick={onAddApplicant} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Applicant
        </Button>
      )}
    </div>
  );
};

export default PersonalInfoStep;
