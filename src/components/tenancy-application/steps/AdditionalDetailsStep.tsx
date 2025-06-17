
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomToggle } from "@/components/ui/custom-toggle";
import { Applicant } from "@/domain/types/Applicant";
import { PawPrint, Baby, CreditCard, MessageSquare } from "lucide-react";

interface AdditionalDetailsStepProps {
  additionalDetails: any;
  onUpdateDetails: (field: string, value: string | boolean) => void;
  maxRent: string;
  applicants: Applicant[];
  onUpdateApplicant: (id: string, field: keyof Applicant, value: string) => void;
}

const AdditionalDetailsStep = ({ 
  additionalDetails, 
  onUpdateDetails, 
  maxRent, 
  applicants, 
  onUpdateApplicant 
}: AdditionalDetailsStepProps) => {
  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    const numericAmount = parseFloat(amount.replace(/[^\d.]/g, ''));
    return isNaN(numericAmount) ? "" : `£${numericAmount.toLocaleString()}`;
  };

  const calculateDepositAmount = (rentAmount: string) => {
    if (!rentAmount) return "0";
    const numericRent = parseFloat(rentAmount.replace(/[^\d.]/g, ''));
    return isNaN(numericRent) ? "0" : (numericRent * 5).toLocaleString();
  };

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h2 className="text-2xl font-bold text-dark-grey mb-2">Additional Information</h2>
        <p className="text-gray-600 mb-4">Please provide additional details about your application</p>
      </div>

      {/* Pets Section */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <PawPrint className="h-5 w-5" />
            </div>
            Pet Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <CustomToggle
            id="pets"
            label="Do you have any pets?"
            checked={additionalDetails.pets}
            onCheckedChange={(checked) => onUpdateDetails("pets", checked)}
            required={true}
          />
          
          {additionalDetails.pets && (
            <div>
              <Label htmlFor="petDetails" className="text-sm font-medium text-gray-700 mb-2 block">
                Pet Details <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="petDetails"
                value={additionalDetails.petDetails || ""}
                onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
                placeholder="Please provide details about your pets (type, breed, age, etc.)"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                required={additionalDetails.pets}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Children Section */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <Baby className="h-5 w-5" />
            </div>
            Children Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <CustomToggle
            id="children"
            label="Do you have any children?"
            checked={additionalDetails.children}
            onCheckedChange={(checked) => onUpdateDetails("children", checked)}
            required={true}
          />
          
          {additionalDetails.children && (
            <div>
              <Label htmlFor="childrenDetails" className="text-sm font-medium text-gray-700 mb-2 block">
                Children Details <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="childrenDetails"
                value={additionalDetails.childrenDetails || ""}
                onChange={(e) => onUpdateDetails("childrenDetails", e.target.value)}
                placeholder="Please provide details about your children (ages, etc.)"
                className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
                required={additionalDetails.children}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Type Section */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <CreditCard className="h-5 w-5" />
            </div>
            Deposit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Deposit type <span className="text-red-500">*</span>
            </Label>
            
            <RadioGroup 
              value={additionalDetails.depositType || ""} 
              onValueChange={(value) => onUpdateDetails("depositType", value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl">
                <RadioGroupItem value="deposit-replacement" id="deposit-replacement" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="deposit-replacement" className="font-medium text-gray-900 cursor-pointer">
                    Deposit replacement
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    I would like to use a deposit replacement option, if application is agreed, please pass my details to Reposit so that I can begin this process. You can find more information about Reposit's deposit replacement scheme{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">here</a>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl">
                <RadioGroupItem value="traditional-deposit" id="traditional-deposit" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="traditional-deposit" className="font-medium text-gray-900 cursor-pointer">
                    Traditional deposit
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    I would like to provide a traditional deposit equivalent to 5 weeks' rent and I will ensure the full amount is paid before the tenancy begins.
                  </p>
                  {maxRent && (
                    <p className="text-sm text-gray-500 mt-2">
                      Based on rent of {formatCurrency(maxRent)}, deposit would be approximately £{calculateDepositAmount(maxRent)}
                    </p>
                  )}
                </div>
              </div>
            </RadioGroup>
            
            <p className="text-sm text-gray-500 mt-2">
              Please note, the above sums are estimated and are based on the "Rental amount" that you have entered at the top of this form and will change if your application is agreed at a different rent.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Requests */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare className="h-5 w-5" />
            </div>
            Additional Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="additionalRequests" className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Requests or Comments
            </Label>
            <Textarea
              id="additionalRequests"
              value={additionalDetails.additionalRequests || ""}
              onChange={(e) => onUpdateDetails("additionalRequests", e.target.value)}
              placeholder="Any additional requests or comments..."
              className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
