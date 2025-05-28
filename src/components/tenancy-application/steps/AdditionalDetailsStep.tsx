import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AdditionalDetails } from "@/domain/types/Applicant";
import FormFieldWithTooltip from "@/components/ui/form-field-with-tooltip";

interface AdditionalDetailsStepProps {
  additionalDetails: AdditionalDetails;
  onUpdateDetails: (field: keyof AdditionalDetails, value: string) => void;
  onFillAllTestData: () => void;
  maxRent: string;
}

const AdditionalDetailsStep = ({ 
  additionalDetails, 
  onUpdateDetails, 
  onFillAllTestData,
  maxRent 
}: AdditionalDetailsStepProps) => {
  const weeklyRent = maxRent ? Math.round(parseFloat(maxRent) / 4.33) : 0;
  const holdingDeposit = weeklyRent;
  const traditionalDeposit = Math.round(weeklyRent * 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Additional Details</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onFillAllTestData}
          className="flex items-center gap-2 fill progress-fill border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Fill Test Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldWithTooltip
          label="Do you have a UK passport?"
          tooltip="A UK passport helps with identity verification and right to rent checks"
          required
          htmlFor="ukPassport"
        >
          <Select
            value={additionalDetails.ukPassport}
            onValueChange={(value) => onUpdateDetails("ukPassport", value)}
          >
            <SelectTrigger className="form-control">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Do you have any adverse credit history?"
          tooltip="This includes CCJs, defaults, missed payments, or bankruptcy history"
          required
          htmlFor="adverseCredit"
        >
          <Select
            value={additionalDetails.adverseCredit}
            onValueChange={(value) => onUpdateDetails("adverseCredit", value)}
          >
            <SelectTrigger className="form-control">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>
      </div>

      {additionalDetails.adverseCredit === "yes" && (
        <div>
          <FormFieldWithTooltip
            label="Please provide details of your adverse credit history"
            tooltip="Include details of any CCJs, defaults, missed payments, or other credit issues"
            required
            htmlFor="adverseCreditDetails"
          >
            <Textarea
              id="adverseCreditDetails"
              value={additionalDetails.adverseCreditDetails}
              onChange={(e) => onUpdateDetails("adverseCreditDetails", e.target.value)}
              placeholder="Please provide details..."
              className="form-control min-h-[100px]"
            />
          </FormFieldWithTooltip>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldWithTooltip
          label="Will you require a guarantor?"
          tooltip="A guarantor is someone who guarantees to pay rent if you're unable to"
          required
          htmlFor="guarantorRequired"
        >
          <Select
            value={additionalDetails.guarantorRequired}
            onValueChange={(value) => onUpdateDetails("guarantorRequired", value)}
          >
            <SelectTrigger className="form-control">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>

        <FormFieldWithTooltip
          label="Do you have any pets?"
          tooltip="Some properties have pet restrictions"
          required
          htmlFor="pets"
        >
          <Select
            value={additionalDetails.pets}
            onValueChange={(value) => onUpdateDetails("pets", value)}
          >
            <SelectTrigger className="form-control">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWithTooltip>
      </div>

      {additionalDetails.pets === "yes" && (
        <div>
          <FormFieldWithTooltip
            label="Please provide details about your pets"
            tooltip="Include type and number of pets"
            required
            htmlFor="petDetails"
          >
            <Textarea
              id="petDetails"
              value={additionalDetails.petDetails || ""}
              onChange={(e) => onUpdateDetails("petDetails", e.target.value)}
              placeholder="e.g., 1 cat, 2 dogs, etc."
              className="form-control min-h-[100px]"
            />
          </FormFieldWithTooltip>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldWithTooltip
          label="Number of children under 18"
          tooltip="Include any children who will be living in the property"
          htmlFor="under18Count"
        >
          <Select
            value={additionalDetails.under18Count}
            onValueChange={(value) => onUpdateDetails("under18Count", value)}
          >
            <SelectTrigger className="form-control">
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

        {additionalDetails.under18Count && additionalDetails.under18Count !== "0" && (
          <FormFieldWithTooltip
            label="Ages of children"
            tooltip="Please list the ages of all children under 18"
            htmlFor="childrenAges"
          >
            <Input
              id="childrenAges"
              value={additionalDetails.childrenAges}
              onChange={(e) => onUpdateDetails("childrenAges", e.target.value)}
              placeholder="e.g., 5, 8, 12"
              className="form-control"
            />
          </FormFieldWithTooltip>
        )}
      </div>

      <div>
        <FormFieldWithTooltip
          label="Conditions of offer"
          tooltip="Any special conditions or requirements for your tenancy offer"
          htmlFor="conditionsOfOffer"
        >
          <Textarea
            id="conditionsOfOffer"
            value={additionalDetails.conditionsOfOffer}
            onChange={(e) => onUpdateDetails("conditionsOfOffer", e.target.value)}
            placeholder="Any special conditions or requirements..."
            className="form-control min-h-[100px]"
          />
        </FormFieldWithTooltip>
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Deposit</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please select which deposit option you would prefer to use. Please note that a deposit replacement can only be offered upon agreement from the landlord of your preferred property.
          </p>
        </div>

        <FormFieldWithTooltip
          label="Deposit type"
          tooltip="Choose between a deposit replacement service or traditional deposit payment"
          required
          htmlFor="depositType"
        >
          <RadioGroup
            value={additionalDetails.depositType}
            onValueChange={(value) => onUpdateDetails("depositType", value)}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border border-input rounded-lg">
              <RadioGroupItem value="replacement" id="replacement" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="replacement" className="font-medium text-foreground cursor-pointer">
                  Deposit replacement
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  I would like to use a deposit replacement option, if application is agreed, please pass my details to Reposit so that I can begin this process. You can find more information about Reposit's deposit replacement scheme here.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border border-input rounded-lg">
              <RadioGroupItem value="traditional" id="traditional" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="traditional" className="font-medium text-foreground cursor-pointer">
                  Traditional deposit
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  I would like to provide a traditional deposit equivalent to 5 weeks' rent{traditionalDeposit > 0 ? ` (£${traditionalDeposit})` : ''} and I will ensure the full amount is paid before the tenancy begins.
                </p>
              </div>
            </div>
          </RadioGroup>
        </FormFieldWithTooltip>

        {maxRent && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Please note:</strong> The above sums are estimated and are based on the "Rental amount" that you have entered at the top of this form and will change if your application is agreed at a different rent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;
