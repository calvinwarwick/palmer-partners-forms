
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestTube, Search } from "lucide-react";
import { PropertyPreferences } from "@/domain/types/Applicant";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";

interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
  onFillAllTestData?: () => void;
}

const PropertyDetailsStep = ({
  propertyPreferences,
  onUpdatePreferences,
  onFillAllTestData,
}: PropertyDetailsStepProps) => {
  const [showPostcodeSearch, setShowPostcodeSearch] = useState(false);

  const fillTestData = () => {
    console.log('Fill test data button clicked - Property Details');
    
    onUpdatePreferences("propertyType", "apartment");
    onUpdatePreferences("streetAddress", "123 Orchard House, New Cut");
    onUpdatePreferences("postcode", "IP7 5DA");
    onUpdatePreferences("maxRent", "2500");
    onUpdatePreferences("preferredLocation", "Central London");
    onUpdatePreferences("moveInDate", "2024-06-01");
    onUpdatePreferences("latestMoveInDate", "2024-06-15");
    onUpdatePreferences("initialTenancyTerm", "1 year");
    onUpdatePreferences("additionalRequests", "Pet-friendly property preferred");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Property Details</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button variant="default" size="sm" onClick={onFillAllTestData} className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWithTooltip 
              label="Property Type" 
              required 
              htmlFor="propertyType"
              tooltip="Select the type of property you're looking for"
            >
              <Select 
                value={propertyPreferences.propertyType} 
                onValueChange={(value) => onUpdatePreferences("propertyType", value)}
              >
                <SelectTrigger id="propertyType" className="form-select">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWithTooltip>

            <FormFieldWithTooltip 
              label="Maximum Rent (£/month)" 
              required 
              htmlFor="maxRent"
              tooltip="Your maximum budget for monthly rent"
            >
              <Input
                id="maxRent"
                type="number"
                value={propertyPreferences.maxRent}
                onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                placeholder="e.g. 1500"
                className="form-control"
                required
              />
            </FormFieldWithTooltip>
          </div>

          <FormFieldWithTooltip 
            label="Street Address" 
            required 
            htmlFor="streetAddress"
            tooltip="Enter the full street address of the property you're interested in"
          >
            <Input
              id="streetAddress"
              value={propertyPreferences.streetAddress}
              onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
              placeholder="e.g. 123 Main Street, Apartment 4B"
              className="form-control"
              required
            />
          </FormFieldWithTooltip>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWithTooltip 
              label="Postcode" 
              required 
              htmlFor="postcode"
              tooltip="The postcode of the property"
            >
              <div className="relative">
                <Input
                  id="postcode"
                  value={propertyPreferences.postcode}
                  onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  className="form-control search-input"
                  required
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </FormFieldWithTooltip>

            <FormFieldWithTooltip 
              label="Preferred Location/Area" 
              htmlFor="preferredLocation"
              tooltip="Any specific area or location preferences"
            >
              <Input
                id="preferredLocation"
                value={propertyPreferences.preferredLocation}
                onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
                placeholder="e.g. City Centre, Near Station"
                className="form-control"
              />
            </FormFieldWithTooltip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWithTooltip 
              label="Earliest Move-in Date" 
              required 
              htmlFor="moveInDate"
              tooltip="The earliest date you can move into the property"
            >
              <div className="date-input-container">
                <div className="date-input-icon">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  id="moveInDate"
                  type="date"
                  value={propertyPreferences.moveInDate}
                  onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </FormFieldWithTooltip>

            <FormFieldWithTooltip 
              label="Latest Move-in Date" 
              htmlFor="latestMoveInDate"
              tooltip="The latest date you need to move in by"
            >
              <div className="date-input-container">
                <div className="date-input-icon">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  id="latestMoveInDate"
                  type="date"
                  value={propertyPreferences.latestMoveInDate}
                  onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
                  className="form-control"
                />
              </div>
            </FormFieldWithTooltip>
          </div>

          <FormFieldWithTooltip 
            label="Initial Tenancy Term" 
            required 
            htmlFor="initialTenancyTerm"
            tooltip="How long would you like the initial tenancy agreement to be?"
          >
            <Select 
              value={propertyPreferences.initialTenancyTerm} 
              onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}
            >
              <SelectTrigger id="initialTenancyTerm" className="form-select">
                <SelectValue placeholder="Select tenancy term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
                <SelectItem value="18 months">18 months</SelectItem>
                <SelectItem value="2 years">2 years</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWithTooltip>

          <FormFieldWithTooltip 
            label="Additional Requests" 
            htmlFor="additionalRequests"
            tooltip="Any additional requirements or requests for the property"
          >
            <Textarea
              id="additionalRequests"
              value={propertyPreferences.additionalRequests}
              onChange={(e) => onUpdatePreferences("additionalRequests", e.target.value)}
              placeholder="e.g. Pet-friendly, Garden access, Parking space..."
              className="form-control min-h-20"
              rows={3}
            />
          </FormFieldWithTooltip>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
