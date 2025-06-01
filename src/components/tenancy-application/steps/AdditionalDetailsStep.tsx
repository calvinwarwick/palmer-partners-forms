
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Heart } from "lucide-react";
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
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Additional Details</h3>
        <p className="text-light-grey mb-4">Tell us more about your requirements and preferences</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Further Information */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="h-5 w-5" />
            </div>
            Further Information
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
                How many people under the age of 18 will be living in the property? <span className="text-red-500">*</span>
              </Label>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="petDetails" className="form-label text-gray-700 font-medium">
                Please provide details about your pets:
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
            Fill All Test Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsStep;
