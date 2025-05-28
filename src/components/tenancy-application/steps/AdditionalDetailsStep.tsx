
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Calculator } from "lucide-react";
import { AdditionalDetails } from "@/domain/types/Applicant";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData: () => void;
  maxRent?: string;
}

const AdditionalDetailsStep = ({
  additionalDetails,
  onUpdateDetails,
  onFillAllTestData,
  maxRent = "0"
}: AdditionalDetailsStepProps) => {
  const monthlyRent = parseFloat(maxRent) || 0;
  const holdingDeposit = Math.round((monthlyRent / 4.33) * 100) / 100; // 1 week's rent
  const standardDeposit = monthlyRent * 6; // 6 weeks
  const totalDepositStandard = standardDeposit - holdingDeposit;
  const totalDepositPet = monthlyRent * 8 - holdingDeposit; // 8 weeks for pets

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
          <p className="text-gray-600">Please provide some additional information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fillTestData}>
            <TestTube className="h-4 w-4 mr-2" />
            Fill Step Data
          </Button>
          <Button variant="default" size="sm" onClick={onFillAllTestData}>
            <TestTube className="h-4 w-4 mr-2" />
            Fill All Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mobile-form-grid">
        <FormFieldWithTooltip
          label="Do you have a UK passport?"
          tooltip="This helps us verify your right to rent in the UK"
          required
          htmlFor="ukPassport"
        >
          <Select
            value={additionalDetails.ukPassport}
            onValueChange={(value) => onUpdateDetails("ukPassport", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Do you have any adverse credit history?"
          tooltip="This includes CCJs, bankruptcies, IVAs, or missed payments"
          required
          htmlFor="adverseCredit"
        >
          <Select
            value={additionalDetails.adverseCredit}
            onValueChange={(value) => onUpdateDetails("adverseCredit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>

        {additionalDetails.adverseCredit === "yes" && (
          <div className="md:col-span-2">
            <FormFieldWithTooltip
              label="Please provide details of adverse credit"
              tooltip="Explain any credit issues - this helps us understand your situation"
              htmlFor="adverseCreditDetails"
            >
              <Textarea
                id="adverseCreditDetails"
                value={additionalDetails.adverseCreditDetails}
                onChange={(e) => onUpdateDetails("adverseCreditDetails", e.target.value)}
                placeholder="Please provide details..."
                rows={3}
              />
            </FormFieldWithTooltip>
          </div>
        )}

        <FormFieldWithTooltip
          label="Will you require a guarantor?"
          tooltip="A guarantor is someone who guarantees to pay your rent if you cannot"
          required
          htmlFor="guarantorRequired"
        >
          <Select
            value={additionalDetails.guarantorRequired}
            onValueChange={(value) => onUpdateDetails("guarantorRequired", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Do you have any pets?"
          tooltip="Please specify type and number of pets"
          required
          htmlFor="pets"
        >
          <Input
            id="pets"
            value={additionalDetails.pets}
            onChange={(e) => onUpdateDetails("pets", e.target.value)}
            placeholder="e.g. 1 cat, no pets"
          />
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Number of children under 18"
          tooltip="How many children under 18 will be living in the property?"
          required
          htmlFor="under18Count"
        >
          <Select
            value={additionalDetails.under18Count}
            onValueChange={(value) => onUpdateDetails("under18Count", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number" />
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
        </FormFieldWithTooltip>

        {additionalDetails.under18Count !== "0" && additionalDetails.under18Count !== "" && (
          <FormFieldWithTooltip
            label="Ages of children"
            tooltip="Please specify the ages of all children under 18"
            htmlFor="childrenAges"
          >
            <Input
              id="childrenAges"
              value={additionalDetails.childrenAges}
              onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
              placeholder="e.g. 5, 8, 12"
            />
          </FormFieldWithTooltip>
        )}

        <div className="md:col-span-2">
          <FormFieldWithTooltip
            label="Conditions of offer"
            tooltip="Any specific conditions or requirements for your tenancy"
            htmlFor="conditionsOfOffer"
          >
            <Textarea
              id="conditionsOfOffer"
              value={additionalDetails.conditionsOfOffer}
              onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
              placeholder="Any specific conditions..."
              rows={3}
            />
          </FormFieldWithTooltip>
        </div>
      </div>

      {monthlyRent > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-orange-600" />
              Deposit Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Based on monthly rent of £{monthlyRent.toLocaleString()}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Holding Deposit (1 week):</span>
                    <Badge variant="secondary">£{holdingDeposit.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Standard Deposit (6 weeks):</span>
                    <Badge variant="secondary">£{totalDepositStandard.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pet Deposit (8 weeks):</span>
                    <Badge variant="secondary">£{totalDepositPet.toLocaleString()}</Badge>
                  </div>
                </div>
              </div>
              
              <FormFieldWithTooltip
                label="Deposit Type"
                tooltip="Standard deposit for properties without pets, or pet deposit if you have pets"
                required
                htmlFor="depositType"
              >
                <Select
                  value={additionalDetails.depositType}
                  onValueChange={(value) => onUpdateDetails("depositType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deposit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (£{totalDepositStandard.toLocaleString()})</SelectItem>
                    <SelectItem value="pet">Pet Deposit (£{totalDepositPet.toLocaleString()})</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWithTooltip>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdditionalDetailsStep;
