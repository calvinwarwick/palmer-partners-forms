
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Briefcase, Building, Calendar, PoundSterling } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

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
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Details for Employed/Self-employed */}
            {(applicant.employmentStatus === "employed" || applicant.employmentStatus === "self-employed") && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`companyName-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="employer-container">
                      <Building className="employer-icon h-4 w-4 text-orange-500" />
                      <Input
                        id={`companyName-${applicant.id}`}
                        value={applicant.companyName || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "companyName", e.target.value)}
                        placeholder="Enter company name"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`jobTitle-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <div className="job-title-container">
                      <Briefcase className="job-title-icon h-4 w-4 text-orange-500" />
                      <Input
                        id={`jobTitle-${applicant.id}`}
                        value={applicant.jobTitle || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "jobTitle", e.target.value)}
                        placeholder="Enter job title"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`annualIncome-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Annual Salary (£) <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">This should be your basic salary excluding bonuses, commission, overtime etc.</p>
                    <div className="income-container">
                      <PoundSterling className="income-icon h-4 w-4 text-orange-500" />
                      <Input
                        id={`annualIncome-${applicant.id}`}
                        type="number"
                        value={applicant.annualIncome || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "annualIncome", e.target.value)}
                        placeholder="Enter annual salary"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lengthOfService-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Length of Service <span className="text-red-500">*</span>
                    </Label>
                    <div className="service-length-container">
                      <Calendar className="service-length-icon h-4 w-4 text-orange-500" />
                      <Input
                        id={`lengthOfService-${applicant.id}`}
                        value={applicant.lengthOfService || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "lengthOfService", e.target.value)}
                        placeholder="e.g. 2 years 3 months"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`employmentStartDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Employment Start Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="date-input-container">
                    <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                    <Input
                      id={`employmentStartDate-${applicant.id}`}
                      type="date"
                      value={applicant.employmentStartDate || ""}
                      onChange={(e) => onUpdateApplicant(applicant.id, "employmentStartDate", e.target.value)}
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Contract Type for Employed */}
            {applicant.employmentStatus === "employed" && (
              <div className="space-y-2">
                <Label htmlFor={`contractType-${applicant.id}`} className="form-label text-gray-700 font-medium">
                  Contract Type <span className="text-red-500">*</span>
                </Label>
                <Select value={applicant.contractType} onValueChange={(value) => onUpdateApplicant(applicant.id, "contractType", value)}>
                  <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="fixed-term">Fixed Term</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="zero-hours">Zero Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Additional Employment Questions */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-dark-grey mb-4">Additional Employment Details</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={applicant.probationPeriod === "yes"}
                      onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "probationPeriod", checked ? "yes" : "no")}
                    />
                    <Label 
                      className="form-label text-gray-700 font-medium cursor-pointer"
                      onClick={() => onUpdateApplicant(applicant.id, "probationPeriod", applicant.probationPeriod === "yes" ? "no" : "yes")}
                    >
                      Are you currently in a probation period? <span className="text-red-500">*</span>
                    </Label>
                  </div>
                </div>

                {applicant.probationPeriod === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor={`probationEndDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Probation End Date:
                    </Label>
                    <Input
                      id={`probationEndDate-${applicant.id}`}
                      type="date"
                      value={applicant.probationEndDate || ""}
                      onChange={(e) => onUpdateApplicant(applicant.id, "probationEndDate", e.target.value)}
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentStep;
