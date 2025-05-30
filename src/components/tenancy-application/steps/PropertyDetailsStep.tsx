
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestTube, Calendar } from "lucide-react";
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

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Rental Property Details</h3>
        <p className="text-light-grey mb-4">Please provide the details of the property you are applying for.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="streetAddress" className="form-label text-dark-grey font-medium">
              Address <span className="text-red-500">*</span>
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
              Postcode <span className="text-red-500">*</span>
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
              Rental amount <span className="text-red-500">*</span>
            </Label>
            <div className="currency-input-container">
              <span className="currency-input-icon text-orange-500">£</span>
              <Input
                id="maxRent"
                type="number"
                value={propertyPreferences.maxRent}
                onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                placeholder=""
                className="currency-input border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="moveInDate" className="form-label text-dark-grey font-medium">
              Preferred move-in date <span className="text-red-500">*</span>
            </Label>
            <div className="date-input-container">
              <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="latestMoveInDate" className="form-label text-dark-grey font-medium">
              Latest move-in date <span className="text-red-500">*</span>
            </Label>
            <div className="date-input-container">
              <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
              <Input
                id="latestMoveInDate"
                type="date"
                value={propertyPreferences.latestMoveInDate}
                onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
                className="form-control border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialTenancyTerm" className="form-label text-dark-grey font-medium">
              Preferred initial tenancy term <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={propertyPreferences.initialTenancyTerm} 
              onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}
            >
              <SelectTrigger id="initialTenancyTerm" className="form-select border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Please select an option" />
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
    </div>
  );
};

export default PropertyDetailsStep;
