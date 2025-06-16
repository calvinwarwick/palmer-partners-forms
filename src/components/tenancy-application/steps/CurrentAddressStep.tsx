
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant }: CurrentAddressStepProps) => {
  const shouldShowRentalAmount = (status: string) => {
    return status === "rented-privately" || status === "rented-through-agent";
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Current Address Information</h3>
        <p className="text-light-grey mb-4">Tell us about your current living situation</p>
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`currentAddress-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`currentAddress-${applicant.id}`}
                    value={applicant.currentAddress || ""}
                    onChange={(e) => onUpdateApplicant(applicant.id, "currentAddress", e.target.value)}
                    placeholder="Enter your street address"
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
                <div className="space-y-2">
                  <Label htmlFor={`currentPropertyStatus-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Current Property Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={applicant.currentPropertyStatus} onValueChange={(value) => onUpdateApplicant(applicant.id, "currentPropertyStatus", value)}>
                    <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                      <SelectValue placeholder="Select property status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rented-privately">Rented Privately</SelectItem>
                      <SelectItem value="rented-through-agent">Rented through Agent</SelectItem>
                      <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`moveInDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Move In Date
                  </Label>
                  <Input
                    id={`moveInDate-${applicant.id}`}
                    type="date"
                    value={applicant.moveInDate || ""}
                    onChange={(e) => onUpdateApplicant(applicant.id, "moveInDate", e.target.value)}
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`vacateDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                    Vacate Date
                  </Label>
                  <Input
                    id={`vacateDate-${applicant.id}`}
                    type="date"
                    value={applicant.vacateDate || ""}
                    onChange={(e) => onUpdateApplicant(applicant.id, "vacateDate", e.target.value)}
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
                {shouldShowRentalAmount(applicant.currentPropertyStatus || "") && (
                  <div className="space-y-2">
                    <Label htmlFor={`currentRentalAmount-${applicant.id}`} className="form-label text-gray-700 font-medium">
                      Current Rental Amount (£) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`currentRentalAmount-${applicant.id}`}
                      type="number"
                      value={applicant.currentRentalAmount || ""}
                      onChange={(e) => onUpdateApplicant(applicant.id, "currentRentalAmount", e.target.value)}
                      placeholder="Enter monthly rental amount"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                      required
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

export default CurrentAddressStep;
