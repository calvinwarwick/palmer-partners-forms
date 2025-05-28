
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TestTube } from "lucide-react";
import { AdditionalDetails } from "@/domain/types/Applicant";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
}

const AdditionalDetailsStep = ({ additionalDetails, onUpdateDetails }: AdditionalDetailsStepProps) => {
  const fillTestData = () => {
    onUpdateDetails("ukPassport", "yes");
    onUpdateDetails("adverseCredit", "no");
    onUpdateDetails("adverseCreditDetails", "");
    onUpdateDetails("guarantorRequired", "no");
    onUpdateDetails("pets", "yes - 1 cat");
    onUpdateDetails("under18Count", "0");
    onUpdateDetails("childrenAges", "");
    onUpdateDetails("conditionsOfOffer", "Standard conditions accepted");
    onUpdateDetails("depositType", "standard");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="form-floating">
                <select
                  id="ukPassport"
                  value={additionalDetails.ukPassport}
                  onChange={(e) => onUpdateDetails("ukPassport", e.target.value)}
                  className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <label htmlFor="ukPassport" className="text-muted-foreground">UK/EU Passport/ID *</label>
              </div>
              
              <div className="form-floating">
                <select
                  id="adverseCredit"
                  value={additionalDetails.adverseCredit}
                  onChange={(e) => onUpdateDetails("adverseCredit", e.target.value)}
                  className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <label htmlFor="adverseCredit" className="text-muted-foreground">Adverse Credit History *</label>
              </div>

              {additionalDetails.adverseCredit === "yes" && (
                <div className="form-floating">
                  <textarea
                    id="adverseCreditDetails"
                    value={additionalDetails.adverseCreditDetails}
                    onChange={(e) => onUpdateDetails("adverseCreditDetails", e.target.value)}
                    className="form-control min-h-[100px] resize-none"
                    placeholder="Please provide details..."
                  />
                  <label htmlFor="adverseCreditDetails" className="text-muted-foreground">Credit Details</label>
                </div>
              )}
              
              <div className="form-floating">
                <select
                  id="guarantorRequired"
                  value={additionalDetails.guarantorRequired}
                  onChange={(e) => onUpdateDetails("guarantorRequired", e.target.value)}
                  className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <label htmlFor="guarantorRequired" className="text-muted-foreground">Guarantor Required</label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="form-floating">
                <textarea
                  id="pets"
                  value={additionalDetails.pets}
                  onChange={(e) => onUpdateDetails("pets", e.target.value)}
                  className="form-control min-h-[100px] resize-none"
                  placeholder="e.g., 1 cat, 2 dogs, or 'None'"
                />
                <label htmlFor="pets" className="text-muted-foreground">Pets Details</label>
              </div>
              
              <div className="form-floating">
                <select
                  id="under18Count"
                  value={additionalDetails.under18Count}
                  onChange={(e) => onUpdateDetails("under18Count", e.target.value)}
                  className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select count</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
                <label htmlFor="under18Count" className="text-muted-foreground">Children Under 18</label>
              </div>

              {additionalDetails.under18Count && additionalDetails.under18Count !== "0" && (
                <div className="form-floating">
                  <textarea
                    id="childrenAges"
                    value={additionalDetails.childrenAges}
                    onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
                    className="form-control min-h-[80px] resize-none"
                    placeholder="e.g., 5, 8, 12"
                  />
                  <label htmlFor="childrenAges" className="text-muted-foreground">Children Ages</label>
                </div>
              )}
              
              <div className="form-floating">
                <select
                  id="depositType"
                  value={additionalDetails.depositType}
                  onChange={(e) => onUpdateDetails("depositType", e.target.value)}
                  className="form-select w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select deposit type</option>
                  <option value="standard">Standard Deposit</option>
                  <option value="no-deposit">No Deposit Scheme</option>
                  <option value="guarantor">Guarantor</option>
                </select>
                <label htmlFor="depositType" className="text-muted-foreground">Preferred Deposit Type</label>
              </div>
            </div>
          </div>
          
          <div className="form-floating">
            <textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              className="form-control min-h-[120px] resize-none"
              placeholder="Any special conditions or requests..."
            />
            <label htmlFor="conditionsOfOffer" className="text-muted-foreground">Conditions of Offer</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
