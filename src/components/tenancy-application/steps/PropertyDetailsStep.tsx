
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Building, Calendar, MapPin, PoundSterling } from "lucide-react";
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg">
            <Building className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Property Details</h3>
            <p className="text-gray-600 mt-1">Tell us about the property you're interested in</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button variant="default" size="sm" onClick={onFillAllTestData} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>

      {/* Property Type and Address Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Property Type</h4>
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-gray-700 font-medium">What type of property are you looking for? *</Label>
              <Select value={propertyPreferences.propertyType} onValueChange={(value) => onUpdatePreferences("propertyType", value)}>
                <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="maisonette">Maisonette</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Location</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-gray-700 font-medium">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={propertyPreferences.streetAddress}
                  onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
                  placeholder="Enter the street address"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-gray-700 font-medium">Postcode *</Label>
                <Input
                  id="postcode"
                  value={propertyPreferences.postcode}
                  onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
                  placeholder="Enter postcode"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLocation" className="text-gray-700 font-medium">Preferred Area/Location</Label>
                <Input
                  id="preferredLocation"
                  value={propertyPreferences.preferredLocation}
                  onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
                  placeholder="e.g., Central London, Near transport links"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <PoundSterling className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Budget</h4>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRent" className="text-gray-700 font-medium">Maximum Monthly Rent (£) *</Label>
              <Input
                id="maxRent"
                type="number"
                value={propertyPreferences.maxRent}
                onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                placeholder="Enter maximum rent amount"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Move-in Dates</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moveInDate" className="text-gray-700 font-medium">Preferred Move-in Date *</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={propertyPreferences.moveInDate}
                  onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latestMoveInDate" className="text-gray-700 font-medium">Latest Move-in Date</Label>
                <Input
                  id="latestMoveInDate"
                  type="date"
                  value={propertyPreferences.latestMoveInDate}
                  onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Tenancy Details</h4>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialTenancyTerm" className="text-gray-700 font-medium">Initial Tenancy Term</Label>
              <Select value={propertyPreferences.initialTenancyTerm} onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}>
                <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500">
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
            </div>
          </div>
        </div>
      </div>

      {/* Additional Requests Section */}
      <div className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border-2 border-orange-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-5 w-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Additional Requirements</h4>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalRequests" className="text-gray-700 font-medium">Any additional requests or requirements?</Label>
          <Textarea
            id="additionalRequests"
            value={propertyPreferences.additionalRequests}
            onChange={(e) => onUpdatePreferences("additionalRequests", e.target.value)}
            placeholder="e.g., Pet-friendly, Garden required, Parking space needed..."
            rows={4}
            className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
