
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TestTube, Calendar, MapPin, Home } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onFillAllTestData?: () => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant, onFillAllTestData }: CurrentAddressStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Current Address Details</h3>
        <p className="text-light-grey mb-4">Tell us about your current living situation</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>
      
      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Home className="h-5 w-5" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`streetAddress-${applicant.id}`} className="form-label text-gray-700 font-medium">Street address <span className="text-red-500">*</span></Label>
                <Input
                  id={`streetAddress-${applicant.id}`}
                  value={applicant.previousAddress}
                  onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                  placeholder="Full current address"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`postcode-${applicant.id}`} className="form-label text-gray-700 font-medium">Postcode <span className="text-red-500">*</span></Label>
                <Input
                  id={`postcode-${applicant.id}`}
                  value={applicant.previousPostcode}
                  onChange={(e) => onUpdateApplicant(applicant.id, "previousPostcode", e.target.value)}
                  placeholder="e.g., CO14 8LZ"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`propertyStatus-${applicant.id}`} className="form-label text-gray-700 font-medium">Current property status <span className="text-red-500">*</span></Label>
              <select
                id={`propertyStatus-${applicant.id}`}
                value={applicant.currentPropertyStatus}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentPropertyStatus", e.target.value)}
                className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              >
                <option value="">Select status</option>
                <option value="Rented Privately">Rented Privately</option>
                <option value="Rented from Council">Rented from Council</option>
                <option value="Living with Family">Living with Family</option>
                <option value="Owner Occupier">Owner Occupier</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`moveInDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                  Move in date
                </Label>
                <div className="date-input-container">
                  <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                  <Input
                    id={`moveInDate-${applicant.id}`}
                    type="date"
                    value={applicant.moveInDate}
                    onChange={(e) => onUpdateApplicant(applicant.id, "moveInDate", e.target.value)}
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`vacateDate-${applicant.id}`} className="form-label text-gray-700 font-medium">
                  Vacate date
                </Label>
                <div className="date-input-container">
                  <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                  <Input
                    id={`vacateDate-${applicant.id}`}
                    type="date"
                    value={applicant.vacateDate}
                    onChange={(e) => onUpdateApplicant(applicant.id, "vacateDate", e.target.value)}
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`currentRent-${applicant.id}`} className="form-label text-gray-700 font-medium">Current rental amount (£)</Label>
                <Input
                  id={`currentRent-${applicant.id}`}
                  type="number"
                  value={applicant.currentRentalAmount}
                  onChange={(e) => onUpdateApplicant(applicant.id, "currentRentalAmount", e.target.value)}
                  placeholder="e.g., 1200"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
