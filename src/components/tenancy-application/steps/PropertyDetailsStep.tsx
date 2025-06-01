import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Home, MapPin, Calendar, PoundSterling, Clock, FileText, Baby, Car, Cigarette, Heart } from "lucide-react";
import { PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";

interface PropertyDetailsStepProps {
  propertyPreferences: PropertyPreferences;
  additionalDetails: AdditionalDetails;
  onUpdatePreferences: (field: keyof PropertyPreferences, value: string) => void;
  onUpdateDetails: (field: string, value: string | boolean) => void;
}

const PropertyDetailsStep = ({ 
  propertyPreferences, 
  additionalDetails,
  onUpdatePreferences,
  onUpdateDetails 
}: PropertyDetailsStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Property Details & Requirements</h3>
        <p className="text-light-grey mb-4">Tell us about your ideal property and tenancy requirements</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Property Details Section */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="form-label text-gray-700 font-medium">
              Property Type <span className="text-red-500">*</span>
            </Label>
            <Select value={propertyPreferences.propertyType} onValueChange={(value) => onUpdatePreferences("propertyType", value)}>
              <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="streetAddress" className="form-label text-gray-700 font-medium">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 z-10" />
                <Input
                  id="streetAddress"
                  value={propertyPreferences.streetAddress}
                  onChange={(e) => onUpdatePreferences("streetAddress", e.target.value)}
                  placeholder="Enter street address"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-12"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode" className="form-label text-gray-700 font-medium">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 z-10" />
                <Input
                  id="postcode"
                  value={propertyPreferences.postcode}
                  onChange={(e) => onUpdatePreferences("postcode", e.target.value)}
                  placeholder="Enter postcode"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-12"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxRent" className="form-label text-gray-700 font-medium">
                Maximum Rent (£/month) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500 z-10" />
                <Input
                  id="maxRent"
                  type="number"
                  value={propertyPreferences.maxRent}
                  onChange={(e) => onUpdatePreferences("maxRent", e.target.value)}
                  placeholder="Enter max rent"
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 pl-12"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
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
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="latestMoveInDate" className="form-label text-gray-700 font-medium">
                Latest Move-in Date <span className="text-red-500">*</span>
              </Label>
              <div className="date-input-container">
                <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                <Input
                  id="latestMoveInDate"
                  type="date"
                  value={propertyPreferences.latestMoveInDate}
                  onChange={(e) => onUpdatePreferences("latestMoveInDate", e.target.value)}
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialTenancyTerm" className="form-label text-gray-700 font-medium">
              Preferred Initial Tenancy Term <span className="text-red-500">*</span>
            </Label>
            <Select value={propertyPreferences.initialTenancyTerm} onValueChange={(value) => onUpdatePreferences("initialTenancyTerm", value)}>
              <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Year</SelectItem>
                <SelectItem value="2">2 Years</SelectItem>
                <SelectItem value="3">3 Years</SelectItem>
                <SelectItem value="4+">4+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenancy Requirements Section */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Tenancy Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Label className="form-label text-gray-700 font-medium">
                      Do you have pets?
                    </Label>
                    <p className="text-sm text-gray-600">Tell us about your furry friends</p>
                  </div>
                </div>
                <Switch
                  checked={additionalDetails.pets}
                  onCheckedChange={(checked) => onUpdateDetails("pets", checked)}
                />
              </div>
              {additionalDetails.pets && (
                <div className="space-y-2">
                  <Label htmlFor="petDetails" className="form-label text-gray-700 font-medium">
                    Pet Details
                  </Label>
                  <Textarea
                    id="petDetails"
                    value={additionalDetails.petDetails}
                    onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
                    placeholder="Please describe your pets (type, breed, age, etc.)"
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
              )}
            </div>

            {/* Smoking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Cigarette className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Label className="form-label text-gray-700 font-medium">
                      Do you smoke?
                    </Label>
                    <p className="text-sm text-gray-600">Important for property suitability</p>
                  </div>
                </div>
                <Switch
                  checked={additionalDetails.smoking}
                  onCheckedChange={(checked) => onUpdateDetails("smoking", checked)}
                />
              </div>
            </div>

            {/* Parking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Car className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Label className="form-label text-gray-700 font-medium">
                      Do you need parking?
                    </Label>
                    <p className="text-sm text-gray-600">Parking space requirement</p>
                  </div>
                </div>
                <Switch
                  checked={additionalDetails.parking}
                  onCheckedChange={(checked) => onUpdateDetails("parking", checked)}
                />
              </div>
            </div>

            {/* Children */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Baby className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Label className="form-label text-gray-700 font-medium">
                      Do you have children?
                    </Label>
                    <p className="text-sm text-gray-600">Tell us about your family</p>
                  </div>
                </div>
                <Switch
                  checked={additionalDetails.children}
                  onCheckedChange={(checked) => onUpdateDetails("children", checked)}
                />
              </div>
              {additionalDetails.children && (
                <div className="space-y-2">
                  <Label htmlFor="childrenDetails" className="form-label text-gray-700 font-medium">
                    Children Details
                  </Label>
                  <Textarea
                    id="childrenDetails"
                    value={additionalDetails.childrenDetails}
                    onChange={(e) => onUpdateDetails("childrenDetails", e.target.value)}
                    placeholder="Please provide details about your children (ages, etc.)"
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequests" className="form-label text-gray-700 font-medium">
              Additional Requests or Requirements
            </Label>
            <Textarea
              id="additionalRequests"
              value={additionalDetails.additionalRequests}
              onChange={(e) => onUpdateDetails("additionalRequests", e.target.value)}
              placeholder="Any other specific requirements or requests for your tenancy..."
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;
