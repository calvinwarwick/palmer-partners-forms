
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TestTube } from "lucide-react";
import { AdditionalDetails } from "@/domain/types/Applicant";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData?: () => void;
}

const AdditionalDetailsStep = ({ additionalDetails, onUpdateDetails, onFillAllTestData }: AdditionalDetailsStepProps) => {
  const fillTestData = () => {
    console.log('Fill test data button clicked - Additional Details');
    console.log('Current additional details:', additionalDetails);
    
    const testDataEntries = [
      ['ukPassport', 'yes'],
      ['adverseCredit', 'no'],
      ['adverseCreditDetails', ''],
      ['guarantorRequired', 'no'],
      ['pets', 'yes - 1 cat'],
      ['under18Count', '0'],
      ['childrenAges', ''],
      ['conditionsOfOffer', 'Standard conditions accepted'],
      ['depositType', 'standard']
    ];

    testDataEntries.forEach(([field, value]) => {
      console.log(`Setting additional detail ${field} to ${value}`);
      onUpdateDetails(field as keyof AdditionalDetails, value);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData} className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Fill Step Data
          </Button>
          {onFillAllTestData && (
            <Button variant="default" size="sm" onClick={onFillAllTestData} className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Fill All Form Data
            </Button>
          )}
        </div>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="ukPassport" className="form-label">UK/EU Passport/ID *</Label>
                <select
                  id="ukPassport"
                  value={additionalDetails.ukPassport}
                  onChange={(e) => onUpdateDetails("ukPassport", e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="adverseCredit" className="form-label">Adverse Credit History *</Label>
                <select
                  id="adverseCredit"
                  value={additionalDetails.adverseCredit}
                  onChange={(e) => onUpdateDetails("adverseCredit", e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {additionalDetails.adverseCredit === "yes" && (
                <div>
                  <Label htmlFor="adverseCreditDetails" className="form-label">Credit Details</Label>
                  <textarea
                    id="adverseCreditDetails"
                    value={additionalDetails.adverseCreditDetails}
                    onChange={(e) => onUpdateDetails("adverseCreditDetails", e.target.value)}
                    className="form-control min-h-[100px] resize-none"
                    placeholder="Please provide details..."
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="guarantorRequired" className="form-label">Guarantor Required</Label>
                <select
                  id="guarantorRequired"
                  value={additionalDetails.guarantorRequired}
                  onChange={(e) => onUpdateDetails("guarantorRequired", e.target.value)}
                  className="form-select"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pets" className="form-label">Pets Details</Label>
                <textarea
                  id="pets"
                  value={additionalDetails.pets}
                  onChange={(e) => onUpdateDetails("pets", e.target.value)}
                  className="form-control min-h-[100px] resize-none"
                  placeholder="e.g., 1 cat, 2 dogs, or 'None'"
                />
              </div>
              
              <div>
                <Label htmlFor="under18Count" className="form-label">Children Under 18</Label>
                <select
                  id="under18Count"
                  value={additionalDetails.under18Count}
                  onChange={(e) => onUpdateDetails("under18Count", e.target.value)}
                  className="form-select"
                >
                  <option value="">Select count</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              {additionalDetails.under18Count && additionalDetails.under18Count !== "0" && (
                <div>
                  <Label htmlFor="childrenAges" className="form-label">Children Ages</Label>
                  <textarea
                    id="childrenAges"
                    value={additionalDetails.childrenAges}
                    onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
                    className="form-control min-h-[80px] resize-none"
                    placeholder="e.g., 5, 8, 12"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="depositType" className="form-label">Preferred Deposit Type</Label>
                <select
                  id="depositType"
                  value={additionalDetails.depositType}
                  onChange={(e) => onUpdateDetails("depositType", e.target.value)}
                  className="form-select"
                >
                  <option value="">Select deposit type</option>
                  <option value="standard">Standard Deposit</option>
                  <option value="no-deposit">No Deposit Scheme</option>
                  <option value="guarantor">Guarantor</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="conditionsOfOffer" className="form-label">Conditions of Offer</Label>
            <textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              className="form-control min-h-[120px] resize-none"
              placeholder="Any special conditions or requests..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalDetailsStep;
