
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Calendar, Shield, Info } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import ApplicantCountSelector from "./ApplicantCountSelector";
import { Switch } from "@/components/ui/switch";

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
  onGuarantorOpen,
}: PersonalInfoStepProps) => {

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <p className="text-light-grey mb-4">Tell us about the people who will be living in the property</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <ApplicantCountSelector
        applicantCount={applicants.length}
        onApplicantCountChange={onApplicantCountChange}
      />
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
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
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${applicant.id}`} className="form-label text-gray-700 font-medium">First Name *</Label>
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lastName-${applicant.id}`} className="form-label text-gray-700 font-medium">Last Name *</Label>
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`email-${applicant.id}`} className="form-label text-gray-700 font-medium">Email Address *</Label>
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  placeholder="Enter email address"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${applicant.id}`} className="form-label text-gray-700 font-medium">Phone Number *</Label>
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`dob-${applicant.id}`} className="form-label text-gray-700 font-medium">Date of Birth</Label>
              <div className="date-input-container">
                <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                <Input
                  id={`dob-${applicant.id}`}
                  type="date"
                  value={applicant.dateOfBirth}
                  onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-dark-grey mb-4">Additional Details</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="form-label text-gray-700 font-medium">
                      Do you hold a UK or Republic of Ireland passport? *
                    </Label>
                  </div>
                  <Switch
                    checked={applicant.ukPassport === "yes"}
                    onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "ukPassport", checked ? "yes" : "no")}
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="form-label text-gray-700 font-medium">
                      Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy? *
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={applicant.adverseCredit === "yes"}
                      onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "adverseCredit", checked ? "yes" : "no")}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="form-label text-gray-700 font-medium">
                      If required, can you supply a guarantor for this proposed tenancy? *
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={applicant.guarantorRequired === "yes"}
                      onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "guarantorRequired", checked ? "yes" : "no")}
                    />
                    {applicant.guarantorRequired === "yes" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGuarantorOpen(applicant)}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Add Guarantor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PersonalInfoStep;
