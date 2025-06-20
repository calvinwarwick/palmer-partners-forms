
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Applicant } from "@/domain/types/Applicant";

interface EmploymentFieldsProps {
  applicant: Applicant;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time Employment" },
  { value: "part-time", label: "Part-time Employment" },
  { value: "self-employed", label: "Self-employed" },
  { value: "contract", label: "Contract Work" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" }
];

const LENGTH_OF_SERVICE_OPTIONS = [
  { value: "not-started", label: "Not started yet" },
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-year", label: "1 year" },
  { value: "2-years", label: "2 years" },
  { value: "3-years", label: "3 years" },
  { value: "4-years", label: "4 years" },
  { value: "5-years", label: "5 years" },
  { value: "6-years", label: "6 years" },
  { value: "7-years", label: "7 years" },
  { value: "8-years", label: "8 years" },
  { value: "9-years", label: "9 years" },
  { value: "10-plus", label: "10+ years" }
];

const EmploymentFields = ({ applicant, onUpdateApplicant }: EmploymentFieldsProps) => {
  // Check if employment status is valid (not unemployed, student, retired, or empty)
  const isValidEmploymentStatus = applicant.employmentStatus && 
    !['unemployed', 'student', 'retired', ''].includes(applicant.employmentStatus);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <FormField
          label="Employment Status"
          required
          htmlFor={`employmentStatus-${applicant.id}`}
        >
          <Select
            value={applicant.employmentStatus}
            onValueChange={(value) => onUpdateApplicant(applicant.id, 'employmentStatus', value)}
          >
            <SelectTrigger id={`employmentStatus-${applicant.id}`}>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {isValidEmploymentStatus && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <FormField
              label="Company Name"
              htmlFor={`employer-${applicant.id}`}
            >
              <Input
                id={`employer-${applicant.id}`}
                value={applicant.employer || ''}
                onChange={(e) => onUpdateApplicant(applicant.id, 'employer', e.target.value)}
                placeholder="Enter company name"
              />
            </FormField>

            <FormField
              label="Job Title"
              htmlFor={`jobTitle-${applicant.id}`}
            >
              <Input
                id={`jobTitle-${applicant.id}`}
                value={applicant.jobTitle || ''}
                onChange={(e) => onUpdateApplicant(applicant.id, 'jobTitle', e.target.value)}
                placeholder="Enter job title"
              />
            </FormField>

            <FormField
              label={
                <div className="flex items-center gap-2">
                  <span>Annual Salary (£)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This should be your basic salary excluding bonuses, commission, overtime etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              }
              htmlFor={`annualIncome-${applicant.id}`}
            >
              <div className="currency-input-container">
                <span className="currency-input-icon text-orange-500">£</span>
                <Input
                  id={`annualIncome-${applicant.id}`}
                  type="number"
                  value={applicant.annualIncome || ''}
                  onChange={(e) => onUpdateApplicant(applicant.id, 'annualIncome', e.target.value)}
                  placeholder="Enter annual salary"
                  className="currency-input border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                />
              </div>
            </FormField>

            <FormField
              label="Length of Service"
              htmlFor={`lengthOfService-${applicant.id}`}
            >
              <Select
                value={applicant.lengthOfService || ''}
                onValueChange={(value) => onUpdateApplicant(applicant.id, 'lengthOfService', value)}
              >
                <SelectTrigger id={`lengthOfService-${applicant.id}`}>
                  <SelectValue placeholder="Select length of service" />
                </SelectTrigger>
                <SelectContent>
                  {LENGTH_OF_SERVICE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EmploymentFields;
