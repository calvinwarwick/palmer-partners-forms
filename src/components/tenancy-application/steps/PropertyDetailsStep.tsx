
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { PropertyPreferences } from "@/domain/types/Applicant";

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
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-xl font-semibold text-dark-grey mb-2">Proposed Rental Property Details</h3>
        <div className="border-b border-gray-200 mb-6"></div>
        <p className="text-light-grey">Please provide the details of the property you are applying for.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="streetAddress" className="form-label text-dark-grey font-medium">
              Address <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="streetAddress"
              value={propertyPreferences.streetAddress}
              onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
              placeholder="Rental property address"
              className="form-control border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postcode" className="form-label text-dark-grey font-medium">
              Postcode <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="postcode"
              value={propertyPreferences.postcode}
              onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
              placeholder="Rental property postcode"
              className="form-control border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRent" className="form-label text-dark-grey font-medium">
              Rental amount <span className="text-orange-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey z-10">£</span>
              <Input
                id="maxRent"
                type="number"
                value={propertyPreferences.maxRent}
                onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                placeholder=""
                className="form-control pl-8 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="moveInDate" className="form-label text-dark-grey font-medium">
              Preferred move-in date <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="moveInDate"
              type="date"
              value={propertyPreferences.moveInDate}
              onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
              className="form-control border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              placeholder="dd/mm/yyyy"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latestMoveInDate" className="form-label text-dark-grey font-medium">
              Latest move-in date <span className="text-orange-500">*</span>
            </Label>
            <Input
              id="latestMoveInDate"
              type="date"
              value={propertyPreferences.latestMoveInDate}
              onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
              className="form-control border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialTenancyTerm" className="form-label text-dark-grey font-medium">
              Preferred initial tenancy term <span className="text-orange-500">*</span>
            </Label>
            <Select 
              value={propertyPreferences.initialTenancyTerm} 
              onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}
            >
              <SelectTrigger id="initialTenancyTerm" className="form-select border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
                <SelectItem value="18 months">18 months</SelectItem>
                <SelectItem value="2 years">2 years</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fillTestData} 
          className="flex items-center gap-2 border-light-grey text-dark-grey hover:bg-gray-50 font-lexend"
        >
          <TestTube className="h-4 w-4" />
          Fill Step Data
        </Button>
        {onFillAllTestData && (
          <Button 
            size="sm" 
            onClick={onFillAllTestData} 
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-lexend"
          >
            <TestTube className="h-4 w-4" />
            Fill All Form Data
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
