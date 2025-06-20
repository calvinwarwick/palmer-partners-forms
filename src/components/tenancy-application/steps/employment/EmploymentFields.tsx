
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

const EmploymentFields = ({ applicant, onUpdateApplicant }: EmploymentFieldsProps) => {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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

        <FormField
          label="Employer Name"
          required
          htmlFor={`employer-${applicant.id}`}
        >
          <Input
            id={`employer-${applicant.id}`}
            value={applicant.employer}
            onChange={(e) => onUpdateApplicant(applicant.id, 'employer', e.target.value)}
            placeholder="Enter employer name"
          />
        </FormField>

        <FormField
          label="Job Title"
          required
          htmlFor={`jobTitle-${applicant.id}`}
        >
          <Input
            id={`jobTitle-${applicant.id}`}
            value={applicant.jobTitle}
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
          required
          htmlFor={`annualIncome-${applicant.id}`}
        >
          <div className="currency-input-container">
            <span className="currency-input-icon text-orange-500">£</span>
            <Input
              id={`annualIncome-${applicant.id}`}
              type="number"
              value={applicant.annualIncome}
              onChange={(e) => onUpdateApplicant(applicant.id, 'annualIncome', e.target.value)}
              placeholder="e.g., 45000"
              className="currency-input border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
            />
          </div>
        </FormField>

        <FormField
          label="Work Phone"
          htmlFor={`phone-${applicant.id}`}
        >
          <Input
            id={`phone-${applicant.id}`}
            type="tel"
            value={applicant.phone}
            onChange={(e) => onUpdateApplicant(applicant.id, 'phone', e.target.value)}
            placeholder="Enter work phone number"
          />
        </FormField>

        <FormField
          label="Work Email"
          htmlFor={`email-${applicant.id}`}
        >
          <Input
            id={`email-${applicant.id}`}
            type="email"
            value={applicant.email}
            onChange={(e) => onUpdateApplicant(applicant.id, 'email', e.target.value)}
            placeholder="Enter work email address"
          />
        </FormField>
      </div>
    </TooltipProvider>
  );
};

export default EmploymentFields;
