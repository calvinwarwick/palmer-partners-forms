
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onFillAllTestData?: () => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant, onFillAllTestData }: EmploymentStepProps) => {
  const fillTestData = () => {
    console.log('Fill test data button clicked - Employment');
    console.log('Current applicants for employment:', applicants);
    
    const testData = [
      {
        employment: "Full Time",
        companyName: "Tech Solutions Ltd",
        jobTitle: "Software Engineer",
        annualIncome: "45000",
        lengthOfService: "3 years",
        reference1Name: "Mike Johnson",
        reference1Contact: "mike.johnson@techsolutions.com"
      },
      {
        employment: "Full Time",
        companyName: "Design Studio",
        jobTitle: "Graphic Designer",
        annualIncome: "38000",
        lengthOfService: "2 years",
        reference1Name: "Lisa Brown",
        reference1Contact: "lisa.brown@designstudio.com"
      }
    ];

    console.log('Filling employment test data for', applicants.length, 'applicants');
    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        console.log(`Filling employment data for applicant ${index + 1}:`, testData[index]);
        Object.entries(testData[index]).forEach(([field, value]) => {
          console.log(`Setting employment ${field} to ${value} for applicant ${applicant.id}`);
          onUpdateApplicant(applicant.id, field as keyof Applicant, value);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Employment Details</h3>
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
      
      {applicants.map((applicant) => (
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              {applicant.firstName} {applicant.lastName} - Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`employment-${applicant.id}`} className="form-label">Contract type *</Label>
                <select
                  id={`employment-${applicant.id}`}
                  value={applicant.employment}
                  onChange={(e) => onUpdateApplicant(applicant.id, "employment", e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Contract">Contract</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor={`company-${applicant.id}`} className="form-label">Company name</Label>
                <Input
                  id={`company-${applicant.id}`}
                  value={applicant.companyName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                  placeholder="Enter company name"
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`jobTitle-${applicant.id}`} className="form-label">Job title</Label>
                <Input
                  id={`jobTitle-${applicant.id}`}
                  value={applicant.jobTitle}
                  onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                  placeholder="Enter job title"
                  className="form-control"
                />
              </div>
              
              <div>
                <Label htmlFor={`income-${applicant.id}`} className="form-label">Annual salary (£) *</Label>
                <Input
                  id={`income-${applicant.id}`}
                  type="number"
                  value={applicant.annualIncome}
                  onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                  placeholder="e.g., 35000"
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`lengthOfService-${applicant.id}`} className="form-label">Length of service</Label>
              <Input
                id={`lengthOfService-${applicant.id}`}
                value={applicant.lengthOfService}
                onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                placeholder="e.g., 2 years"
                className="form-control"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`ref1Name-${applicant.id}`} className="form-label">Reference 1 Name</Label>
                <Input
                  id={`ref1Name-${applicant.id}`}
                  value={applicant.reference1Name}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Name", e.target.value)}
                  placeholder="Reference name"
                  className="form-control"
                />
              </div>
              <div>
                <Label htmlFor={`ref1Contact-${applicant.id}`} className="form-label">Reference 1 Contact</Label>
                <Input
                  id={`ref1Contact-${applicant.id}`}
                  value={applicant.reference1Contact}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Contact", e.target.value)}
                  placeholder="Email or phone"
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

export default EmploymentStep;
