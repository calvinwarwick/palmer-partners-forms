
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, MapPin, Calendar, Home, Phone } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant }: CurrentAddressStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Current Address Information</h3>
        <p className="text-light-grey mb-4">Tell us about your current living situation</p>
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
            {/* Current Address */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-dark-grey mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Current Address
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`currentAddress-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Current Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`currentAddress-${applicant.id}`}
                    value={applicant.currentAddress || ""}
                    onChange={(e) => onUpdateApplicant(applicant.id, "currentAddress", e.target.value)}
                    placeholder="Enter your current address"
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`currentPostcode-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Postcode <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`currentPostcode-${applicant.id}`}
                    value={applicant.currentPostcode || ""}
                    onChange={(e) => onUpdateApplicant(applicant.id, "currentPostcode", e.target.value)}
                    placeholder="Enter postcode"
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`residencyStatus-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Residency Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={applicant.residencyStatus} onValueChange={(value) => onUpdateApplicant(applicant.id, "residencyStatus", value)}>
                    <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                      <SelectValue placeholder="Select residency status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="living-with-parents">Living with Parents</SelectItem>
                      <SelectItem value="living-with-family">Living with Family</SelectItem>
                      <SelectItem value="lodger">Lodger</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`timeAtAddress-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Time at Current Address <span className="text-red-500">*</span>
                  </Label>
                  <Select value={applicant.timeAtAddress} onValueChange={(value) => onUpdateApplicant(applicant.id, "timeAtAddress", value)}>
                    <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                      <SelectValue placeholder="Select time at address" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                      <SelectItem value="6-12-months">6-12 months</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="2-5-years">2-5 years</SelectItem>
                      <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Landlord/Reference Details */}
            {(applicant.residencyStatus === "tenant" || applicant.residencyStatus === "lodger") && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-dark-grey mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5 text-orange-500" />
                  Landlord/Reference Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`landlordName-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Landlord/Agent Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`landlordName-${applicant.id}`}
                      value={applicant.landlordName || ""}
                      onChange={(e) => onUpdateApplicant(applicant.id, "landlordName", e.target.value)}
                      placeholder="Enter landlord or agent name"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`landlordPhone-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Landlord/Agent Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="phone-container">
                      <Phone className="phone-icon h-4 w-4 text-orange-500" />
                      <Input
                        id={`landlordPhone-${applicant.id}`}
                        type="tel"
                        value={applicant.landlordPhone || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "landlordPhone", e.target.value)}
                        placeholder="Enter phone number"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={applicant.rentUpToDate === "yes"}
                        onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "rentUpToDate", checked ? "yes" : "no")}
                      />
                      <Label 
                        className="form-label text-gray-700 font-medium cursor-pointer"
                        onClick={() => onUpdateApplicant(applicant.id, "rentUpToDate", applicant.rentUpToDate === "yes" ? "no" : "yes")}
                      >
                        Is your rent up to date? <span className="text-red-500">*</span>
                      </Label>
                    </div>
                  </div>

                  {applicant.rentUpToDate === "no" && (
                    <div className="space-y-2">
                      <Label htmlFor={`rentArrearsDetails-${applicant.id}`} className="form-label text-gray-700 font-medium">
                        Please provide details about rent arrears:
                      </Label>
                      <Textarea
                        id={`rentArrearsDetails-${applicant.id}`}
                        value={applicant.rentArrearsDetails || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "rentArrearsDetails", e.target.value)}
                        placeholder="Please provide details about your rent arrears..."
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={applicant.noticePeriod === "yes"}
                        onCheckedChange={(checked) => onUpdateApplicant(applicant.id, "noticePeriod", checked ? "yes" : "no")}
                      />
                      <Label 
                        className="form-label text-gray-700 font-medium cursor-pointer"
                        onClick={() => onUpdateApplicant(applicant.id, "noticePeriod", applicant.noticePeriod === "yes" ? "no" : "yes")}
                      >
                        Do you need to give notice to your current landlord? <span className="text-red-500">*</span>
                      </Label>
                    </div>
                  </div>

                  {applicant.noticePeriod === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor={`noticePeriodLength-${applicant.id}`} className="form-label text-gray-700 font-medium">
                        Notice period required:
                      </Label>
                      <Select value={applicant.noticePeriodLength} onValueChange={(value) => onUpdateApplicant(applicant.id, "noticePeriodLength", value)}>
                        <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                          <SelectValue placeholder="Select notice period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 month</SelectItem>
                          <SelectItem value="2-months">2 months</SelectItem>
                          <SelectItem value="3-months">3 months</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Previous Address (if less than 2 years at current) */}
            {(applicant.timeAtAddress === "less-than-6-months" || applicant.timeAtAddress === "6-12-months" || applicant.timeAtAddress === "1-2-years") && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-dark-grey mb-4">Previous Address</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`previousAddress-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Previous Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`previousAddress-${applicant.id}`}
                      value={applicant.previousAddress || ""}
                      onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                      placeholder="Enter your previous address"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`previousLandlordName-${applicant.id}`} className="form-label text-gray-700 font-medium">
                        Previous Landlord/Agent Name
                      </Label>
                      <Input
                        id={`previousLandlordName-${applicant.id}`}
                        value={applicant.previousLandlordName || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "previousLandlordName", e.target.value)}
                        placeholder="Enter previous landlord name"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`previousLandlordPhone-${applicant.id}`} className="form-label text-gray-700 font-medium">
                        Previous Landlord/Agent Phone
                      </Label>
                      <Input
                        id={`previousLandlordPhone-${applicant.id}`}
                        type="tel"
                        value={applicant.previousLandlordPhone || ""}
                        onChange={(e) => onUpdateApplicant(applicant.id, "previousLandlordPhone", e.target.value)}
                        placeholder="Enter phone number"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
