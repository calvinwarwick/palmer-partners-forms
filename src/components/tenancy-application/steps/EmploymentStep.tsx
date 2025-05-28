
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Applicant } from "@/domain/types/Applicant";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant }: EmploymentStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Employment Details</h3>
      
      {applicants.map((applicant) => (
        <Card key={applicant.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {applicant.firstName} {applicant.lastName} - Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`employment-${applicant.id}`}>Contract type *</Label>
              <select
                id={`employment-${applicant.id}`}
                value={applicant.employment}
                onChange={(e) => onUpdateApplicant(applicant.id, "employment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <Label htmlFor={`company-${applicant.id}`}>Company name</Label>
              <Input
                id={`company-${applicant.id}`}
                value={applicant.companyName}
                onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <Label htmlFor={`jobTitle-${applicant.id}`}>Job title</Label>
              <Input
                id={`jobTitle-${applicant.id}`}
                value={applicant.jobTitle}
                onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                placeholder="Enter job title"
              />
            </div>
            
            <div>
              <Label htmlFor={`income-${applicant.id}`}>Annual salary (£) *</Label>
              <Input
                id={`income-${applicant.id}`}
                type="number"
                value={applicant.annualIncome}
                onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                placeholder="e.g., 35000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`lengthOfService-${applicant.id}`}>Length of service</Label>
              <Input
                id={`lengthOfService-${applicant.id}`}
                value={applicant.lengthOfService}
                onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                placeholder="e.g., 2 years"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`ref1Name-${applicant.id}`}>Reference 1 Name</Label>
                <Input
                  id={`ref1Name-${applicant.id}`}
                  value={applicant.reference1Name}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Name", e.target.value)}
                  placeholder="Reference name"
                />
              </div>
              <div>
                <Label htmlFor={`ref1Contact-${applicant.id}`}>Reference 1 Contact</Label>
                <Input
                  id={`ref1Contact-${applicant.id}`}
                  value={applicant.reference1Contact}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Contact", e.target.value)}
                  placeholder="Email or phone"
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
