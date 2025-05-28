
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TestTube, Calendar } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";

interface CurrentAddressStepProps {
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
  onFillAllTestData?: () => void;
}

const CurrentAddressStep = ({ applicants, onUpdateApplicant, onFillAllTestData }: CurrentAddressStepProps) => {
  const fillTestData = () => {
    console.log('Fill test data button clicked - Current Address');
    console.log('Current applicants for address:', applicants);
    
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

    console.log('Filling address test data for', applicants.length, 'applicants');
    applicants.forEach((applicant, index) => {
      if (testData[index]) {
        console.log(`Filling address data for applicant ${index + 1}:`, testData[index]);
        Object.entries(testData[index]).forEach(([field, value]) => {
          console.log(`Setting address ${field} to ${value} for applicant ${applicant.id}`);
          onUpdateApplicant(applicant.id, field as keyof Applicant, value);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Current Address Details</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fillTestData} 
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onFillAllTestData} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>
      
      {applicants.map((applicant) => (
        <Card key={applicant.id} className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              {applicant.firstName} {applicant.lastName} - Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor={`streetAddress-${applicant.id}`} className="form-label">Street address *</Label>
              <Input
                id={`streetAddress-${applicant.id}`}
                value={applicant.previousAddress}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousAddress", e.target.value)}
                placeholder="Full current address"
                className="form-control"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`postcode-${applicant.id}`} className="form-label">Postcode *</Label>
              <Input
                id={`postcode-${applicant.id}`}
                value={applicant.previousPostcode}
                onChange={(e) => onUpdateApplicant(applicant.id, "previousPostcode", e.target.value)}
                placeholder="e.g., CO14 8LZ"
                className="form-control"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`propertyStatus-${applicant.id}`} className="form-label">Current property status *</Label>
              <select
                id={`propertyStatus-${applicant.id}`}
                value={applicant.currentPropertyStatus}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentPropertyStatus", e.target.value)}
                className="form-select"
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
                <Label htmlFor={`moveInDate-${applicant.id}`} className="form-label flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Move in date
                </Label>
                <Input
                  id={`moveInDate-${applicant.id}`}
                  type="date"
                  value={applicant.moveInDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "moveInDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <Label htmlFor={`vacateDate-${applicant.id}`} className="form-label flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Vacate date
                </Label>
                <Input
                  id={`vacateDate-${applicant.id}`}
                  type="date"
                  value={applicant.vacateDate}
                  onChange={(e) => onUpdateApplicant(applicant.id, "vacateDate", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`currentRent-${applicant.id}`} className="form-label">Current rental amount (£)</Label>
              <Input
                id={`currentRent-${applicant.id}`}
                type="number"
                value={applicant.currentRentalAmount}
                onChange={(e) => onUpdateApplicant(applicant.id, "currentRentalAmount", e.target.value)}
                placeholder="e.g., 1200"
                className="form-control"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentAddressStep;
