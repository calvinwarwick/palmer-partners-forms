
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdditionalDetails } from "@/domain/types/Applicant";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
}

const AdditionalDetailsStep = ({ additionalDetails, onUpdateDetails }: AdditionalDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Additional Applicant Details</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Background Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Do you hold a UK or Republic of Ireland passport? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ukPassport"
                  value="yes"
                  checked={additionalDetails.ukPassport === "yes"}
                  onChange={(e) => onUpdateDetails("ukPassport", e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ukPassport"
                  value="no"
                  checked={additionalDetails.ukPassport === "no"}
                  onChange={(e) => onUpdateDetails("ukPassport", e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium">Do you have any current or historical adverse credit e.g., debt management, IVA, CCJ or bankruptcy? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="adverseCredit"
                  value="yes"
                  checked={additionalDetails.adverseCredit === "yes"}
                  onChange={(e) => onUpdateDetails("adverseCredit", e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="adverseCredit"
                  value="no"
                  checked={additionalDetails.adverseCredit === "no"}
                  onChange={(e) => onUpdateDetails("adverseCredit", e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
            {additionalDetails.adverseCredit === "yes" && (
              <div className="mt-4">
                <Label htmlFor="adverseCreditDetails">Please provide details on any adverse credit</Label>
                <Textarea
                  id="adverseCreditDetails"
                  value={additionalDetails.adverseCreditDetails}
                  onChange={(e) => onUpdateDetails("adverseCreditDetails", e.target.value)}
                  placeholder="Please provide details..."
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label className="text-base font-medium">If required, can you supply a guarantor for this proposed tenancy? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="guarantorRequired"
                  value="yes"
                  checked={additionalDetails.guarantorRequired === "yes"}
                  onChange={(e) => onUpdateDetails("guarantorRequired", e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="guarantorRequired"
                  value="no"
                  checked={additionalDetails.guarantorRequired === "no"}
                  onChange={(e) => onUpdateDetails("guarantorRequired", e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Further Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Do you intend to have any pets at the property? *</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  value="yes"
                  checked={additionalDetails.pets === "yes"}
                  onChange={(e) => onUpdateDetails("pets", e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  value="no"
                  checked={additionalDetails.pets === "no"}
                  onChange={(e) => onUpdateDetails("pets", e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="under18Count">How many people under the age of 18 will be living in the property? *</Label>
            <Input
              id="under18Count"
              type="number"
              min="0"
              value={additionalDetails.under18Count}
              onChange={(e) => onUpdateDetails("under18Count", e.target.value)}
              placeholder="0"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="childrenAges">Please provide ages of children living at the property full or part time. (e.g. Jess - 6, Robert - 15)</Label>
            <Input
              id="childrenAges"
              value={additionalDetails.childrenAges}
              onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
              placeholder="e.g., Sarah - 8, Tom - 14"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conditions of Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="conditionsOfOffer">Please provide any conditions attached to your offer that you would like to discuss with your landlord.</Label>
            <p className="text-sm text-gray-600 mb-2">If approved, these conditions will be added to your tenancy agreement.</p>
            <Textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              placeholder="Enter any special conditions or requests..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deposit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Please select which deposit option you would prefer to use. Please note that a deposit replacement can only be offered upon agreement from the landlord of your preferred property.</p>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="depositType"
                value="replacement"
                checked={additionalDetails.depositType === "replacement"}
                onChange={(e) => onUpdateDetails("depositType", e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Deposit replacement</div>
                <p className="text-sm text-gray-600 mt-1">
                  I would like to use a deposit replacement option, if application is agreed, please pass my details to Reposit so that I can begin this process. The fee for this is estimated to be £150.00, saving you £0.00 on upfront payment. You can find more information about Reposit's deposit replacement scheme here.
                </p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="depositType"
                value="traditional"
                checked={additionalDetails.depositType === "traditional"}
                onChange={(e) => onUpdateDetails("depositType", e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Traditional deposit</div>
                <p className="text-sm text-gray-600 mt-1">
                  I would like to provide a traditional deposit equivalent to 5 weeks' rent totalling £141.92 and I will ensure the full amount is paid before the tenancy begins.
                </p>
              </div>
            </label>
          </div>
          
          <p className="text-xs text-gray-500">
            Please note, the above sums are estimated and are based on the "Rental amount" that you have entered at the top of this form and will change if your application is agreed at a different rent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
