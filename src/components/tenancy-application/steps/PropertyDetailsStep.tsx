
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestTube, Home, MapPin, Calendar, PoundSterling } from "lucide-react";
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
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Property Preferences</h3>
        <p className="text-light-grey mb-4">Tell us about your ideal rental property</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            Property Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 mb-2 block">
                Property Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="propertyType"
                value={propertyPreferences.propertyType}
                onChange={(e) => onUpdatePreferences("propertyType", e.target.value)}
                className="flex h-11 w-full rounded-md bg-white px-3 py-3 text-sm border border-gray-200 focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                required
              >
                <option value="">Select property type</option>
                <option value="House">House</option>
                <option value="Flat/Apartment">Flat/Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Bungalow">Bungalow</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-2 block">
                Number of Bedrooms <span className="text-red-500">*</span>
              </Label>
              <select
                id="bedrooms"
                value={propertyPreferences.bedrooms}
                onChange={(e) => onUpdatePreferences("bedrooms", e.target.value)}
                className="flex h-11 w-full rounded-md bg-white px-3 py-3 text-sm border border-gray-200 focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1"
                required
              >
                <option value="">Select bedrooms</option>
                <option value="Studio">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5+">5+ Bedrooms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxRent" className="text-sm font-medium text-gray-700 mb-2 block">
                Maximum Monthly Rent (£) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 font-semibold text-orange-500">£</span>
                <Input
                  id="maxRent"
                  type="number"
                  value={propertyPreferences.maxRent}
                  onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                  placeholder="e.g., 1500"
                  className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Move-in Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 pointer-events-none z-10" />
                <Input
                  id="moveInDate"
                  type="date"
                  value={propertyPreferences.moveInDate}
                  onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                  className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredArea" className="text-sm font-medium text-gray-700 mb-2 block">
              Preferred Area/Postcode <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 pointer-events-none z-10" />
              <Input
                id="preferredArea"
                value={propertyPreferences.preferredArea}
                onChange={(e) => onUpdatePreferences("preferredArea", e.target.value)}
                placeholder="e.g., Central London, SW1A 1AA"
                className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequirements" className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Requirements
            </Label>
            <Textarea
              id="additionalRequirements"
              value={propertyPreferences.additionalRequirements}
              onChange={(e) => onUpdatePreferences("additionalRequirements", e.target.value)}
              placeholder="e.g., Pet-friendly, parking space, garden, furnished..."
              className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
