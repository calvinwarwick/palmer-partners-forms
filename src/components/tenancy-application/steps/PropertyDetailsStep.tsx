
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, Calendar, MapPin, PoundSterling } from "lucide-react";
import { PropertyPreferences } from "@/domain/types/Applicant";

interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
}

const PropertyDetailsStep = ({ propertyPreferences, onUpdatePreferences }: PropertyDetailsStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Property Details</h3>
        <p className="text-light-grey mb-4">Tell us about your property preferences</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="form-label text-gray-700 font-medium">
                Property Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="propertyType"
                value={propertyPreferences.propertyType}
                onChange={(e) => onUpdatePreferences("propertyType", e.target.value)}
                className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              >
                <option value="">Select property type</option>
                <option value="1 Bedroom Flat">1 Bedroom Flat</option>
                <option value="2 Bedroom Flat">2 Bedroom Flat</option>
                <option value="3 Bedroom Flat">3 Bedroom Flat</option>
                <option value="1 Bedroom House">1 Bedroom House</option>
                <option value="2 Bedroom House">2 Bedroom House</option>
                <option value="3 Bedroom House">3 Bedroom House</option>
                <option value="4+ Bedroom House">4+ Bedroom House</option>
                <option value="Studio">Studio</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxRent" className="form-label text-gray-700 font-medium">
                Maximum Monthly Rent <span className="text-red-500">*</span>
              </Label>
              <div className="currency-input-container">
                <PoundSterling className="currency-input-icon h-4 w-4" />
                <Input
                  id="maxRent"
                  type="number"
                  value={propertyPreferences.maxRent}
                  onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                  placeholder="e.g., 2500"
                  className="currency-input border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="form-label text-gray-700 font-medium">
              Preferred Location <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 pointer-events-none z-10" />
              <Input
                id="location"
                value={propertyPreferences.preferredLocation}
                onChange={(e) => onUpdatePreferences("preferredLocation", e.target.value)}
                placeholder="e.g., Colchester, Clacton-on-Sea"
                className="search-input border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveInDate" className="form-label text-gray-700 font-medium">
              Preferred Move-in Date <span className="text-red-500">*</span>
            </Label>
            <div className="date-input-container">
              <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
              <Input
                id="moveInDate"
                type="date"
                value={propertyPreferences.moveInDate}
                onChange={(e) => onUpdatePreferences("moveInDate", e.target.value)}
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequests" className="form-label text-gray-700 font-medium">
              Additional Requests
            </Label>
            <Textarea
              id="additionalRequests"
              value={propertyPreferences.additionalRequests}
              onChange={(e) => onUpdatePreferences("additionalRequests", e.target.value)}
              placeholder="Any special requirements or preferences..."
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
