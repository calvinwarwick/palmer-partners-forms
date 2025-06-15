
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyPreferences } from "@/domain/types/Applicant";

interface PreferencesStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
}

const PreferencesStep = ({ propertyPreferences, onUpdatePreferences }: PreferencesStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Property Preferences</h3>
      <Card>
        <CardHeader variant="gradient">
          <CardTitle className="text-orange-700">Property Requirements</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="propertyType">Preferred Property Type *</Label>
            <select
              id="propertyType"
              value={propertyPreferences.propertyType}
              onChange={(e) => onUpdatePreferences("propertyType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select property type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="maisonette">Maisonette</option>
            </select>
          </div>
          <div>
            <Label htmlFor="maxRent">Maximum Monthly Rent (£) *</Label>
            <Input
              id="maxRent"
              type="number"
              value={propertyPreferences.maxRent}
              onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
              placeholder="e.g., 2500"
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Preferred Location</Label>
            <Input
              id="location"
              value={propertyPreferences.preferredLocation}
              onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
              placeholder="e.g., Central London, Zone 2"
            />
          </div>
          <div>
            <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
            <Input
              id="moveInDate"
              type="date"
              value={propertyPreferences.moveInDate}
              onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="requests">Additional Requests</Label>
            <textarea
              id="requests"
              value={propertyPreferences.additionalRequests}
              onChange={(e) => onUpdatePreferences("additionalRequests", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Any special requirements or preferences..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesStep;
