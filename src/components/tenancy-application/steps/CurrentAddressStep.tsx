
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant }: CurrentAddressStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Current Address Details</h3>
      
      {applicants.map((applicant) => (
        <Card key={applicant.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {applicant.firstName} {applicant.lastName} - Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`streetAddress-${applicant.id}`}>Street address *</Label>
              <Input
                id={`streetAddress-${applicant.id}`}
                value={applicant.previousAddress}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                placeholder="Full current address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`postcode-${applicant.id}`}>Postcode *</Label>
              <Input
                id={`postcode-${applicant.id}`}
                value={applicant.previousPostcode}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousPostcode", e.target.value)}
                placeholder="e.g., CO14 8LZ"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`propertyStatus-${applicant.id}`}>Current property status *</Label>
              <select
                id={`propertyStatus-${applicant.id}`}
                value={applicant.currentPropertyStatus}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentPropertyStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`moveInDate-${applicant.id}`}>Move in date</Label>
                <Input
                  id={`moveInDate-${applicant.id}`}
                  type="date"
                  value={applicant.moveInDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "moveInDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`vacateDate-${applicant.id}`}>Vacate date</Label>
                <Input
                  id={`vacateDate-${applicant.id}`}
                  type="date"
                  value={applicant.vacateDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "vacateDate", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`currentRent-${applicant.id}`}>Current rental amount (£)</Label>
              <Input
                id={`currentRent-${applicant.id}`}
                type="number"
                value={applicant.currentRentalAmount}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentRentalAmount", e.target.value)}
                placeholder="e.g., 1200"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
