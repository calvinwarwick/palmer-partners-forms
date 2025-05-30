
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, User, Plus, Trash2, Users, ShieldCheck } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "@/components/tenancy-application/steps/ApplicantCountSelector";

interface PersonalInfoStepProps {
  applicants: Applicant[];
  onAddApplicant: () => void;
  onRemoveApplicant: (id: string) => void;
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onApplicantCountChange: (count: number) => void;
  onGuarantorOpen: (applicant: Applicant) => void;
}

const PersonalInfoStep = ({ 
  applicants, 
  onAddApplicant, 
  onRemoveApplicant, 
  onUpdateApplicant, 
  onApplicantCountChange,
  onGuarantorOpen
}: PersonalInfoStepProps) => {

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <p className="text-light-grey mb-4">Please provide details for all applicants</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <ApplicantCountSelector 
        count={applicants.length} 
        onCountChange={onApplicantCountChange} 
      />

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border border-gray-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Applicant {index + 1}
                {applicant.firstName && applicant.lastName && (
                  <span className="text-white font-normal">
                    - {applicant.firstName} {applicant.lastName}
                  </span>
                )}
              </div>
              {applicants.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveApplicant(applicant.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* First Name, Last Name, DOB Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="form-field">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  First Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div className="form-field">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Last Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div className="form-field">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Date of Birth <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="date-input-container">
                  <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                  <Input
                    type="date"
                    value={applicant.dateOfBirth}
                    onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Email <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  placeholder="Enter email address"
                  className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>

              <div className="form-field">
                <Label className="text-sm font-medium text-dark-grey mb-2 block flex items-center">
                  Phone Number <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>
            </div>

            {/* UK Passport */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-dark-grey flex items-center">
                  Do you have a UK passport? <span className="text-red-500 ml-1">*</span>
                </Label>
                <Switch
                  checked={applicant.ukPassport === "yes"}
                  onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "ukPassport", checked ? "yes" : "no")}
                />
              </div>
            </div>

            {/* Adverse Credit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-dark-grey flex items-center">
                  Do you have any adverse credit history? <span className="text-red-500 ml-1">*</span>
                </Label>
                <Switch
                  checked={applicant.adverseCredit === "yes"}
                  onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "adverseCredit", checked ? "yes" : "no")}
                />
              </div>
              
              {/* Adverse Credit Details - Show directly underneath */}
              {applicant.adverseCredit === "yes" && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Please provide details about your adverse credit history:
                  </Label>
                  <Textarea
                    value={applicant.adverseCreditDetails}
                    onChange={(e) => onUpdateApplicant(applicant.id, "adverseCreditDetails", e.target.value)}
                    placeholder="Please provide details about adverse credit history..."
                    className="min-h-[120px] bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
              )}
            </div>

            {/* Guarantor Required */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-dark-grey flex items-center">
                  Will you require a guarantor? <span className="text-red-500 ml-1">*</span>
                </Label>
                <Switch
                  checked={applicant.guarantorRequired === "yes"}
                  onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "guarantorRequired", checked ? "yes" : "no")}
                />
              </div>

              {applicant.guarantorRequired === "yes" && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Guarantor Details Required</span>
                  </div>
                  <p className="text-sm text-orange-700 mb-3">
                    You'll need to provide guarantor information. Click the button below to add guarantor details.
                  </p>
                  <Button
                    type="button"
                    onClick={() => onGuarantorOpen(applicant)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Guarantor Details
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {applicants.length < 5 && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Another Applicant</h3>
            <p className="text-gray-500 mb-4">Add additional applicants to this tenancy application (max 5 total)</p>
            <Button
              onClick={onAddApplicant}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Applicant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalInfoStep;
