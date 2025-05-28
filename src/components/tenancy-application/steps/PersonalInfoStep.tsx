
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";

interface PersonalInfoStepProps {
  applicants: Applicant[];
  onAddApplicant: () => void;
  onRemoveApplicant: (id: string) => void;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onFillAllTestData?: () => void;
  onApplicantCountChange: (count: number) => void;
}

const PersonalInfoStep = ({
  applicants,
  onAddApplicant,
  onRemoveApplicant,
  onUpdateApplicant,
  onFillAllTestData,
  onApplicantCountChange,
}: PersonalInfoStepProps) => {
  const fillTestData = () => {
    console.log('Fill test data button clicked - Personal Info');
    console.log('Current applicants:', applicants);
    
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

    // Fill data for existing applicants
    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        console.log(`Filling test data for applicant ${index + 1}:`, testData[index]);
        Object.entries(testData[index]).forEach(([field, value]) => {
          console.log(`Setting ${field} to ${value} for applicant ${applicant.id}`);
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
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
            {applicants.length} of 5 applicants
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button variant="default" size="sm" onClick={onFillAllTestData} className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>

      <ApplicantCountSelector
        applicantCount={applicants.length}
        onApplicantCountChange={onApplicantCountChange}
      />
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Applicant {index + 1}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`firstName-${applicant.id}`} className="form-label">First Name *</Label>
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  placeholder="First Name"
                  className="form-control"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`lastName-${applicant.id}`} className="form-label">Last Name *</Label>
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  placeholder="Last Name"
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`email-${applicant.id}`} className="form-label">Email *</Label>
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  placeholder="Email"
                  className="form-control"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`phone-${applicant.id}`} className="form-label">Phone *</Label>
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  placeholder="Phone"
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`dob-${applicant.id}`} className="form-label">Date of Birth</Label>
              <div className="date-input-container">
                <div className="date-input-icon">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  id={`dob-${applicant.id}`}
                  type="date"
                  value={applicant.dateOfBirth}
                  onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PersonalInfoStep;
