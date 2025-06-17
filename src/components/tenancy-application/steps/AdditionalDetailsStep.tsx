
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomToggle } from "@/components/ui/custom-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, FileText } from "lucide-react";
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
    childrenCount?: string;
    conditionsOfOffer?: string;
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
  const handleChildrenCountChange = (value: string) => {
    const hasChildren = value !== "None";
    onUpdateDetails("children", hasChildren);
    onUpdateDetails("childrenCount", value);
    if (!hasChildren) {
      onUpdateDetails("childrenDetails", "");
    }
  };

  // Get current children count value for select
  const getCurrentChildrenCount = () => {
    if (additionalDetails.childrenCount) {
      return additionalDetails.childrenCount;
    }
    if (!additionalDetails.children) return "None";
    return "1"; // Default fallback
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Additional Details</h3>
        <p className="text-light-grey mb-4">Tell us more about your requirements and preferences</p>
        <div className="border-b border-gray-200 mb-6" style={{ marginTop: '10px' }}></div>
      </div>

      {/* Conditions of Offer */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
        <CardHeader className="pb-4 bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Conditions of Offer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="conditionsOfOffer" className="form-label text-gray-700 font-medium">
              Please provide any conditions attached to your offer that you would like to discuss with your landlord.
              If approved, these conditions will be added to your tenancy agreement.
            </Label>
            <Textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer || ""}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              placeholder="Enter any conditions you would like to discuss with your landlord..."
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Further Information */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
        <CardHeader className="pb-4 bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="h-5 w-5" />
            </div>
            Further Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="childrenCount" className="form-label text-gray-700 font-medium">
              How many people under the age of 18 will be living in the property? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={getCurrentChildrenCount()}
              onValueChange={handleChildrenCountChange}
            >
              <SelectTrigger className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select number of children" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5+">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {additionalDetails.children && (
            <div className="space-y-2">
              <Label htmlFor="childrenDetails" className="form-label text-gray-700 font-medium">
                Please provide ages of children living at the property full or part time. (e.g. Jess - 6, Robert - 15) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="childrenDetails"
                value={additionalDetails.childrenDetails}
                onChange={(e) => onUpdateDetails("childrenDetails", e.target.value)}
                placeholder="Please provide ages of children..."
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
              />
            </div>
          )}

          <CustomToggle
            id="pets"
            label="Do you intend to have any pets at the property?"
            checked={additionalDetails.pets}
            onCheckedChange={(checked) => onUpdateDetails("pets", checked)}
            required={true}
          />

          {additionalDetails.pets && (
            <div className="space-y-2">
              <Label htmlFor="petDetails" className="form-label text-gray-700 font-medium">
                Please provide details about your pets: <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="petDetails"
                value={additionalDetails.petDetails}
                onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
                placeholder="Please provide details about the pets..."
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
              />
            </div>
          )}
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
            Fill Form
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsStep;
