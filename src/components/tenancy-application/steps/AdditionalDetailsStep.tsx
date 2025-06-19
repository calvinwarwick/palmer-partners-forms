import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SwitchField } from "@/components/ui/switch-field";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Applicant } from "@/domain/types/Applicant";
import { PawPrint, Baby, CreditCard, MessageSquare, Users, Download, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
    // Calculate 5 weeks rent: monthly rent * 12 months / 52 weeks * 5 weeks
    return isNaN(numericRent) ? "0" : (numericRent * 12 / 52 * 5).toFixed(2);
  };

  const calculateRepositFees = (rentAmount: string) => {
    if (!rentAmount) return { cashDeposit: "0", repositFee: "0", upfrontSavings: "0" };
    
    const monthlyRent = parseFloat(rentAmount.replace(/[^\d.]/g, ''));
    if (isNaN(monthlyRent)) return { cashDeposit: "0", repositFee: "0", upfrontSavings: "0" };
    
    const cashDeposit = parseFloat((monthlyRent * 12 / 52 * 5).toFixed(2));
    let repositFee = parseFloat((cashDeposit / 5).toFixed(2));
    repositFee = repositFee < 150 ? 150 : repositFee;
    const upfrontSavings = parseFloat((cashDeposit - repositFee).toFixed(2));
    
    return {
      cashDeposit: cashDeposit.toFixed(2),
      repositFee: repositFee.toFixed(2),
      upfrontSavings: upfrontSavings.toFixed(2)
    };
  };

  const repositCalculations = calculateRepositFees(maxRent);

  const handlePdfAccess = () => {
    // Use the correct Supabase storage URL for the uploaded PDF
    const pdfUrl = 'https://akgmvwevnljjhcjgnzly.supabase.co/storage/v1/object/public/admin-files/1750247127695-Reposit_Tenant_deposit_information.pdf';
    
    // Try opening in new tab first
    const newWindow = window.open(pdfUrl, '_blank');
    
    // If popup was blocked, fallback to direct navigation
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = pdfUrl;
    }
  };

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h2 className="text-2xl font-bold text-dark-grey mb-2">Additional Information</h2>
        <p className="text-gray-600 mb-4">Please provide additional details about your application</p>
      </div>

      {/* Pets and Family Section */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30 rounded-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            Pets and Family
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Pets Section */}
          <div className="space-y-6">
            <SwitchField
              id="pets"
              label="Do you intend to have any pets at the property?"
              checked={additionalDetails.pets}
              onCheckedChange={(checked) => onUpdateDetails("pets", checked)}
            />
            
            {additionalDetails.pets && (
              <FormField
                label="Pet Details"
                required
                htmlFor="petDetails"
              >
                <Textarea
                  id="petDetails"
                  value={additionalDetails.petDetails || ""}
                  onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
                  placeholder="Please provide details about your pets (type, breed, age, etc.)"
                  rows={4}
                />
              </FormField>
            )}
          </div>

          {/* Children Section */}
          <div className="space-y-6">
            <FormField
              label="Do you have any children?"
              required
              htmlFor="childrenCount"
            >
              <Select 
                value={additionalDetails.childrenCount || ""} 
                onValueChange={(value) => {
                  onUpdateDetails("childrenCount", value);
                  onUpdateDetails("children", value !== "none");
                }}
              >
                <SelectTrigger id="childrenCount">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            
            {additionalDetails.children && additionalDetails.childrenCount !== "none" && (
              <FormField
                label="Children Details"
                required
                htmlFor="childrenDetails"
              >
                <Textarea
                  id="childrenDetails"
                  value={additionalDetails.childrenDetails || ""}
                  onChange={(e) => onUpdateDetails("childrenDetails", e.target.value)}
                  placeholder="Please provide ages of children living at the property full or part time. (e.g. Jess - 6, Robert - 15)*"
                  rows={3}
                />
              </FormField>
            )}
          </div>
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
            <FormField
              label="Deposit type"
              required
            >
              <RadioGroup 
                value={additionalDetails.depositType || ""} 
                onValueChange={(value) => onUpdateDetails("depositType", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="deposit-replacement" id="deposit-replacement" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="deposit-replacement" className="font-medium text-gray-900 cursor-pointer">
                      Deposit replacement
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      I would like to use a deposit replacement option. If application is agreed, please pass my details to Reposit so that I can begin this process.{" "}
                      {maxRent && (
                        <>
                          The fee for this is estimated to be £{repositCalculations.repositFee}, saving you £{repositCalculations.upfrontSavings} on upfront payment.{" "}
                        </>
                      )}
                      You can find more information about Reposit's deposit replacement scheme{" "}
                      <button 
                        type="button"
                        onClick={handlePdfAccess}
                        className="text-orange-500 hover:text-orange-600 underline cursor-pointer bg-transparent border-none p-0"
                      >
                        here
                      </button>.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="traditional-deposit" id="traditional-deposit" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="traditional-deposit" className="font-medium text-gray-900 cursor-pointer">
                      Traditional deposit
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      I would like to provide a traditional deposit equivalent to 5 weeks' rent
                      {maxRent && (
                        <> totalling £{calculateDepositAmount(maxRent)}</>
                      )} and I will ensure the full amount is paid before the tenancy begins.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </FormField>
            
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
            Conditions of Offer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <FormField
            label="Conditions of Offer"
            htmlFor="additionalRequests"
          >
            <Textarea
              id="additionalRequests"
              value={additionalDetails.additionalRequests || ""}
              onChange={(e) => onUpdateDetails("additionalRequests", e.target.value)}
              placeholder="Please provide any conditions attached to your offer that you would like to discuss with your landlord."
              rows={4}
            />
          </FormField>
          <p className="text-sm text-gray-500 mt-2">
            If approved, these conditions will be added to your tenancy agreement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
