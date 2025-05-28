
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
      <h3 className="text-lg font-semibold">Employment & Financial Information</h3>
      
      {applicants.map((applicant) => (
        <Card key={applicant.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {applicant.firstName} {applicant.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`employment-${applicant.id}`}>Employment Status *</Label>
              <select
                id={`employment-${applicant.id}`}
                value={applicant.employment}
                onChange={(e) => onUpdateApplicant(applicant.id, "employment", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select employment status</option>
                <option value="employed">Employed Full-time</option>
                <option value="part-time">Employed Part-time</option>
                <option value="self-employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <Label htmlFor={`income-${applicant.id}`}>Annual Income (£) *</Label>
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
              <Label htmlFor={`prevAddress-${applicant.id}`}>Previous Address</Label>
              <Input
                id={`prevAddress-${applicant.id}`}
                value={applicant.previousAddress}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                placeholder="Full previous address"
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
