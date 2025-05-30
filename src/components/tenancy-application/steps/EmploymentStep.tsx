
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant }: EmploymentStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-grey mb-2">Employment Information</h2>
        <p className="text-light-grey">Please provide employment details for all applicants</p>
      </div>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-6">
              <h3 className="font-semibold text-white">Applicant {index + 1}: {applicant.firstName} {applicant.lastName}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employment Status */}
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Employment Status <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={applicant.employment} onValueChange={(value) => onUpdateApplicant(applicant.id, "employment", value)}>
                  <SelectTrigger id={`employment-${applicant.id}`} className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time Employment</SelectItem>
                    <SelectItem value="Part Time">Part Time Employment</SelectItem>
                    <SelectItem value="Self Employed">Self Employed</SelectItem>
                    <SelectItem value="Contract">Contract Work</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Self Employment Alert */}
              {applicant.employment === "Self Employed" && (
                <div className="md:col-span-2">
                  <Alert className="bg-light-grey/10 border-light-grey/20">
                    <AlertTriangle className="h-4 w-4 text-light-grey" />
                    <AlertDescription className="text-black">
                      <span className="font-medium text-black">Self-employed applicants:</span>
                      <span className="text-light-grey"> You may be required to provide additional documentation such as SA302 forms, accountant references, or bank statements.</span>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Company Name */}
              {applicant.employment !== "Unemployed" && applicant.employment !== "Retired" && applicant.employment !== "Student" && (
                <div>
                  <Label htmlFor={`companyName-${applicant.id}`} className="text-sm font-medium text-dark-grey mb-2 block">
                    Company/Organisation Name
                  </Label>
                  <Input
                    id={`companyName-${applicant.id}`}
                    value={applicant.companyName}
                    onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                    placeholder="Enter company name"
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Job Title */}
              {applicant.employment !== "Unemployed" && applicant.employment !== "Retired" && applicant.employment !== "Student" && (
                <div>
                  <Label htmlFor={`jobTitle-${applicant.id}`} className="text-sm font-medium text-dark-grey mb-2 block">
                    Job Title/Position
                  </Label>
                  <Input
                    id={`jobTitle-${applicant.id}`}
                    value={applicant.jobTitle}
                    onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                    placeholder="Enter job title"
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Annual Income */}
              <div>
                <Label htmlFor={`annualIncome-${applicant.id}`} className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Annual Income <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 font-medium">£</span>
                  <Input
                    id={`annualIncome-${applicant.id}`}
                    type="number"
                    value={applicant.annualIncome}
                    onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                    placeholder="e.g., 35000"
                    className="pl-8 bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Length of Service */}
              {applicant.employment !== "Unemployed" && applicant.employment !== "Retired" && applicant.employment !== "Student" && (
                <div>
                  <Label htmlFor={`lengthOfService-${applicant.id}`} className="text-sm font-medium text-dark-grey mb-2 block">
                    Length of Service
                  </Label>
                  <Input
                    id={`lengthOfService-${applicant.id}`}
                    value={applicant.lengthOfService}
                    onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                    placeholder="e.g., 2 years 6 months"
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentStep;
