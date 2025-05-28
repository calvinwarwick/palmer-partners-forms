
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant }: CurrentAddressStepProps) => {
  const fillTestData = () => {
    const testData = [
      {
        previousAddress: "45 Elm Street, Colchester",
        previousPostcode: "CO1 2AB",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2022-01-15",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1800"
      },
      {
        previousAddress: "22 Oak Avenue, Ipswich",
        previousPostcode: "IP2 3CD",
        currentPropertyStatus: "Rented Privately",
        moveInDate: "2021-03-01",
        vacateDate: "2024-05-30",
        currentRentalAmount: "1600"
      }
    ];

    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        Object.entries(testData[index]).forEach(([field, value]) => {
          onUpdateApplicant(applicant.id, field as keyof Applicant, value);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Current Address Details</h3>
        <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>
      
      {applicants.map((applicant) => (
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              {applicant.firstName} {applicant.lastName} - Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="form-floating">
              <Input
                id={`streetAddress-${applicant.id}`}
                value={applicant.previousAddress}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                placeholder="Full current address"
                className="form-control"
                required
              />
              <label htmlFor={`streetAddress-${applicant.id}`} className="text-muted-foreground">Street address *</label>
            </div>
            
            <div className="form-floating">
              <Input
                id={`postcode-${applicant.id}`}
                value={applicant.previousPostcode}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousPostcode", e.target.value)}
                placeholder="e.g., CO14 8LZ"
                className="form-control"
                required
              />
              <label htmlFor={`postcode-${applicant.id}`} className="text-muted-foreground">Postcode *</label>
            </div>
            
            <div className="form-floating">
              <select
                id={`propertyStatus-${applicant.id}`}
                value={applicant.currentPropertyStatus}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentPropertyStatus", e.target.value)}
                className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select status</option>
                <option value="Rented Privately">Rented Privately</option>
                <option value="Rented from Council">Rented from Council</option>
                <option value="Living with Family">Living with Family</option>
                <option value="Owner Occupier">Owner Occupier</option>
                <option value="Other">Other</option>
              </select>
              <label htmlFor={`propertyStatus-${applicant.id}`} className="text-muted-foreground">Current property status *</label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-floating">
                <Input
                  id={`moveInDate-${applicant.id}`}
                  type="date"
                  value={applicant.moveInDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "moveInDate", e.target.value)}
                  className="form-control"
                />
                <label htmlFor={`moveInDate-${applicant.id}`} className="text-muted-foreground">Move in date</label>
              </div>
              <div className="form-floating">
                <Input
                  id={`vacateDate-${applicant.id}`}
                  type="date"
                  value={applicant.vacateDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "vacateDate", e.target.value)}
                  className="form-control"
                />
                <label htmlFor={`vacateDate-${applicant.id}`} className="text-muted-foreground">Vacate date</label>
              </div>
            </div>
            
            <div className="form-floating">
              <Input
                id={`currentRent-${applicant.id}`}
                type="number"
                value={applicant.currentRentalAmount}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentRentalAmount", e.target.value)}
                placeholder="e.g., 1200"
                className="form-control"
              />
              <label htmlFor={`currentRent-${applicant.id}`} className="text-muted-foreground">Current rental amount (£)</label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
