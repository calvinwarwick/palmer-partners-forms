
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin } from "lucide-react";
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
        <div className="border-b border-gray-200 mb-6" style={{ marginTop: '10px' }}></div>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardHeader className="pb-4 bg-orange-500 text-white rounded-t-lg">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
