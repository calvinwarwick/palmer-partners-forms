
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyPreferences } from "@/domain/types/Applicant";
import { TestTube, Calendar } from "lucide-react";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
          <p className="text-gray-600">Tell us about your ideal property</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onFillAllTestData}
          className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mobile-form-grid">
        <FormFieldWithTooltip
          label="Property Address"
          tooltip="Enter the full address of the property you're applying for"
          htmlFor="propertyType"
        >
          <Input
            id="propertyType"
            value={propertyPreferences.propertyType}
            onChange={(e) => onUpdatePreferences("propertyType", e.target.value)}
            placeholder="eg 123 Orchard House, New Cut, London"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Street Address"
          tooltip="Enter the full street address of your preferred property"
          htmlFor="streetAddress"
        >
          <Input
            id="streetAddress"
            value={propertyPreferences.streetAddress}
            onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
            placeholder="eg 123 Orchard House, New Cut"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Postcode"
          htmlFor="postcode"
        >
          <Input
            id="postcode"
            value={propertyPreferences.postcode}
            onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
            placeholder="IP7 5DA"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Rental Amount for the House (per month)"
          tooltip="Enter the monthly rental amount for the property you're applying for in pounds"
          htmlFor="maxRent"
        >
          <Input
            id="maxRent"
            type="number"
            value={propertyPreferences.maxRent}
            onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
            placeholder="2500"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Preferred Location"
          tooltip="Specify your preferred area or neighborhood"
          htmlFor="preferredLocation"
        >
          <Input
            id="preferredLocation"
            value={propertyPreferences.preferredLocation}
            onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
            placeholder="Central London"
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Preferred Move-in Date"
          tooltip="When would you ideally like to move in?"
          htmlFor="moveInDate"
        >
          <div className="date-input-container">
            <Calendar className="date-input-icon h-4 w-4" />
            <Input
              id="moveInDate"
              type="date"
              value={propertyPreferences.moveInDate}
              onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Latest Move-in Date"
          tooltip="What's the latest date you could move in?"
          htmlFor="latestMoveInDate"
        >
          <div className="date-input-container">
            <Calendar className="date-input-icon h-4 w-4" />
            <Input
              id="latestMoveInDate"
              type="date"
              value={propertyPreferences.latestMoveInDate}
              onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Initial Tenancy Term"
          tooltip="How long would you like your initial tenancy agreement to be?"
          htmlFor="initialTenancyTerm"
        >
          <Select
            value={propertyPreferences.initialTenancyTerm}
            onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}
          >
            <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
              <SelectValue placeholder="Select tenancy term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6 months">6 months</SelectItem>
              <SelectItem value="1 year">1 year</SelectItem>
              <SelectItem value="18 months">18 months</SelectItem>
              <SelectItem value="2 years">2 years</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
