
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdditionalDetails, Applicant } from "@/domain/types/Applicant";
import { PetDetails } from "./PetDetails";
import { AlertCircle } from "lucide-react";

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
    <div className="space-y-6 font-lexend">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Additional Details</h2>
        <p className="text-muted-foreground mb-4">Provide additional information for your application</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <div className="grid gap-6">
        {/* UK Passport */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>UK or Republic of Ireland Passport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ukPassport" className="text-sm font-medium">
                Do you hold a UK or Republic of Ireland passport?
              </Label>
              <Switch
                id="ukPassport"
                checked={additionalDetails.ukPassport === "yes"}
                onCheckedChange={(checked) => onUpdateDetails('ukPassport', checked ? "yes" : "no")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Adverse Credit */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="adverseCredit" className="text-sm font-medium">
                Do you have any current or historical adverse credit e.g., debt management, VA, CCJ or bankruptcy?
              </Label>
              <Switch
                id="adverseCredit"
                checked={additionalDetails.adverseCredit === "yes"}
                onCheckedChange={(checked) => onUpdateDetails('adverseCredit', checked ? "yes" : "no")}
              />
            </div>

            {additionalDetails.adverseCredit === "yes" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Information Required</h4>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      Please provide details about your adverse credit history. This information helps us better understand your circumstances and may not necessarily affect your application.
                    </p>
                  </div>
                </div>
                <Textarea
                  value={additionalDetails.adverseCreditDetails}
                  onChange={(e) => onUpdateDetails('adverseCreditDetails', e.target.value)}
                  placeholder="Please provide details about your adverse credit history..."
                  rows={3}
                  className="form-control mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guarantor Required */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Guarantor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="guarantorRequired" className="text-sm font-medium">
                If required, can you supply a guarantor for this proposed tenancy?
              </Label>
              <Switch
                id="guarantorRequired"
                checked={additionalDetails.guarantorRequired === "yes"}
                onCheckedChange={(checked) => onUpdateDetails('guarantorRequired', checked ? "yes" : "no")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pets */}
        <PetDetails 
          pets={additionalDetails.pets}
          petDetails={additionalDetails.petDetails}
          onPetsChange={(value) => onUpdateDetails('pets', value)}
          onPetDetailsChange={(value) => onUpdateDetails('petDetails', value)}
        />

        {/* Under 18s */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Under 18s</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="under18Count">Number of occupants under 18</Label>
              <Select
                value={additionalDetails.under18Count}
                onValueChange={(value) => onUpdateDetails('under18Count', value)}
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {additionalDetails.under18Count && parseInt(additionalDetails.under18Count) > 0 && (
              <div>
                <Label htmlFor="childrenAges">Ages of children</Label>
                <Input
                  id="childrenAges"
                  value={additionalDetails.childrenAges}
                  onChange={(e) => onUpdateDetails('childrenAges', e.target.value)}
                  placeholder="e.g., 5, 8, 12"
                  className="form-control"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions of Offer */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Conditions of Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="conditionsOfOffer">Any special conditions or requests?</Label>
            <Textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails('conditionsOfOffer', e.target.value)}
              placeholder="Enter any special conditions or requests..."
              rows={3}
              className="form-control"
            />
          </CardContent>
        </Card>

        {/* Deposit Type */}
        <Card className="form-card">
          <CardHeader>
            <CardTitle>Deposit Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={additionalDetails.depositType}
              onValueChange={(value) => onUpdateDetails('depositType', value)}
            >
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select deposit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional Deposit</SelectItem>
                <SelectItem value="deposit-replacement">Deposit Replacement Scheme</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;
