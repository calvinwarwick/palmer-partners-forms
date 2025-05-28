
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyPreferences } from "@/domain/types/Applicant";
import { TestTube } from "lucide-react";

interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
  onFillAllTestData: () => void;
}

const PropertyDetailsStep = ({ 
  propertyPreferences, 
  onUpdatePreferences,
  onFillAllTestData 
}: PropertyDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
          <p className="text-gray-600 mt-1">Tell us about your ideal property</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onFillAllTestData}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            value={propertyPreferences.propertyType}
            onValueChange={(value) => onUpdatePreferences("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            value={propertyPreferences.streetAddress}
            onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
            placeholder="eg 123 Orchard House, New Cut"
          />
        </div>

        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={propertyPreferences.postcode}
            onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
            placeholder="IP7 5DA"
          />
        </div>

        <div>
          <Label htmlFor="maxRent">Maximum Rent (per month)</Label>
          <Input
            id="maxRent"
            type="number"
            value={propertyPreferences.maxRent}
            onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
            placeholder="2500"
          />
        </div>

        <div>
          <Label htmlFor="preferredLocation">Preferred Location</Label>
          <Input
            id="preferredLocation"
            value={propertyPreferences.preferredLocation}
            onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
            placeholder="Central London"
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
          <Label htmlFor="latestMoveInDate">Latest Move-in Date</Label>
          <Input
            id="latestMoveInDate"
            type="date"
            value={propertyPreferences.latestMoveInDate}
            onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="initialTenancyTerm">Initial Tenancy Term</Label>
          <Select
            value={propertyPreferences.initialTenancyTerm}
            onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tenancy term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6 months">6 months</SelectItem>
              <SelectItem value="1 year">1 year</SelectItem>
              <SelectItem value="18 months">18 months</SelectItem>
              <SelectItem value="2 years">2 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="additionalRequests">Additional Requests</Label>
        <Textarea
          id="additionalRequests"
          value={propertyPreferences.additionalRequests}
          onChange={(e) => onUpdatePreferences("additionalRequests", e.target.value)}
          placeholder="Any specific requirements or requests..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
