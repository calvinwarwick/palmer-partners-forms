
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Calendar } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";

interface EmploymentStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const EmploymentStep = ({ applicants, onUpdateApplicant }: EmploymentStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Employment Information</h3>
        <p className="text-light-grey mb-4">Tell us about your employment situation</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              Applicant {index + 1}
              {applicant.firstName && applicant.lastName && (
                <span className="text-white font-normal">
                  - {applicant.firstName} {applicant.lastName}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
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

            {/* Employment Details for Full Time, Part Time, Zero Hours, and Self Employed */}
            {(applicant.employmentStatus === "full-time" || 
              applicant.employmentStatus === "part-time" || 
              applicant.employmentStatus === "zero-hours" || 
              applicant.employmentStatus === "self-employed") && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`companyName-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Company Name <span className="text-red-500">*</span>
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`jobTitle-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Job Title <span className="text-red-500">*</span>
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
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFieldWithTooltip
                    label="Annual Salary (£)"
                    tooltip="This should be your basic salary excluding bonuses, commission, overtime etc."
                    required
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
                        required
                      />
                    </div>
                  </FormFieldWithTooltip>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`lengthOfService-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Length of Service <span className="text-red-500">*</span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentStep;
