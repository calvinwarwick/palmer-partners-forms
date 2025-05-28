
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              {applicant.firstName} {applicant.lastName} - Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="form-floating">
              <select
                id={`employment-${applicant.id}`}
                value={applicant.employment}
                onChange={(e) => onUpdateApplicant(applicant.id, "employment", e.target.value)}
                className="form-select w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
              <label htmlFor={`employment-${applicant.id}`} className="text-muted-foreground">Contract type *</label>
            </div>
            
            <div className="form-floating">
              <Input
                id={`company-${applicant.id}`}
                value={applicant.companyName}
                onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                placeholder="Enter company name"
                className="form-control"
              />
              <label htmlFor={`company-${applicant.id}`} className="text-muted-foreground">Company name</label>
            </div>
            
            <div className="form-floating">
              <Input
                id={`jobTitle-${applicant.id}`}
                value={applicant.jobTitle}
                onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                placeholder="Enter job title"
                className="form-control"
              />
              <label htmlFor={`jobTitle-${applicant.id}`} className="text-muted-foreground">Job title</label>
            </div>
            
            <div className="form-floating">
              <Input
                id={`income-${applicant.id}`}
                type="number"
                value={applicant.annualIncome}
                onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                placeholder="e.g., 35000"
                className="form-control"
                required
              />
              <label htmlFor={`income-${applicant.id}`} className="text-muted-foreground">Annual salary (£) *</label>
            </div>
            
            <div className="form-floating">
              <Input
                id={`lengthOfService-${applicant.id}`}
                value={applicant.lengthOfService}
                onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                placeholder="e.g., 2 years"
                className="form-control"
              />
              <label htmlFor={`lengthOfService-${applicant.id}`} className="text-muted-foreground">Length of service</label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-floating">
                <Input
                  id={`ref1Name-${applicant.id}`}
                  value={applicant.reference1Name}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Name", e.target.value)}
                  placeholder="Reference name"
                  className="form-control"
                />
                <label htmlFor={`ref1Name-${applicant.id}`} className="text-muted-foreground">Reference 1 Name</label>
              </div>
              <div className="form-floating">
                <Input
                  id={`ref1Contact-${applicant.id}`}
                  value={applicant.reference1Contact}
                  onChange={(e) => onUpdateApplicant(applicant.id, "reference1Contact", e.target.value)}
                  placeholder="Email or phone"
                  className="form-control"
                />
                <label htmlFor={`ref1Contact-${applicant.id}`} className="text-muted-foreground">Reference 1 Contact</label>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentStep;
