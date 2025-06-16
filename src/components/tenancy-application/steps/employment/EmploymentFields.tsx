
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Applicant } from "@/domain/types/Applicant";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";
import { Info } from "lucide-react";

interface EmploymentFieldsProps {
  applicant: Applicant;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EmploymentFields = ({ applicant, onUpdateApplicant }: EmploymentFieldsProps) => {
  return (
    <>
      {/* Employment Status */}
      <div className="space-y-2">
        <Label htmlFor={`employmentStatus-${applicant.id}`} className="form-label text-gray-700 font-medium">
          Employment Status <span className="text-red-500">*</span>
        </Label>
        <Select value={applicant.employmentStatus} onValueChange={(value) => onUpdateApplicant(applicant.id, "employmentStatus", value)}>
          <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <SelectValue placeholder="Select employment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="zero-hours">Zero Hours</SelectItem>
            <SelectItem value="self-employed">Self Employed</SelectItem>
            <SelectItem value="unemployed">Unemployed</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Self-Employment Information Message */}
      {applicant.employmentStatus === "self-employed" && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <h4 className="font-semibold mb-2">Self-Employment Information</h4>
              <p className="mb-3">
                We note you have stated that you are self-employed. To ensure you have the best chance of successfully completing the referencing procedure, please note the following:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You must have been self-employed for at least 2 years and be able to supply at least one completed HMRC Tax Return or SA302. Alternatively, proof of earnings via a Chartered Accountant may be sufficient.</li>
                <li>Any salary figures you provide must be your salary and not figures based on the turnover of a business.</li>
                <li>Any salary figures that you supply must be what you take as "salary" and must not include any dividends that you receive.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Employment Details for Full Time, Part Time, Zero Hours, and Self Employed */}
      {(applicant.employmentStatus === "full-time" || 
        applicant.employmentStatus === "part-time" || 
        applicant.employmentStatus === "zero-hours" || 
        applicant.employmentStatus === "self-employed") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`companyName-${applicant.id}`} className="form-label text-gray-700 font-medium">
                Company Name
              </Label>
              <Input
                id={`companyName-${applicant.id}`}
                value={applicant.companyName || ""}
                onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                placeholder="Enter company name"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                style={{ 
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`jobTitle-${applicant.id}`} className="form-label text-gray-700 font-medium">
                Job Title
              </Label>
              <Input
                id={`jobTitle-${applicant.id}`}
                value={applicant.jobTitle || ""}
                onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                placeholder="Enter job title"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                style={{ 
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWithTooltip
              label="Annual Salary (£)"
              tooltip="This should be your basic salary excluding bonuses, commission, overtime etc."
              htmlFor={`annualIncome-${applicant.id}`}
            >
              <div className="currency-input-container">
                <span className="currency-input-icon">£</span>
                <Input
                  id={`annualIncome-${applicant.id}`}
                  type="number"
                  value={applicant.annualIncome || ""}
                  onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                  placeholder="Enter annual salary"
                  className="currency-input form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  style={{ 
                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
                  }}
                />
              </div>
            </FormFieldWithTooltip>
            
            <div className="space-y-2">
              <Label htmlFor={`lengthOfService-${applicant.id}`} className="form-label text-gray-700 font-medium">
                Length of Service
              </Label>
              <Select value={applicant.lengthOfService} onValueChange={(value) => onUpdateApplicant(applicant.id, "lengthOfService", value)}>
                <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not started yet</SelectItem>
                  <SelectItem value="less-than-1-year">Less than 1 year</SelectItem>
                  <SelectItem value="1-year">1 year</SelectItem>
                  <SelectItem value="2-years">2 years</SelectItem>
                  <SelectItem value="3-years">3 years</SelectItem>
                  <SelectItem value="4-years">4 years</SelectItem>
                  <SelectItem value="5-years">5 years</SelectItem>
                  <SelectItem value="6-years">6 years</SelectItem>
                  <SelectItem value="7-years">7 years</SelectItem>
                  <SelectItem value="8-years">8 years</SelectItem>
                  <SelectItem value="9-years">9 years</SelectItem>
                  <SelectItem value="10-plus-years">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmploymentFields;
