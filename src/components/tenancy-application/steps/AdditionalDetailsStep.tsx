
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Heart, Car, Baby, PawPrint, Calendar, Building, DollarSign } from "lucide-react";
import { Applicant } from "@/domain/types/Applicant";
import { PetDetails } from "./PetDetails";

interface AdditionalDetailsStepProps {
  additionalDetails: {
    moveInDate: string;
    tenancyLength: string;
    pets: boolean;
    petDetails: string;
    smoking: boolean;
    parking: boolean;
    children: boolean;
    childrenDetails: string;
    additionalRequests: string;
    householdIncome: string;
  };
  onUpdateDetails: (field: string, value: string | boolean) => void;
  onFillAllTestData?: () => void;
  maxRent?: string;
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const AdditionalDetailsStep = ({ 
  additionalDetails, 
  onUpdateDetails, 
  onFillAllTestData,
  maxRent,
  applicants,
  onUpdateApplicant
}: AdditionalDetailsStepProps) => {
  const calculateRecommendedIncome = () => {
    if (!maxRent) return null;
    const rent = parseFloat(maxRent);
    if (isNaN(rent)) return null;
    return (rent * 30).toLocaleString();
  };

  const recommendedIncome = calculateRecommendedIncome();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Additional Details</h3>
        <p className="text-light-grey mb-4">Tell us more about your requirements and preferences</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Tenancy Details */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            Tenancy Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="form-label text-gray-700 font-medium">
                Preferred Move-in Date <span className="text-red-500">*</span>
              </Label>
              <div className="date-input-container">
                <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                <Input
                  id="moveInDate"
                  type="date"
                  value={additionalDetails.moveInDate}
                  onChange={(e) => onUpdateDetails("moveInDate", e.target.value)}
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenancyLength" className="form-label text-gray-700 font-medium">
                Preferred Tenancy Length <span className="text-red-500">*</span>
              </Label>
              <Select value={additionalDetails.tenancyLength} onValueChange={(value) => onUpdateDetails("tenancyLength", value)}>
                <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
                  <SelectValue placeholder="Select tenancy length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-months">6 months</SelectItem>
                  <SelectItem value="12-months">12 months</SelectItem>
                  <SelectItem value="18-months">18 months</SelectItem>
                  <SelectItem value="24-months">24 months</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="householdIncome" className="form-label text-gray-700 font-medium">
              Total Annual Household Income (£) <span className="text-red-500">*</span>
            </Label>
            {recommendedIncome && (
              <p className="text-sm text-orange-600 mb-2">
                Recommended minimum income: £{recommendedIncome} per year (based on max rent of £{maxRent}/month)
              </p>
            )}
            <Input
              id="householdIncome"
              type="number"
              value={additionalDetails.householdIncome}
              onChange={(e) => onUpdateDetails("householdIncome", e.target.value)}
              placeholder="Enter total household income"
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Household Composition */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="h-5 w-5" />
            </div>
            Household Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={additionalDetails.children}
                onCheckedChange={(checked) => onUpdateDetails("children", checked)}
              />
              <Label 
                className="form-label text-gray-700 font-medium cursor-pointer"
                onClick={() => onUpdateDetails("children", !additionalDetails.children)}
              >
                Will there be children living in the property? <span className="text-red-500">*</span>
              </Label>
            </div>
          </div>

          {additionalDetails.children && (
            <div className="space-y-2">
              <Label htmlFor="childrenDetails" className="form-label text-gray-700 font-medium">
                Please provide details about children (ages, special requirements):
              </Label>
              <div className="children-details-container">
                <Baby className="children-details-icon h-4 w-4 text-orange-500" />
                <Textarea
                  id="childrenDetails"
                  value={additionalDetails.childrenDetails}
                  onChange={(e) => onUpdateDetails("childrenDetails", e.target.value)}
                  placeholder="Please provide details about the children..."
                  className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={additionalDetails.pets}
                onCheckedChange={(checked) => onUpdateDetails("pets", checked)}
              />
              <Label 
                className="form-label text-gray-700 font-medium cursor-pointer"
                onClick={() => onUpdateDetails("pets", !additionalDetails.pets)}
              >
                Do you have pets? <span className="text-red-500">*</span>
              </Label>
            </div>
          </div>

          {additionalDetails.pets && (
            <PetDetails
              pets={additionalDetails.pets ? "yes" : "no"}
              petDetails={additionalDetails.petDetails}
              onPetsChange={(value) => onUpdateDetails("pets", value === "yes")}
              onPetDetailsChange={(details) => onUpdateDetails("petDetails", details)}
            />
          )}
        </CardContent>
      </Card>

      {/* Lifestyle & Preferences */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Car className="h-5 w-5" />
            </div>
            Lifestyle & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={additionalDetails.smoking}
                onCheckedChange={(checked) => onUpdateDetails("smoking", checked)}
              />
              <Label 
                className="form-label text-gray-700 font-medium cursor-pointer"
                onClick={() => onUpdateDetails("smoking", !additionalDetails.smoking)}
              >
                Do you smoke? <span className="text-red-500">*</span>
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={additionalDetails.parking}
                onCheckedChange={(checked) => onUpdateDetails("parking", checked)}
              />
              <Label 
                className="form-label text-gray-700 font-medium cursor-pointer"
                onClick={() => onUpdateDetails("parking", !additionalDetails.parking)}
              >
                Do you require parking? <span className="text-red-500">*</span>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequests" className="form-label text-gray-700 font-medium">
              Additional Requests or Requirements:
            </Label>
            <Textarea
              id="additionalRequests"
              value={additionalDetails.additionalRequests}
              onChange={(e) => onUpdateDetails("additionalRequests", e.target.value)}
              placeholder="Any additional requests or special requirements..."
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Data Button */}
      {onFillAllTestData && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onFillAllTestData}
            className="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            Fill All Test Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsStep;
