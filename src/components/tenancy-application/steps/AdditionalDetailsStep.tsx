
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TestTube, Info, User } from "lucide-react";
import { AdditionalDetails, Applicant } from "@/domain/types/Applicant";
import { Button } from "@/components/ui/button";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData: () => void;
  maxRent: string;
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
        <p className="text-light-grey mb-4">Please provide some additional information about your application</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Adverse Credit Details for Individual Applicants */}
      {applicants.map((applicant, index) => (
        applicant.adverseCredit === "yes" && (
          <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
            <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Applicant {index + 1}
                {applicant.firstName && applicant.lastName && (
                  <span className="text-white font-normal">
                    - {applicant.firstName} {applicant.lastName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Adverse Credit Details:
                </Label>
                <Textarea
                  value={applicant.adverseCreditDetails}
                  onChange={(e) => onUpdateApplicant(applicant.id, "adverseCreditDetails", e.target.value)}
                  placeholder="Please provide details about adverse credit history..."
                  className="min-h-[100px] bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </CardContent>
          </Card>
        )
      ))}

      {/* Pets and Children Section - 3 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pets Section */}
        <Card className="border border-gray-200 shadow-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-dark-grey flex items-center">
                  Do you have any pets? <span className="text-red-500 ml-1">*</span>
                </Label>
                <Switch
                  checked={additionalDetails.pets === "yes"}
                  onCheckedChange={(checked) => onUpdateDetails("pets", checked ? "yes" : "no")}
                />
              </div>
              
              {additionalDetails.pets === "yes" && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-dark-grey mb-2 block">
                    Pet Details:
                  </Label>
                  <Textarea
                    value={additionalDetails.petDetails}
                    onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
                    placeholder="Please describe your pets (type, number, etc.)..."
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Children Section */}
        <Card className="border border-gray-200 shadow-sm lg:col-span-2" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium text-dark-grey mb-3 block flex items-center">
                    Number of children under 18 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={additionalDetails.under18Count} onValueChange={(value) => onUpdateDetails("under18Count", value)}>
                    <SelectTrigger id="under18Count" className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select number of children" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {additionalDetails.under18Count && additionalDetails.under18Count !== "0" && (
                  <div>
                    <Label className="text-sm font-medium text-dark-grey mb-2 block">
                      Ages of children:
                    </Label>
                    <Input
                      value={additionalDetails.childrenAges}
                      onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
                      placeholder="e.g., 5, 8, 12"
                      className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Section */}
      <Card className="border border-gray-200 shadow-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-base font-medium text-dark-grey flex items-center">
              Deposit Type <span className="text-red-500 ml-1">*</span>
            </Label>
            <RadioGroup 
              value={additionalDetails.depositType} 
              onValueChange={(value) => onUpdateDetails("depositType", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="traditional" id="traditional" />
                <Label htmlFor="traditional" className="text-sm text-dark-grey cursor-pointer">
                  Traditional Deposit - Equivalent to {maxRent ? `£${maxRent}` : '6 weeks rent'} held in a government-backed deposit protection scheme
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zero-deposit" id="zero-deposit" />
                <Label htmlFor="zero-deposit" className="text-sm text-dark-grey cursor-pointer">
                  Zero Deposit Option - Pay a one-time fee equivalent to one week's rent instead of a traditional deposit
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Conditions of Offer */}
      <Card className="border border-gray-200 shadow-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label className="text-base font-medium text-dark-grey mb-3 block">
              Any specific conditions or requests?
            </Label>
            <Textarea
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              placeholder="Please mention any specific conditions, requests, or additional information..."
              className="min-h-[100px] bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
