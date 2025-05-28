
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyPreferences } from "@/domain/types/Applicant";

interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
}

const PropertyDetailsStep = ({ propertyPreferences, onUpdatePreferences }: PropertyDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Proposed Rental Property Details</h3>
        <p className="text-muted-foreground mb-6">Please provide the details of the property you are applying for.</p>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="form-floating">
            <Input
              id="streetAddress"
              value={propertyPreferences.streetAddress}
              onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
              placeholder="e.g., Orchard House, New Cut"
              className="form-control"
              required
            />
            <label htmlFor="streetAddress" className="text-muted-foreground">Address *</label>
          </div>
          
          <div className="form-floating">
            <Input
              id="postcode"
              value={propertyPreferences.postcode}
              onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
              placeholder="e.g., IP7 5DA"
              className="form-control"
              required
            />
            <label htmlFor="postcode" className="text-muted-foreground">Postcode *</label>
          </div>
          
          <div className="form-floating">
            <Input
              id="rentalAmount"
              type="number"
              value={propertyPreferences.maxRent}
              onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
              placeholder="e.g., 2500"
              className="form-control"
              required
            />
            <label htmlFor="rentalAmount" className="text-muted-foreground">Rental amount (£) *</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-floating">
              <Input
                id="preferredMoveIn"
                type="date"
                value={propertyPreferences.moveInDate}
                onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                className="form-control"
                required
              />
              <label htmlFor="preferredMoveIn" className="text-muted-foreground">Preferred move-in date *</label>
            </div>
            <div className="form-floating">
              <Input
                id="latestMoveIn"
                type="date"
                value={propertyPreferences.latestMoveInDate}
                onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
                className="form-control"
              />
              <label htmlFor="latestMoveIn" className="text-muted-foreground">Latest move-in date</label>
            </div>
          </div>
          
          <div className="form-floating">
            <select
              id="tenancyTerm"
              value={propertyPreferences.initialTenancyTerm}
              onChange={(e) => onUpdatePreferences("initialTenancyTerm", e.target.value)}
              className="form-select w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select term</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
            </select>
            <label htmlFor="tenancyTerm" className="text-muted-foreground">Preferred initial tenancy term *</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
