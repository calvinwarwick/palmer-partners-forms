
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Calendar, Shield, CheckCircle } from "lucide-react";
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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <p className="text-light-grey mb-4 text-sm sm:text-base">Tell us about the people who will be living in the property</p>
        <div className="border-b border-gray-200 mb-4 sm:mb-6"></div>
      </div>

      <ApplicantCountSelector
        applicantCount={applicants.length}
        onApplicantCountChange={onApplicantCountChange}
      />
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 sm:gap-3 text-white">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-sm sm:text-base">Applicant {index + 1}</span>
                {applicant.firstName && applicant.lastName && (
                  <span className="text-white font-normal text-sm sm:text-base">
                    - {applicant.firstName} {applicant.lastName}
                  </span>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* First Name, Last Name, and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mobile-form-grid">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id={`firstName-${applicant.id}`}
                  value={applicant.firstName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lastName-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id={`lastName-${applicant.id}`}
                  value={applicant.lastName}
                  onChange={(e) => onUpdateApplicant(applicant.id, "lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`dob-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">Date of Birth <span className="text-red-500">*</span></Label>
                <div className="date-input-container">
                  <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                  <Input
                    id={`dob-${applicant.id}`}
                    type="date"
                    value={applicant.dateOfBirth}
                    onChange={(e) => onUpdateApplicant(applicant.id, "dateOfBirth", e.target.value)}
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mobile-form-grid">
              <div className="space-y-2">
                <Label htmlFor={`email-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id={`email-${applicant.id}`}
                  type="email"
                  value={applicant.email}
                  onChange={(e) => onUpdateApplicant(applicant.id, "email", e.target.value)}
                  placeholder="Enter email address"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id={`phone-${applicant.id}`}
                  type="tel"
                  value={applicant.phone}
                  onChange={(e) => onUpdateApplicant(applicant.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={applicant.ukPassport === "yes"}
                      onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "ukPassport", checked ? "yes" : "no")}
                      className="mobile-checkbox"
                    />
                    <Label 
                      className="form-label text-gray-700 font-medium cursor-pointer text-sm sm:text-base"
                      onClick={() => onUpdateApplicant(applicant.id, "ukPassport", applicant.ukPassport === "yes" ? "no" : "yes")}
                    >
                      Do you hold a UK or Republic of Ireland passport?
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={applicant.adverseCredit === "yes"}
                        onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "adverseCredit", checked ? "yes" : "no")}
                        className="mobile-checkbox"
                      />
                      <div className="flex-1">
                        <Label 
                          className="form-label text-gray-700 font-medium cursor-pointer text-sm sm:text-base"
                          onClick={() => onUpdateApplicant(applicant.id, "adverseCredit", applicant.adverseCredit === "yes" ? "no" : "yes")}
                        >
                          Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy?
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  {applicant.adverseCredit === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor={`adverseCreditDetails-${applicant.id}`} className="form-label text-gray-700 font-medium text-sm sm:text-base">
                        Please provide details about your adverse credit history:
                      </Label>
                      <Textarea
                        id={`adverseCreditDetails-${applicant.id}`}
                        value={applicant.adverseCreditDetails || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "adverseCreditDetails", e.target.value)}
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px] sm:min-h-[160px] text-sm sm:text-base"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={applicant.guarantorRequired === "yes"}
                        onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "guarantorRequired", checked ? "yes" : "no")}
                        className="mobile-checkbox"
                      />
                      <div className="flex-1">
                        <Label 
                          className="form-label text-gray-700 font-medium cursor-pointer text-sm sm:text-base"
                          onClick={() => onUpdateApplicant(applicant.id, "guarantorRequired", applicant.guarantorRequired === "yes" ? "no" : "yes")}
                        >
                          If required, can you supply a guarantor for this proposed tenancy?
                        </Label>
                      </div>
                    </div>
                  </div>
                  {applicant.guarantorRequired === "yes" && (
                    <div className="mt-2">
                      {applicant.guarantorAdded ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                              <div>
                                <p className="text-green-800 font-medium text-sm sm:text-base">Guarantor Added</p>
                                <p className="text-green-600 text-xs sm:text-sm">
                                  {applicant.guarantorName ? `${applicant.guarantorName} - ${applicant.guarantorRelationship}` : "Guarantor information saved"}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onGuarantorOpen(applicant)}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50 text-xs sm:text-sm"
                              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGuarantorOpen(applicant)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50 text-sm sm:text-base"
                          style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Add Guarantor (Optional)
                        </Button>
                      )}
                    </div>
                  )}
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
