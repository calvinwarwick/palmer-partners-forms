
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <p className="text-gray-600 mb-6">Please provide the details of the property you are applying for.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="streetAddress">Address *</Label>
            <Input
              id="streetAddress"
              value={propertyPreferences.streetAddress}
              onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
              placeholder="e.g., Orchard House, New Cut"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              value={propertyPreferences.postcode}
              onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
              placeholder="e.g., IP7 5DA"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="rentalAmount">Rental amount (£) *</Label>
            <Input
              id="rentalAmount"
              type="number"
              value={propertyPreferences.maxRent}
              onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
              placeholder="e.g., 2500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredMoveIn">Preferred move-in date *</Label>
              <Input
                id="preferredMoveIn"
                type="date"
                value={propertyPreferences.moveInDate}
                onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="latestMoveIn">Latest move-in date</Label>
              <Input
                id="latestMoveIn"
                type="date"
                value={propertyPreferences.latestMoveInDate}
                onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tenancyTerm">Preferred initial tenancy term *</Label>
            <select
              id="tenancyTerm"
              value={propertyPreferences.initialTenancyTerm}
              onChange={(e) => onUpdatePreferences("initialTenancyTerm", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select term</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
