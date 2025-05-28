
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, TestTube } from "lucide-react";
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
  const fillTestData = () => {
    const testData = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "07700 900123",
        dateOfBirth: "1990-05-15"
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "07700 900456",
        dateOfBirth: "1988-11-22"
      }
    ];

    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        Object.entries(testData[index]).forEach(([field, value]) => {
          onUpdateApplicant(applicant.id, field as keyof Applicant, value);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Badge variant="secondary">{applicants.length} of 5 applicants</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Applicant {index + 1}</CardTitle>
              {applicants.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveApplicant(applicant.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-floating">
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  placeholder="First Name"
                  className="form-control"
                  required
                />
                <label htmlFor={`firstName-${applicant.id}`} className="text-muted-foreground">First Name *</label>
              </div>
              <div className="form-floating">
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  placeholder="Last Name"
                  className="form-control"
                  required
                />
                <label htmlFor={`lastName-${applicant.id}`} className="text-muted-foreground">Last Name *</label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-floating">
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  placeholder="Email"
                  className="form-control"
                  required
                />
                <label htmlFor={`email-${applicant.id}`} className="text-muted-foreground">Email *</label>
              </div>
              <div className="form-floating">
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  placeholder="Phone"
                  className="form-control"
                  required
                />
                <label htmlFor={`phone-${applicant.id}`} className="text-muted-foreground">Phone *</label>
              </div>
            </div>
            <div className="form-floating">
              <Input
                id={`dob-${applicant.id}`}
                type="date"
                value={applicant.dateOfBirth}
                onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                className="form-control"
              />
              <label htmlFor={`dob-${applicant.id}`} className="text-muted-foreground">Date of Birth</label>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {applicants.length < 5 && (
        <Button variant="outline" onClick={onAddApplicant} className="w-full border-dashed border-2 hover:bg-muted">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Applicant
        </Button>
      )}
    </div>
  );
};

export default PersonalInfoStep;
